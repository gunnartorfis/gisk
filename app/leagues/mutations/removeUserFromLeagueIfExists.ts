import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const RemoveUserFromLeague = z.object({
  userId: z.string(),
  leagueId: z.string(),
})

const removeUserFromLeagueIfExists = resolver.pipe(
  resolver.zod(RemoveUserFromLeague),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    const { userId: userIdToDelete, leagueId } = input

    const loggedInUserLeagues = await db.userLeague.findUnique({
      where: {
        userId_leagueId: {
          leagueId,
          userId,
        },
      },
    })

    if (loggedInUserLeagues?.role !== "ADMIN") {
      throw new Error()
    }

    try {
      const updatedLeague = await db.league.update({
        where: {
          id: leagueId,
        },
        data: {
          UserLeague: {
            delete: {
              userId_leagueId: {
                leagueId: leagueId,
                userId: userIdToDelete,
              },
            },
          },
        },
      })
      return updatedLeague
    } catch (error) {
      console.error("Error deleting league", error)
    }
  }
)

export default removeUserFromLeagueIfExists
