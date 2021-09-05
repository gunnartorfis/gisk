import { resolver } from "blitz"
import dayjs from "dayjs"
import db, { Match, Team, UserLeagueMatch } from "db"
import { m } from "framer-motion"
import * as z from "zod"

export type MatchWithScore = UserLeagueMatch & {
  match: Match & {
    awayTeam: Team
    homeTeam: Team
  }
  score?: number
}

const GetMatchesInput = z.object({
  date: z.optional(z.date()),
})

export default resolver.pipe(
  resolver.zod(GetMatchesInput),
  resolver.authorize(),
  async ({ date }, ctx): Promise<Array<MatchWithScore>> => {
    const userId = ctx.session.userId

    const userLeagueMatchInclude = {
      match: {
        include: {
          awayTeam: true,
          homeTeam: true,
        },
      },
    }

    let matchesForUser = await db.userLeagueMatch.findMany({
      where: {
        user: { id: userId },
      },
      include: userLeagueMatchInclude,
    })

    let userMatches = matchesForUser.map((um) => ({
      ...um,
      score: calculateScoreForMatch(um.match, um),
    }))

    const allMatches = await db.match.findMany()
    const missingMatches = allMatches.filter((m) => {
      const includesMatch = userMatches
        .map((um) => {
          return um.match.id
        })
        ?.includes(m.id)
      return !includesMatch
    })

    for (let i = 0; i < missingMatches.length; i++) {
      const missingMatch = missingMatches[i]
      const newMatch = await db.userLeagueMatch.create({
        data: {
          resultAway: 0,
          resultHome: 0,
          match: {
            connect: {
              id: missingMatch.id,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: userLeagueMatchInclude,
      })

      userMatches.push({
        ...newMatch,
        score: 0,
      })
    }

    userMatches = userMatches.map((match) => ({
      ...match,
      score: calculateScoreForMatch(match.match, match),
    }))

    userMatches.sort((a, b) => {
      return dayjs(a.match.kickOff).unix() - dayjs(b.match.kickOff).unix()
    })

    if (date) {
      userMatches = userMatches.filter((m) => {
        return dayjs(m.match.kickOff).isSame(dayjs(date), "day")
      })
    }

    return userMatches
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
      const resultUser = Math.sign(prediction.resultHome - prediction.resultAway)
      if (resultMatch === resultUser) {
        score += 1
      }
    }

    score *= match.scoreMultiplier ?? 1
  }

  return score
}
