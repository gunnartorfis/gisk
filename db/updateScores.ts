import fetch from 'node-fetch';
import db from "./index"
import defaultMatches from "./newMatches";

const updateScores = async () => {
  const matches = await (await fetch("https://world-cup-json-2022.fly.dev/matches")).json() as typeof defaultMatches; 

  matches.forEach(async newMatch => {
    const hometeam = await db.team.findFirst({where: {
      name: newMatch.home_team.name
    }});

    const awayTeam = await db.team.findFirst({where: {
      name: newMatch.away_team.name
    }})

    if(!hometeam || !awayTeam) {
      return;
    }

    if (newMatch.status === 'completed') {
      await db.match.update({
        where: {
          homeTeamId_awayTeamId_kickOff: {
            homeTeamId: hometeam?.id as string,
            awayTeamId: awayTeam?.id as string,
            kickOff: newMatch.datetime
          }
        },
        data: {
          resultHome: newMatch.home_team.goals ?? 0,
          resultAway: newMatch.away_team.goals ?? 0,
        },
      }) 
    }
  })
}

updateScores();
