import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const UpdateUserLanguage = z.object({
  language: z.string(),
})

const updateUserLanguage = resolver.pipe(
  resolver.zod(UpdateUserLanguage),
  resolver.authorize(),
  async (input, ctx) => {
    await db.user.update({
      where: {
        id: ctx.session.userId,
      },
      data: {
        language: input.language,
      },
    })
  }
)

export default updateUserLanguage
