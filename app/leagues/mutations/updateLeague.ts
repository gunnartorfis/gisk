import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateLeague = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateLeague),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const league = await db.league.update({ where: { id }, data })

    return league
  }
)
