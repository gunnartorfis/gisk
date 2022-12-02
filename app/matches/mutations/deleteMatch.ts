import { resolver } from "@blitzjs/rpc"
import { assert } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteMatch = z.object({
  id: z.string(),
})

const deleteMatch = resolver.pipe(
  resolver.zod(DeleteMatch),
  resolver.authorize(),
  async (input, ctx) => {
    assert(ctx.session.$isAuthorized("ADMIN"), "You must an admin to perform this action")

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
