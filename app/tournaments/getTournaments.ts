import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const teams = await (
    await db.tournament.findMany()
  ).sort((first, second) =>
    first.startDate.toISOString().localeCompare(second.startDate.toISOString())
  )
  return teams
})
