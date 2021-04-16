import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetLeague = z.object({
  id: z.string(),
})

export default resolver.pipe(resolver.zod(GetLeague), resolver.authorize(), async ({ id }, ctx) => {
  const league = await db.league.findFirst({
    where: {
      id,
      UserLeague: {
        some: {
          userId: ctx.session.userId,
        },
      },
    },
    include: {
      UserLeague: {
        include: {
          user: true,
        },
      },
    },
  })

  const usersInLeague = league?.UserLeague.map((ul) => ul.userId)

  const predictionsForUsers = await db.userLeagueMatch.findMany({
    where: {
      userId: {
        in: usersInLeague,
      },
    },
  })

  if (!league) throw new NotFoundError()

  return {
    ...league,
    UserLeague: league.UserLeague.map((ul) => ({
      ...ul,
      predictions: predictionsForUsers.filter((p) => p.userId === ul.userId),
    })),
  }
})
