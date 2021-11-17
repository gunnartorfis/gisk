import { resolver } from "blitz"
import dayjs from "dayjs"
import db from "db"

const randomGeneratePredictions = resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const userId = ctx.session.userId

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
    return !(
      match.userLeagueMatches?.resultHome !== null || match.userLeagueMatches?.resultAway !== null
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
})

export default randomGeneratePredictions
