import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetLeague = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetLeague), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const league = await db.league.findFirst({ where: { id } })

  if (!league) throw new NotFoundError()

  return league
})
