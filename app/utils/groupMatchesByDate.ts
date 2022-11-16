import { MatchWithScore } from "app/matches/queries/getMatches"
import dayjs from "dayjs"

type MatchesByDayType = {
  [key: string]: MatchWithScore[]
}

const groupMatchesByDate = (matches: MatchWithScore[] | undefined) => {
  const matchesByDate: MatchesByDayType = {}

  matches?.forEach((m) => {
    const currentMatchDate = dayjs(getDateWithoutTimeFromDate(m.kickOff)).toString()

    if (currentMatchDate in matchesByDate) {
      matchesByDate[currentMatchDate]?.push(m)
    } else {
      matchesByDate[currentMatchDate] = [m]
    }
  })

  return matchesByDate
}

const getDateWithoutTimeFromDate = (date: Date) => {
  return new Date(dayjs(date).format("MM/DD/YYYY"))
}

export default groupMatchesByDate
