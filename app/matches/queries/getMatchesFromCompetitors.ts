import { resolver } from "@blitzjs/rpc"
import dayjs from "dayjs"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (input) => {
  const userId = (input as any).userId
  const tournamentId = (input as any).tournamentId

  if (!userId || !tournamentId) return []

  const userLeagueMatchInclude = {
    match: {
      include: {
        awayTeam: {
          include: {
            teamTournaments: true,
          },
        },
        homeTeam: {
          include: {
            teamTournaments: true,
          },
        },
      },
    },
  }

  const userMatches = await db.userLeagueMatch.findMany({
    where: {
      user: { id: userId },
      match: {
        tournament: {
          id: tournamentId,
        },
      },
    },
    include: userLeagueMatchInclude,
  })

  const allMatches = await db.match.findMany({
    where: {
      tournament: {
        id: tournamentId,
      },
    },
  })
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
