import { SecurePassword } from "blitz"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import db from "./index"
import matches from "./matches"
import quizQuestions from "./quizQuestions"
import teams from "./teams"

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

const seed = async () => {
  const teamsDB = await db.team.findMany()

  if (teamsDB.length === 0) {
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i]
      try {
        const teamDB = await db.team.create({
          data: { name: team.name, countryCode: team.countryCode, group: team.group },
        })

        teamsDB.push(teamDB)
      } catch (error) {}
    }
  }

  const matchCount = await db.match.count()
  if (matchCount === 0) {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]

      const homeTeam = teamsDB.find((team) => team.name === match.homeTeamName)
      const awayTeam = teamsDB.find((team) => team.name === match.awayTeamName)

      if (homeTeam && awayTeam) {
        const randomDaysToAdd = Math.floor(Math.random() * 30)
        const kickOff = dayjs
          .tz(match.kickOff, "DD/MM/YYYY HH:mm [CET]", "CET")
          .set("month", dayjs().month())
          .set("day", dayjs().day())
          .add(randomDaysToAdd, "days")
          .tz("GMT")
          .toDate()
        try {
          await db.match.create({
            data: {
              homeTeam: {
                connect: {
                  name: homeTeam.name,
                },
              },
              awayTeam: {
                connect: {
                  name: match.awayTeamName,
                },
              },
              arena: match.arena,
              round: `${match.round}`,
              kickOff: kickOff,
            },
          })
        } catch (error) {}
      }
    }
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
