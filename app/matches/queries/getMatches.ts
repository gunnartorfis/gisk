import { resolver } from "blitz"
import dayjs from "dayjs"
import db, { Match, Team, UserLeagueMatch } from "db"
import { m } from "framer-motion"
import * as z from "zod"

export type MatchWithScore = (Match & {
  homeTeam: Team
  awayTeam: Team
}) & {
  userPredictionHome?: number | null
  userPredictionAway?: number | null
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
            score: calculateScoreForMatch(match, userLeagueMatch),
          })
        }
      } else {
        matchesToReturn.push({
          ...match,
          score: 0,
        })
      }
    })

    return matchesToReturn
  }
)

export const calculateScoreForMatch = (
  match: Match & {
    homeTeam: Team
    awayTeam: Team
  },
  prediction: UserLeagueMatch
): number => {
  let score = 0

  const { resultHome, resultAway } = match
  if (resultHome !== null && resultAway !== null) {
    if (resultHome === prediction.resultHome && resultAway === prediction.resultAway) {
      score += 1
    }

    if (resultHome === resultAway && prediction.resultHome === prediction.resultAway) {
      score += 1
    } else {
      const resultMatch = Math.sign(resultHome - resultAway)
      const resultUser = Math.sign((prediction.resultHome ?? 0) - (prediction.resultAway ?? 0))
      if (resultMatch === resultUser) {
        score += 1
      }
    }

    score *= match.scoreMultiplier ?? 1
  }

  return score
}
