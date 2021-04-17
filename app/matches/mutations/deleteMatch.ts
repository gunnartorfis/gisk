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

    await db.match.delete({
      where: {
        id: input.id,
      },
    })
  }
)

export default deleteMatch
