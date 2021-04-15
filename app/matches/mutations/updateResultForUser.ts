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

    console.log("AA", input)

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
