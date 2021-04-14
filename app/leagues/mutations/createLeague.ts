import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateLeague = z
  .object({
    name: z.string(),
  })
  .nonstrict()

function makeInviteCode() {
  const length = 6
  var result = ""
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const createLeague = resolver.pipe(
  resolver.zod(CreateLeague as any),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    const inviteCode = makeInviteCode()
    await db.league.create({
      data: {
        name: input.name,
        inviteCode,
        users: {
          connect: {
            id: userId,
          },
        },
        UserLeague: {
          create: {
            userId,
            role: "ADMIN",
            pending: false,
          },
        },
      },
    })
  }
)

export default createLeague
