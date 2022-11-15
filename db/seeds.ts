
import { SecurePassword } from "blitz"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import db from "./index"
import newMatches from "./newMatches";
import groups from "./groups";
import quizQuestions from "./quizQuestions"
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

const seed = async () => {
  const teamsDB = await db.team.findMany()

  if (teamsDB.length === 0) {
   const teams = groups.groups.reduce((teams,group) => [
      ...teams,
      ...group.teams.map(team => ({
        group: group.letter,
        countryCode: team.country,
        name: team.name
      })),
    ], []);

    teams.forEach(async team => {
      try {
        const teamDB = await db.team.create({
          data: { name: team.name, countryCode: team.countryCode, group: team.group },
        })

        teamsDB.push(teamDB)
      } catch (error) {}
    })
  }

  const matchCount = await db.match.count()
  if (matchCount === 0) {

        newMatches.forEach(async match => {
          try {
            await db.match.create({
              data: {
                homeTeam: {
                  connect: {
                    name: match.home_team.name,
                  },
                },
                awayTeam: {
                  connect: {
                    name: match.away_team.name,
                  },
                },
                arena: match.venue,
                // Not sure how important this is
                round: `1`,
                kickOff: match.datetime
              },
            })
          } catch (error) {}
      })


    }
  

  const quizQuestionsCount = await db.quizQuestion.count()
  if (quizQuestionsCount === 0) {
    for (let i = 0; i < quizQuestions.length; i++) {
      const quizQuestion = quizQuestions[i]

      await db.quizQuestion.create({
        data: {
          translations: {
            createMany: {
              data: quizQuestion,
            },
          },
        },
      })
    }
  }

  const usersCount = await db.user.count()
  if (usersCount <= 1) {
    // example@example gets generated from tests.
    const hashedPassword = await SecurePassword.hash(process.env.GISK_ADMIN_PASSWORD)
    await db.user.create({
      data: {
        email: "gisk@gisk.app",
        hashedPassword,
        name: "Gisk Admin",
        role: "ADMIN",
        language: "en",
      },
    })
  }
}

export default seed
