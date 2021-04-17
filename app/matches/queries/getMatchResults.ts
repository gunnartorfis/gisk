import { resolver } from "blitz"
import dayjs from "dayjs"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const matches = await db.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  })

  matches.sort((a, b) => {
    return dayjs(a.kickOff).unix() - dayjs(b.kickOff).unix()
  })

  return matches
})
