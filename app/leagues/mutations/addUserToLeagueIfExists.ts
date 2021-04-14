import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const AddUserToLeague = z.object({
  inviteCode: z.string(),
})

const addUserToLeagueIfExists = resolver.pipe(
  resolver.zod(AddUserToLeague),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId

    await db.league.update({
      where: {
        inviteCode: input.inviteCode,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    })
  }
)

export default addUserToLeagueIfExists
