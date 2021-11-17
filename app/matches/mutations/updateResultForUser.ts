import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const AddUserToLeague = z.object({
  matchId: z.string(),
  newValue: z.number(),
  resultKey: z.enum(["resultHome", "resultAway"]),
})

const updateResultForUser = resolver.pipe(
  resolver.zod(AddUserToLeague),
  resolver.authorize(),
  async (input, ctx) => {
    const { newValue, resultKey, matchId } = input

    const userId = ctx.session.userId

    const match = await db.match.findUnique({
      where: {
        id: matchId,
      },
    })

    if (!match) {
      throw new NotFoundError()
    }

    if (new Date() > match.kickOff) {
      throw new Error("Match already started")
    }

    await db.userLeagueMatch.upsert({
      where: {
        matchId,
        // userId_matchId: {
        //   matchId,
        //   userId,
        // },
      },
      create: {
        user: {
          connect: {
            id: userId,
          },
        },
        match: {
          connect: {
            id: matchId,
          },
        },
        [resultKey]: newValue,
      },
      update: {
        [resultKey]: newValue,
      },
    })
  }
)

export default updateResultForUser
