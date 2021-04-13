import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateGroup = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateGroup),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const group = await db.group.update({ where: { id }, data })

    return group
  }
)
