import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const LeagueByInviteCode = z.string().min(6).max(6)

export default resolver.pipe(
  resolver.zod(LeagueByInviteCode),
  resolver.authorize(),
  async (inviteCode) => {
    try {
      const league = await db.league.findUnique({
        where: {
          inviteCode,
        },
        include: {
          UserLeague: {
            include: {
              user: true,
            },
          },
        },
      })
      return league
    } catch (error) {
      return null
    }
  }
)
