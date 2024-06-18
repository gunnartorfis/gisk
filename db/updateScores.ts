import dayjs from 'dayjs';
import fetch from 'node-fetch';
import db from './index';
import { results } from './results';

const normalizeName = (name?: string) => {
  if (name === 'Czechia') return 'Czech Republic';
  if (name === 'Turkiye') return 'Turkey';
  return name;
};

const updateScores = async () => {
  const matches = (await (
    await fetch(
      `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${dayjs().format(
        'YYYYMMDD',
      )}/0?locale=en&MD=1`,
    )
  ).json()) as typeof results;

  const euroMatches = matches.Stages.filter(
    (stage) => stage.Cnm === 'Euro 2024',
  ).flatMap((stage) => stage.Events);

  if (euroMatches.length === 0) {
    console.log('No matches found');
    return;
  }

  euroMatches.forEach(async (newMatch) => {
    const hometeam = await db.team.findFirst({
      where: {
        name: normalizeName(newMatch.T1[0]?.Nm),
      },
    });

    const awayTeam = await db.team.findFirst({
      where: {
        name: normalizeName(newMatch['T2'][0]?.Nm),
      },
    });

    if (!hometeam || !awayTeam) {
      return;
    }

    const kickOff = newMatch.Esd.toString();

    const year = Number(kickOff.slice(0, 4));
    const month = Number(kickOff.slice(4, 6)) - 1;
    const day = Number(kickOff.slice(6, 8));
    const hour = Number(kickOff.slice(8, 10));
    const minute = Number(kickOff.slice(10, 12));
    const second = Number(kickOff.slice(12, 14));

    const date = new Date(year, month, day, hour, minute, second);

    const match = await db.match.findFirst({
      where: {
        homeTeamId: hometeam.id as string,
        awayTeamId: awayTeam.id as string,
        kickOff: date.toISOString(),
      },
    });

    // If match is not found
    // Match is already played
    // Or the match is not in fulltime yet
    // We don't need to update the scores
    if (
      !match ||
      (match.resultHome !== null && match.resultAway !== null) ||
      newMatch.Eps !== 'FT'
    ) {
      return;
    }

    await db.match.update({
      where: {
        homeTeamId_awayTeamId_kickOff: {
          homeTeamId: hometeam?.id as string,
          awayTeamId: awayTeam?.id as string,
          kickOff: date.toISOString(),
        },
      },
      data: {
        resultHome: newMatch.Tr1 ? Number(newMatch.Tr1) : null,
        resultAway: newMatch.Tr2 ? Number(newMatch.Tr2) : null,
      },
    });
  });
};

updateScores();
