import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GetPlayersInput = z.object({
  useGoalies: z.optional(z.boolean()),
})

export default resolver.pipe(
  resolver.zod(GetPlayersInput),
  resolver.authorize(),
  async ({ useGoalies = false }, ctx) => {
    const players = await db.player.findMany({
      where: {
        isGoalie: useGoalies,
      },
    })

    return players.sort((a, b) => a.name.localeCompare(b.name))
  }
)
