const matches = [
  {
    round: 1,
    kickOff: "11/12/2021 21:00",
    arena: "Olimpico in Rome",
    homeTeamName: "Turkey",
    awayTeamName: "Italy",
    group: "Group A",
  },
  {
    round: 1,
    kickOff: "12/12/2021 15:00",
    arena: "Baki Olimpiya Stadionu",
    homeTeamName: "Wales",
    awayTeamName: "Switzerland",
    group: "Group A",
  },
  {
    round: 1,
    kickOff: "12/12/2021 18:00",
    arena: "Parken",
    homeTeamName: "Denmark",
    awayTeamName: "Finland",
    group: "Group B",
  },
  {
    round: 1,
    kickOff: "12/12/2021 21:00",
    arena: "Gazprom Arena",
    homeTeamName: "Belgium",
    awayTeamName: "Russia",
    group: "Group B",
  },
  {
    round: 1,
    kickOff: "13/12/2021 15:00",
    arena: "Wembley Stadium",
    homeTeamName: "England",
    awayTeamName: "Croatia",
    group: "Group D",
  },
  {
    round: 1,
    kickOff: "13/12/2021 18:00",
    arena: "National Arena Bucharest",
    homeTeamName: "Austria",
    awayTeamName: "North Macedonia",
    group: "Group C",
  },
  {
    round: 1,
    kickOff: "13/12/2021 21:00",
    arena: "Johan Cruijff ArenA",
    homeTeamName: "Netherlands",
    awayTeamName: "Ukraine",
    group: "Group C",
  },
  {
    round: 1,
    kickOff: "14/12/2021 15:00",
    arena: "Hampden Park",
    homeTeamName: "Scotland",
    awayTeamName: "Czech Republic",
    group: "Group D",
  },
  {
    round: 1,
    kickOff: "14/12/2021 18:00",
    arena: "Aviva Stadium",
    homeTeamName: "Poland",
    awayTeamName: "Slovakia",
    group: "Group E",
  },
  {
    round: 1,
    kickOff: "14/12/2021 21:00",
    arena: "Estadio de San Mamés",
    homeTeamName: "Spain",
    awayTeamName: "Sweden",
    group: "Group E",
  },
  {
    round: 1,
    kickOff: "15/12/2021 18:00",
    arena: "Puskás Aréna",
    homeTeamName: "Hungary",
    awayTeamName: "Portugal",
    group: "Group F",
  },
  {
    round: 1,
    kickOff: "15/12/2021 21:00",
    arena: "Allianz Arena",
    homeTeamName: "France",
    awayTeamName: "Germany",
    group: "Group F",
  },
  {
    round: 2,
    kickOff: "16/12/2021 15:00",
    arena: "Gazprom Arena",
    homeTeamName: "Finland",
    awayTeamName: "Russia",
    group: "Group B",
  },
  {
    round: 2,
    kickOff: "16/12/2021 18:00",
    arena: "Baki Olimpiya Stadionu",
    homeTeamName: "Turkey",
    awayTeamName: "Wales",
    group: "Group A",
  },
  {
    round: 2,
    kickOff: "16/12/2021 21:00",
    arena: "Olimpico in Rome",
    homeTeamName: "Italy",
    awayTeamName: "Switzerland",
    group: "Group A",
  },
  {
    round: 2,
    kickOff: "17/12/2021 15:00",
    arena: "National Arena Bucharest",
    homeTeamName: "Ukraine",
    awayTeamName: "North Macedonia",
    group: "Group C",
  },
  {
    round: 2,
    kickOff: "17/12/2021 18:00",
    arena: "Parken",
    homeTeamName: "Denmark",
    awayTeamName: "Belgium",
    group: "Group B",
  },
  {
    round: 2,
    kickOff: "17/12/2021 21:00",
    arena: "Johan Cruijff ArenA",
    homeTeamName: "Netherlands",
    awayTeamName: "Austria",
    group: "Group C",
  },
  {
    round: 2,
    kickOff: "18/12/2021 15:00",
    arena: "Aviva Stadium",
    homeTeamName: "Sweden",
    awayTeamName: "Slovakia",
    group: "Group E",
  },
  {
    round: 2,
    kickOff: "18/12/2021 18:00",
    arena: "Hampden Park",
    homeTeamName: "Croatia",
    awayTeamName: "Czech Republic",
    group: "Group D",
  },
  {
    round: 2,
    kickOff: "18/12/2021 21:00",
    arena: "Wembley Stadium",
    homeTeamName: "England",
    awayTeamName: "Scotland",
    group: "Group D",
  },
  {
    round: 2,
    kickOff: "19/12/2021 15:00",
    arena: "Puskás Aréna",
    homeTeamName: "Hungary",
    awayTeamName: "France",
    group: "Group F",
  },
  {
    round: 2,
    kickOff: "19/12/2021 18:00",
    arena: "Allianz Arena",
    homeTeamName: "Portugal",
    awayTeamName: "Germany",
    group: "Group F",
  },
  {
    round: 2,
    kickOff: "19/12/2021 21:00",
    arena: "Estadio de San Mamés",
    homeTeamName: "Spain",
    awayTeamName: "Poland",
    group: "Group E",
  },
  {
    round: 3,
    kickOff: "20/12/2021 18:00",
    arena: "Olimpico in Rome",
    homeTeamName: "Italy",
    awayTeamName: "Wales",
    group: "Group A",
  },
  {
    round: 3,
    kickOff: "20/12/2021 18:00",
    arena: "Baki Olimpiya Stadionu",
    homeTeamName: "Switzerland",
    awayTeamName: "Turkey",
    group: "Group A",
  },
  {
    round: 3,
    kickOff: "21/12/2021 18:00",
    arena: "National Arena Bucharest",
    homeTeamName: "Ukraine",
    awayTeamName: "Austria",
    group: "Group C",
  },
  {
    round: 3,
    kickOff: "21/12/2021 18:00",
    arena: "Johan Cruijff ArenA",
    homeTeamName: "North Macedonia",
    awayTeamName: "Netherlands",
    group: "Group C",
  },
  {
    round: 3,
    kickOff: "21/12/2021 21:00",
    arena: "Gazprom Arena",
    homeTeamName: "Finland",
    awayTeamName: "Belgium",
    group: "Group B",
  },
  {
    round: 3,
    kickOff: "21/12/2021 21:00",
    arena: "Parken",
    homeTeamName: "Russia",
    awayTeamName: "Denmark",
    group: "Group B",
  },
  {
    round: 3,
    kickOff: "22/12/2021 21:00",
    arena: "Wembley Stadium",
    homeTeamName: "Czech Republic",
    awayTeamName: "England",
    group: "Group D",
  },
  {
    round: 3,
    kickOff: "22/12/2021 21:00",
    arena: "Hampden Park",
    homeTeamName: "Croatia",
    awayTeamName: "Scotland",
    group: "Group D",
  },
  {
    round: 3,
    kickOff: "23/12/2021 18:00",
    arena: "Aviva Stadium",
    homeTeamName: "Sweden",
    awayTeamName: "Poland",
    group: "Group E",
  },
  {
    round: 3,
    kickOff: "23/12/2021 18:00",
    arena: "Estadio de San Mamés",
    homeTeamName: "Slovakia",
    awayTeamName: "Spain",
    group: "Group E",
  },
  {
    round: 3,
    kickOff: "23/12/2021 21:00",
    arena: "Allianz Arena",
    homeTeamName: "Germany",
    awayTeamName: "Hungary",
    group: "Group F",
  },
  {
    round: 3,
    kickOff: "23/12/2021 21:00",
    arena: "Puskás Aréna",
    homeTeamName: "Portugal",
    awayTeamName: "France",
    group: "Group F",
  },
]

export default matches
