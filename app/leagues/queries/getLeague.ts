import { calculateScoreForMatch } from "app/matches/queries/getMatches"
import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetLeague = z.object({
  id: z.string(),
})

export default resolver.pipe(resolver.zod(GetLeague), resolver.authorize(), async ({ id }, ctx) => {
  const league = await db.league.findFirst({
    where: {
      id,
      deletedAt: null,
      UserLeague: {
        some: {
          userId: ctx.session.userId,
        },
      },
    },
    include: {
      UserLeague: {
        include: {
          user: true,
        },
      },
    },
  })

  const matches = await db.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  })

  const usersInLeague = league?.UserLeague.map((ul) => ul.userId) ?? []

  const predictionsForUsers = await db.userLeagueMatch.findMany({
    where: {
      userId: {
        in: usersInLeague,
      },
    },
  })

  if (!league) throw new NotFoundError()

  const questionsForUsers = await db.quizQuestion.findMany({
    include: {
      UserQuizQuestion: {
        where: {
          userId: {
            in: usersInLeague,
          },
        },
      },
      translations: true,
    },
  })

  const teams = await db.team.findMany()
  const players = await db.player.findMany()
  const getAnswer = (answerId?: string | null) =>
    teams?.find((team) => team.id === answerId)?.name ||
    players?.find((player) => player.id === answerId)?.name

  const getQuestionScore = (userId: string) =>
    questionsForUsers.reduce<number>((score, q) => {
      const userAnswer = getAnswer(
        q.UserQuizQuestion.filter((a) => a.userId === userId).find((u) => u.quizQuestionId === q.id)
          ?.answer
      )
      return score + (q.answer === userAnswer ? 10 : 0)
    }, 0)

  return {
    ...league,
    UserLeague: league.UserLeague.map((ul) => ({
      ...ul,
      score: predictionsForUsers
        .filter((p) => p.userId === ul.userId)
        .reduce((prev, prediction) => {
          const match = matches.find((m) => m.id === prediction.matchId)

          if (match) {
            const score = calculateScoreForMatch(match, prediction)
            return prev + score
          }

          return prev
        }, getQuestionScore(ul.userId)),
    })).sort((a, b) => b.score - a.score),
  }
})
