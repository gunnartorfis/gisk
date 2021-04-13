import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteGroup = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeleteGroup), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const group = await db.group.deleteMany({ where: { id } })

  return group
})
