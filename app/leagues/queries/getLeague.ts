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

  const usersInLeague = league?.UserLeague.map((ul) => ul.userId)

  const predictionsForUsers = await db.userLeagueMatch.findMany({
    where: {
      userId: {
        in: usersInLeague,
      },
    },
  })

  if (!league) throw new NotFoundError()

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
        }, 0),
    })).sort((a, b) => b.score - a.score),
  }
})
