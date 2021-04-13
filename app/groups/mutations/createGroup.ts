import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateGroup = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreateGroup), resolver.authorize(), async (input) => {
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
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const group = await db.group.create({
    data: {
      ...input,
      inviteCode: makeInviteCode(),
    },
  })

  return group
})
