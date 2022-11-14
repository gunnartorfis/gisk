import { Ctx, resolver } from "blitz"
import dayjs from "dayjs"
import db from "db"

const randomGeneratePredictions = async (_, ctx: Ctx) => {
  const userId = ctx.session.userId
  ctx.session.$authorize()
  if (!userId) {
    throw new Error("Not authenticated")
  }

  const allMatches = await db.match.findMany({
    where: {
      kickOff: {
        gte: dayjs().toDate(),
      },
    },
    include: {
      userLeagueMatches: true,
    },
  })

  const unpredictedMatches = allMatches.filter((match) => {
    return (
      match.userLeagueMatches === null ||
      !(
        match.userLeagueMatches?.resultHome !== null || match.userLeagueMatches?.resultAway !== null
      )
    )
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
            id: unpredictedMatch.id,
          },
        },
        resultHome: randomHome,
        resultAway: randomAway,
      },
    })
  }
}

export default randomGeneratePredictions
