import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const tournament = await db.tournament.findFirst()

  if (!tournament) {
    return null
  }

  return tournament
})
