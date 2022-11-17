import { resolver } from "@blitzjs/rpc"
import { NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const AddUserToLeague = z.object({
  inviteCode: z.string().transform((val) => val.toUpperCase()),
})

const addUserToLeagueIfExists = resolver.pipe(
  resolver.zod(AddUserToLeague),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    const inviteCode = input.inviteCode
    const league = await db.league.findFirst({
      where: {
        inviteCode,
      },
    })
    if (!league) {
      throw new NotFoundError()
    }

    const updatedLeague = await db.league.update({
      where: {
        inviteCode,
      },
      data: {
        UserLeague: {
          create: {
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    })

    return updatedLeague
  }
)

export default addUserToLeagueIfExists
