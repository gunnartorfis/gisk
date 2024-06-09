import { SecurePassword } from "@blitzjs/auth/secure-password"
// https://github.com/openfootball/euro.json/blob/master/2024/euro.json
import matches from "./data/euro2024.json"
// https://github.com/openfootball/euro.json/blob/master/2024/euro.groups.json
import groups from "./data/euro2024.groups.json"
import { PrismaClient } from "@prisma/client"
import { connect } from "http2"

const db = new PrismaClient()

const tournament = groups.name

const main = async () => {
  const teamsDB = await db.team.findMany()

  let tournamentDB = await db.tournament.findFirst({
    where: {
      name: tournament,
    },
  })

  if (!tournamentDB) {
    tournamentDB = await db.tournament.create({
      data: {
        name: tournament,
        startDate: new Date("2024-06-14"),
        endDate: new Date("2024-07-14"),
      },
    })
  }

  if (teamsDB.length === 0) {
    const teams = groups.groups.reduce(
      (teams, group) => [
        ...teams,
        ...group.teams.map((team) => ({
          countryCode: team.code,
          name: team.name,
          group: group.name,
        })),
      ],
      []
    )

    const teamsPromises = teams.map(async (team) => {
      try {
        // does team exist?
        let teamDB = await db.team.findFirst({
          where: { name: team.name },
        })

        if (teamDB) {
          return
        }

        console.log("Creating team with tournament", team.name, tournamentDB!.id)

        teamDB = await db.team.create({
          data: {
            name: team.name,
            countryCode: team.countryCode,
          },
        })

        await db.teamTournament.create({
          data: {
            teamId: teamDB.id,
            tournamentId: tournamentDB.id,
            group: team.group,
          },
        })

        teamsDB.push(teamDB)
      } catch (error) {
        console.error(error)
      }
    })
    await Promise.all(teamsPromises)
  }

  const matchCount = await db.match.count({
    where: {
      tournament: {
        name: tournament,
      },
    },
  })
  // matches is an array of rounds, but we just want to flatten that
  const newMatches = matches.rounds.map((round) => round.matches).flat()

  if (matchCount === 0) {
    newMatches.forEach(async (match) => {
      const kickOff = new Date(match.date)
      kickOff.setHours(Number(match.time.split(":")[0]))
      kickOff.setMinutes(Number(match.time.split(":")[1]))

      try {
        await db.match.create({
          data: {
            homeTeam: {
              connect: {
                name: match.team1.name,
              },
            },
            awayTeam: {
              connect: {
                name: match.team2.name,
              },
            },
            // not included in the data this year
            arena: "",
            // Not sure how important this is
            round: `1`,
            kickOff,
            tournament: {
              connect: {
                id: tournamentDB.id,
              },
            },
          },
        })
      } catch (error) {
        console.log("MATCH", match)
      }
    })
  }

  // const usersCount = await db.user.count()
  // if (usersCount <= 1) {
  //   const hashedPassword = await SecurePassword.hash(process.env.GISK_ADMIN_PASSWORD)
  //   await db.user.create({
  //     data: {
  //       email: "gisk@gisk.app",
  //       hashedPassword,
  //       name: "Gisk Admin",
  //       role: "ADMIN",
  //       language: "en",
  //     },
  //   })
  // }
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
