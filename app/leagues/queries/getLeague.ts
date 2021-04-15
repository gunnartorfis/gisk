import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetLeague = z.object({
  id: z.string(),
})

export default resolver.pipe(resolver.zod(GetLeague), resolver.authorize(), async ({ id }) => {
  const league = await db.league.findFirst({
    where: { id },
    include: {
      UserLeague: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!league) throw new NotFoundError()

  return league
})
