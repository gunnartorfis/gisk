import { Ctx } from "blitz"
import dayjs from "dayjs"
import db from "db"

const randomGeneratePredictions = async (_, ctx: Ctx) => {
  const userId = ctx.session.userId

  ctx.session.$authorize()

  if (!userId) {
    throw new Error("Not authenticated")
  }

  const userMatches = await db.userLeagueMatch.findMany({
    where: {
      userId,
      match: {
        kickOff: {
          gte: dayjs().toDate(),
        },
      },
    },
  })

  const matches = await db.match.findMany({
    where: {
      kickOff: {
        gte: dayjs().toDate(),
      },
    },
  })

  const unpredictedMatches = matches.filter((match) => {
    return userMatches.every((m) => m.matchId !== match.id)
  })

  for (let i = 0; i < unpredictedMatches.length; i++) {
    const unpredictedMatch = unpredictedMatches[i]
    const randomHome = Math.floor(Math.random() * 4)
    const randomAway = Math.floor(Math.random() * 4)
    await db.userLeagueMatch.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        match: {
          connect: {
            id: unpredictedMatch?.id,
          },
        },
        resultHome: randomHome,
        resultAway: randomAway,
      },
    })
  }
}

export default randomGeneratePredictions
