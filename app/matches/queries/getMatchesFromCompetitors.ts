import { resolver } from "@blitzjs/rpc"
import dayjs from "dayjs"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (input, ctx) => {
  const userId = (input as any).userId

  if (!userId) return []

  const userLeagueMatchInclude = {
    match: {
      include: {
        awayTeam: true,
        homeTeam: true,
      },
    },
  }

  const userMatches = await db.userLeagueMatch.findMany({
    where: {
      user: { id: userId },
    },
    include: userLeagueMatchInclude,
  })

  const allMatches = await db.match.findMany()
  const missingMatches = allMatches.filter((m) => {
    const includesMatch = userMatches
      .map((um) => {
        return um.match.id
      })
      ?.includes(m.id)
    return !includesMatch
  })

  for (let i = 0; i < missingMatches.length; i++) {
    const missingMatch = missingMatches[i]
    const newMatch = await db.userLeagueMatch.create({
      data: {
        resultAway: 0,
        resultHome: 0,
        match: {
          connect: {
            id: missingMatch?.id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: userLeagueMatchInclude,
    })

    userMatches.push(newMatch)
  }

  const kickOffOnlyMatches = userMatches.filter((m) => dayjs(new Date()).isAfter(m.match.kickOff))

  kickOffOnlyMatches.sort((a, b) => {
    return dayjs(a.match.kickOff).unix() - dayjs(b.match.kickOff).unix()
  })
  return kickOffOnlyMatches
})
