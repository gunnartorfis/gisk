import { Match, UserLeagueMatch } from "@prisma/client"

export const calculateScoreForMatch = (
  match: Pick<Match, "resultHome" | "resultAway" | "scoreMultiplier">,
  prediction: Pick<UserLeagueMatch, "resultHome" | "resultAway">
): number => {
  let score = 0

  const { resultHome, resultAway } = match
  if (resultHome !== null && resultAway !== null) {
    if (resultHome === prediction.resultHome && resultAway === prediction.resultAway) {
      score += 2
    }

    if (resultHome === resultAway && prediction.resultHome === prediction.resultAway) {
      score += 1
    } else {
      const resultMatch = Math.sign(resultHome - resultAway)
      const resultUser = Math.sign((prediction.resultHome ?? 0) - (prediction.resultAway ?? 0))
      if (resultMatch === resultUser) {
        score += 1
      }
    }

    score *= match.scoreMultiplier ?? 1
  }

  return score
}
