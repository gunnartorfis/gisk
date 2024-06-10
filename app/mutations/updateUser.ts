import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

export const UpdateUserForm = z.object({
  name: z.string(),
})

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
