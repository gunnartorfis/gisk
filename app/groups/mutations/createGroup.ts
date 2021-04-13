import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateGroup = z
  .object({
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(CreateGroup), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const group = await db.group.create({ data: input })

  return group
})
