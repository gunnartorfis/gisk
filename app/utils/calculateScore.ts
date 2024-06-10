import { User } from "db"
import { Match, UserLeagueMatch } from "@prisma/client"
import dayjs from "dayjs"

export const calculateScoreForMatch = ({
  match,
  prediction,
  user,
}: {
  match: Pick<Match, "resultHome" | "resultAway" | "scoreMultiplier" | "kickOff">
  prediction: Pick<UserLeagueMatch, "resultHome" | "resultAway">
  user?: Omit<User, "updatedAt" | "hashedPassword" | "facebookId" | "googleId"> | null
}): number => {
  let score = 0

  if (user && dayjs(match.kickOff).isBefore(user.createdAt)) {
    return score
  }

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
