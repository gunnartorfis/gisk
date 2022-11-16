import { resolver } from "@blitzjs/rpc"
import { z } from "zod"
import db from "db"
import { Ctx } from "@blitzjs/next"

const getUserLeagueMatches = async (_, ctx: Ctx) => {
  ctx.session.$authorize()
  const userId = ctx.session.userId

  if (!userId) {
    throw new Error("Not authenticated")
  }

  let matchesForUser = await db.userLeagueMatch.findMany({
    where: {
      user: { id: userId },
    },
  })

  return matchesForUser
}

export default getUserLeagueMatches
