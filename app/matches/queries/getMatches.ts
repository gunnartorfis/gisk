import { resolver } from "@blitzjs/rpc"
import { calculateScoreForMatch } from "app/utils/calculateScore"
import dayjs from "dayjs"
import db, { Match, Team, User, UserLeagueMatch } from "db"
import * as z from "zod"

export type MatchWithScore = (Match & {
  homeTeam: Team
  awayTeam: Team
}) & {
  userPredictionHome: number | null | undefined
  userPredictionAway: number | null | undefined
  score?: number
}

const GetMatchesInput = z.object({
  date: z.optional(z.date()),
  showPredictedMatches: z.optional(z.boolean()),
  showPastMatches: z.optional(z.boolean()),
})

export default resolver.pipe(
  resolver.zod(GetMatchesInput),
  resolver.authorize(),
  async (
    { date, showPastMatches = true, showPredictedMatches = true },
    ctx
  ): Promise<Array<MatchWithScore>> => {
    const userId = ctx.session.userId

    let matchesForUser = await db.userLeagueMatch.findMany({
      where: {
        user: { id: userId },
      },
    })

    const user = await db.user.findFirst({ where: { id: userId } })

    const allMatches = await db.match.findMany({
      where: date
        ? {
            kickOff: {
              gte: date,
              lt: dayjs(date).add(1, "day").toDate(),
            },
          }
        : !showPastMatches
        ? {
            kickOff: {
              gte: dayjs().set("hour", 0).set("minutes", 0).toDate(),
            },
          }
        : {},
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        kickOff: "asc",
      },
    })

    const matchesToReturn: Array<MatchWithScore> = []
    allMatches.map((match) => {
      const userLeagueMatch = matchesForUser.find((um) => um.matchId === match.id)

      if (userLeagueMatch) {
        if (showPredictedMatches) {
          matchesToReturn.push({
            ...match,
            userPredictionHome: userLeagueMatch.resultHome,
            userPredictionAway: userLeagueMatch.resultAway,
            score: calculateScoreForMatch(match, userLeagueMatch, user),
          })
        }
      } else {
        matchesToReturn.push({
          ...match,
          score: 0,
          userPredictionAway: undefined,
          userPredictionHome: undefined,
        })
      }
    })

    return matchesToReturn
  }
)
