import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const CreateMatch = z.object({
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  kickOff: z.date(),
  resultHome: z.optional(z.number()),
  resultAway: z.optional(z.number()),
})

const createMatch = resolver.pipe(
  resolver.zod(CreateMatch),
  resolver.authorize(),
  async (input, ctx) => {
    if (ctx.session.role !== "ADMIN") {
      throw new Error()
    }

    const { homeTeamId, awayTeamId, kickOff, resultHome, resultAway } = input

    const newMatch = await db.match.create({
      data: {
        arena: "",
        kickOff,
        round: "",
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
      },
    })

    return newMatch
  }
)

export default createMatch
