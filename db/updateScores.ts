import fetch from "node-fetch"
import db from "./index"
import defaultMatches from "./newMatches"

const updateScores = async () => {
  const matches = (await (
    await fetch("https://world-cup-json-2022.fly.dev/matches?details=true")
  ).json()) as typeof defaultMatches

  matches.forEach(async (newMatch) => {
    const hometeam = await db.team.findFirst({
      where: {
        name: newMatch.home_team.name,
      },
    })

    const awayTeam = await db.team.findFirst({
      where: {
        name: newMatch.away_team.name,
      },
    })

    if (!hometeam || !awayTeam) {
      return
    }

    // If the current_time is completed and it did not go into extra time we update it using the cronjob
    // If not we need to manually update this due to api limitation
    if (newMatch.status === "completed" && newMatch.detailed_time?.current_time !== "120'") {
      await db.match.update({
        where: {
          homeTeamId_awayTeamId_kickOff: {
            homeTeamId: hometeam?.id as string,
            awayTeamId: awayTeam?.id as string,
            kickOff: newMatch.datetime,
          },
        },
        data: {
          resultHome: newMatch.home_team.goals ?? 0,
          resultAway: newMatch.away_team.goals ?? 0,
        },
      })
    }
  })
}

updateScores()
