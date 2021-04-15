import db, { Team } from "./index"
import dayjs from "dayjs"
import matches from "./matches"

import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

const teams: Array<{
  name: string
  group: string
  countryCode: string
}> = [
  { group: "A", name: "Turkey", countryCode: "TUR" },
  { group: "A", name: "Italy", countryCode: "ITA" },
  { group: "A", name: "Wales", countryCode: "WAL" },
  { group: "A", name: "Switzerland", countryCode: "SUI" },
  { group: "B", name: "Denmark", countryCode: "DEN" },
  { group: "B", name: "Finland", countryCode: "FIN" },
  { group: "B", name: "Belgium", countryCode: "BEL" },
  { group: "B", name: "Russia", countryCode: "RUS" },
  { group: "C", name: "Netherlands", countryCode: "NED" },
  { group: "C", name: "Ukraine", countryCode: "UKR" },
  { group: "C", name: "Austria", countryCode: "AUT" },
  { group: "C", name: "North Macedonia", countryCode: "MKD" },
  { group: "D", name: "England", countryCode: "ENG" },
  { group: "D", name: "Croatia", countryCode: "CRO" },
  { group: "D", name: "Scotland", countryCode: "SCO" },
  { group: "D", name: "Czech Republic", countryCode: "CZE" },
  { group: "E", name: "Spain", countryCode: "ESP" },
  { group: "E", name: "Sweden", countryCode: "SWE" },
  { group: "E", name: "Poland", countryCode: "POL" },
  { group: "E", name: "Slovakia", countryCode: "SVK" },
  { group: "F", name: "Hungary", countryCode: "HUN" },
  { group: "F", name: "Portugal", countryCode: "POR" },
  { group: "F", name: "France", countryCode: "FRA" },
  { group: "F", name: "Germany", countryCode: "GER" },
]

const seed = async () => {
  const teamsDB: Array<Team> = []
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i]
    const teamDB = await db.team.create({
      data: { name: team.name, countryCode: team.countryCode, group: team.group },
    })

    teamsDB.push(teamDB)
  }

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]

    await db.match.create({
      data: {
        homeTeam: {
          connect: {
            name: match.homeTeamName,
          },
        },
        awayTeam: {
          connect: {
            name: match.awayTeamName,
          },
        },
        arena: match.arena,
        round: `${match.round}`,
        kickOff: dayjs(match.kickOff, "DD/MM/YYYY HH:mm").toDate(),
      },
    })
  }
}

export default seed
