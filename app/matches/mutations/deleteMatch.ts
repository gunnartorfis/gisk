import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteMatch = z.object({
  id: z.string(),
})

const deleteMatch = resolver.pipe(
  resolver.zod(DeleteMatch),
  resolver.authorize(),
  async (input, ctx) => {
    if (ctx.session.role !== "ADMIN") {
      throw new Error()
    }

    const { id } = input

    await db.userLeagueMatch.deleteMany({
      where: {
        matchId: id,
      },
    })

    await db.match.delete({
      where: {
        id,
      },
    })
  }
)

export default deleteMatch
