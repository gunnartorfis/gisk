import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetMatch = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetMatch), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const match = await db.match.findFirst({ where: { id } })

  if (!match) throw new NotFoundError()

  return match
})
