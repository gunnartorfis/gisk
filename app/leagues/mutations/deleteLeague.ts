import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteLeague = z.object({
  leagueId: z.string(),
})

const deleteLeague = resolver.pipe(
  resolver.zod(DeleteLeague),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    const { leagueId } = input

    const league = await db.league.findUnique({
      where: {
        id: leagueId,
      },
      include: {
        UserLeague: {
          where: {
            role: "ADMIN",
          },
        },
      },
    })

    if (!league) {
      throw new Error(`League not found with id: ${leagueId}`)
    }

    const userIsAdminOfLeague = league.UserLeague.find((u) => u.userId === userId)
    if (!userIsAdminOfLeague) {
      throw new Error("Only admins can delete a league.")
    }

    const updatedLeague = await db.league.update({
      where: {
        id: leagueId,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return updatedLeague
  }
)

export default deleteLeague
