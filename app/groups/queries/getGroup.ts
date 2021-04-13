import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetGroup = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetGroup), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const group = await db.group.findFirst({ where: { id } })

  if (!group) throw new NotFoundError()

  return group
})
