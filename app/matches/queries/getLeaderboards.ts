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
          include: {
            match: true,
          },
        },
      },
    })

    const usersWithScore = userLeagueMatches.map((user) => {
      const userLeagueMatches = user.userLeagueMatches

      const score = userLeagueMatches.reduce((acc, userLeagueMatch) => {
        const score = calculateScoreForMatch(userLeagueMatch.match, {
          resultHome: userLeagueMatch.resultHome,
          resultAway: userLeagueMatch.resultAway,
        })

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
