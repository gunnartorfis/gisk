import { Match, Team } from "db"

export type MatchWithTeams = Match & {
  homeTeam: Team
  awayTeam: Team
}
