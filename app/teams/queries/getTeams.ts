import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const teams = await db.team.findMany()
  return teams
})
