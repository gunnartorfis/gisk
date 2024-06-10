import { getSession } from "@blitzjs/auth"
import { resolver } from "@blitzjs/rpc"
import { assert } from "blitz"
import db from "db"
import * as z from "zod"

const CreateMatch = z.object({
  homeTeamId: z.string(),
  awayTeamId: z.string(),
  kickOff: z.date(),
  resultHome: z.nullable(z.number()),
  resultAway: z.nullable(z.number()),
  scoreMultiplier: z.optional(z.number()),
  tournamentId: z.string(),
})

const createMatch = resolver.pipe(
  resolver.zod(CreateMatch),
  resolver.authorize(),
  async (input, ctx) => {
    assert(ctx.session.$isAuthorized("ADMIN"), "You must an admin to perform this action")

    const {
      homeTeamId,
      awayTeamId,
      kickOff,
      resultHome,
      resultAway,
      scoreMultiplier,
      tournamentId,
    } = input

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
        scoreMultiplier: scoreMultiplier ?? 1,
        tournament: {
          connect: {
            id: tournamentId,
          },
        },
      },
    })

    return newMatch
  }
)

export default createMatch
