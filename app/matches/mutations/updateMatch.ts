import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const UpdateMatch = z.object({
  id: z.string(),
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  kickOff: z.date(),
  resultHome: z.nullable(z.number()),
  resultAway: z.nullable(z.number()),
  scoreMultiplier: z.optional(z.number()),
})

const updateMatch = resolver.pipe(
  resolver.zod(UpdateMatch),
  resolver.authorize(),
  async (input, ctx) => {
    if (ctx.session.role !== "ADMIN") {
      throw new Error()
    }

    const { id, homeTeamId, awayTeamId, kickOff, resultHome, resultAway, scoreMultiplier } = input

    const newMatch = await db.match.update({
      where: {
        id,
      },
      data: {
        kickOff,
        homeTeam: {
          connect: {
            id: homeTeamId,
          },
        },
        awayTeam: {
          connect: {
            id: awayTeamId,
          },
        },
        resultAway,
        resultHome,
        scoreMultiplier: scoreMultiplier ?? 1,
      },
    })

    return newMatch
  }
)

export default updateMatch
