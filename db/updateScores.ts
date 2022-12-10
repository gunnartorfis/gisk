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

    // Each match has an event array for away and home teams, if we find a goal event that is marked in extra time we need to
    // Manually set the score
    const wereThereAnyExtraTimeGoals = [
      ...(newMatch.away_team_events ?? []),
      ...(newMatch.home_team_events ?? []),
    ].some((event) => {
      const time = Number(event.time.split("'")[0])
      if (event.type_of_event === "goal" && time > 90) {
        return true
      }
      return false
    })
    if (newMatch.status === "completed" && !wereThereAnyExtraTimeGoals) {
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
