import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  // TODO: replace with some logic for an active/selected tournament
  const tournament = await db.tournament.findFirst()

  if (!tournament) {
    return null
  }

  return tournament
})
