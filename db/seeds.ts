import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import db from "./index"
import matches from "./matches"
import teams from "./teams"
import quizQuestions from "./quizQuestions"

dayjs.extend(customParseFormat)

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
              kickOff: dayjs(match.kickOff, "DD/MM/YYYY HH:mm").toDate(),
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
}

export default seed
