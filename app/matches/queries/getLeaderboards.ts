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
    // TODO: replace with some logic for an active/selected tournament
    const tournament = await db.tournament.findFirst()
    const users = await db.user.findMany({
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

    const usersWithScore = users.map((user) => {
      const userLeagueMatches = user.userLeagueMatches

      const score = userLeagueMatches.reduce((acc, userLeagueMatch) => {
        const match = matches.find(
          (match) => match.id === userLeagueMatch.matchId && match.tournamentId === tournament?.id
        )
        if (!match) {
          return acc
        }

        const score = calculateScoreForMatch({
          match: {
            kickOff: match.kickOff,
            resultAway: match.resultAway,
            resultHome: match.resultHome,
            scoreMultiplier: match.scoreMultiplier,
          },
          prediction: {
            resultAway: userLeagueMatch.resultAway,
            resultHome: userLeagueMatch.resultHome,
          },
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
