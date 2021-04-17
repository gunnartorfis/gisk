import { NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

const AddUserToLeague = z.object({
  userMatchId: z.string(),
  newValue: z.number(),
  resultKey: z.enum(["resultHome", "resultAway"]),
})

const updateResultForUser = resolver.pipe(
  resolver.zod(AddUserToLeague),
  resolver.authorize(),
  async (input) => {
    const { newValue, resultKey, userMatchId } = input

    const userMatch = await db.userLeagueMatch.findFirst({
      where: {
        id: userMatchId,
      },
      include: {
        match: true,
      },
    })

    if (!userMatch) {
      throw new NotFoundError()
    }
    // 2021-06-11 21:00:00

    if (new Date() > userMatch.match.kickOff) {
      throw new Error("Match already started")
    }

    await db.userLeagueMatch.update({
      where: {
        id: userMatchId,
      },
      data: {
        [resultKey]: newValue,
      },
    })
  }
)

export default updateResultForUser
