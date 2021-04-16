import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const matches = await db.match.findMany({
    select: {
      resultAway: true,
      resultHome: true,
      id: true,
    },
  })

  return matches
})
