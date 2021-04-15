import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

export const UpdateUserForm = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateUserForm),
  resolver.authorize(),
  async (input, ctx) => {
    await db.user.update({
      where: {
        id: ctx.session.userId,
      },
      data: {
        name: input.name,
      },
    })
  }
)
