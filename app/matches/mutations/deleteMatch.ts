import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteMatch = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeleteMatch), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const match = await db.match.deleteMany({ where: { id } })

  return match
})
