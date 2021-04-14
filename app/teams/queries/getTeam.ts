import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetTeam = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(GetTeam), resolver.authorize(), async ({ name }) => {
  const team = await db.team.findFirst({
    where: { name },
    include: {
      awayMatches: {
        include: {
          homeTeam: true,
        },
      },
      homeMatches: {
        include: {
          awayTeam: true,
        },
      },
    },
  })

  if (!team) throw new NotFoundError()

  return team
})
