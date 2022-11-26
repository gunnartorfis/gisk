import { resolver } from "@blitzjs/rpc"
import { calculateScoreForMatch } from "app/utils/calculateScore"
import db, { User } from "db"

export default resolver.pipe(
  resolver.authorize(),
  async (): Promise<
    Array<
      User & {
        score: number
      }
    >
  > => {
    const userLeagueMatches = await db.user.findMany({
      include: {
        userLeagueMatches: {
          select: {
            resultAway: true,
            resultHome: true,
            matchId: true,
          },
        },
      },
    })

    const matches = await db.match.findMany()

    const usersWithScore = userLeagueMatches.map((user) => {
      const userLeagueMatches = user.userLeagueMatches

      const score = userLeagueMatches.reduce((acc, userLeagueMatch) => {
        const match = matches.find((match) => (match.id = userLeagueMatch.matchId))

        if (!match) {
          return acc
        }

        const score = calculateScoreForMatch(
          {
            kickOff: match.kickOff,
            resultAway: match?.resultAway,
            resultHome: match?.resultHome,
            scoreMultiplier: match.scoreMultiplier,
          },
          {
            resultHome: userLeagueMatch.resultHome,
            resultAway: userLeagueMatch.resultAway,
          }
        )

        return acc + score
      }, 0)

      return {
        ...user,
        score,
      }
    })

    const sortedUsers = usersWithScore.sort((a, b) => b.score - a.score).slice(0, 20)
    return sortedUsers
  }
)
