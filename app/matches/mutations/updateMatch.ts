import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateMatch = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateMatch),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const match = await db.match.update({ where: { id }, data })

    return match
  }
)
