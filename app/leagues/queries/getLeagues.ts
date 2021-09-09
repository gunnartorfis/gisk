import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const userId = ctx.session.userId
  const leagues = await db.league.findMany({
    where: {
      deletedAt: null,
      UserLeague: {
        some: {
          userId,
        },
      },
    },
  })

  return leagues || []
})
