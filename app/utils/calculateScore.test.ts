import { calculateScoreForMatch } from "./calculateScore"

type CalculateScoreParams = Parameters<typeof calculateScoreForMatch>

const scoreTests: {
  match: CalculateScoreParams[0]
  prediction: CalculateScoreParams[1]
  expectedScore: number
}[] = [
  {
    match: {
      resultHome: 1,
      resultAway: 0,
      scoreMultiplier: 1,
    },
    prediction: {
      resultHome: 1,
      resultAway: 0,
    },
    expectedScore: 3,
  },
  {
    match: {
      resultHome: 1,
      resultAway: 0,
      scoreMultiplier: 3,
    },
    prediction: {
      resultHome: 1,
      resultAway: 0,
    },
    expectedScore: 9,
  },
  {
    match: {
      resultHome: 1,
      resultAway: 0,
      scoreMultiplier: 2.5,
    },
    prediction: {
      resultHome: 1,
      resultAway: 0,
    },
    expectedScore: 7.5,
  },
  {
    match: {
      resultHome: 0,
      resultAway: 0,
      scoreMultiplier: 1,
    },
    prediction: {
      resultHome: 0,
      resultAway: 0,
    },
    expectedScore: 3,
  },
  {
    match: {
      resultHome: 1,
      resultAway: 0,
      scoreMultiplier: 1,
    },
    prediction: {
      resultHome: 2,
      resultAway: 0,
    },
    expectedScore: 1,
  },
  {
    match: {
      resultHome: 2,
      resultAway: 0,
      scoreMultiplier: 1,
    },
    prediction: {
      resultHome: 1,
      resultAway: 0,
    },
    expectedScore: 1,
  },
  {
    match: {
      resultHome: 2,
      resultAway: 0,
      scoreMultiplier: 2,
    },
    prediction: {
      resultHome: 1,
      resultAway: 0,
    },
    expectedScore: 2,
  },
  {
    match: {
      resultHome: 0,
      resultAway: 2,
      scoreMultiplier: 1,
    },
    prediction: {
      resultHome: 1,
      resultAway: 0,
    },
    expectedScore: 0,
  },
  {
    match: {
      resultHome: 2,
      resultAway: 2,
      scoreMultiplier: 1,
    },
    prediction: {
      resultHome: 2,
      resultAway: 2,
    },
    expectedScore: 3,
  },
  {
    match: {
      resultHome: 0,
      resultAway: 2,
      scoreMultiplier: 1,
    },
    prediction: {
      resultHome: 0,
      resultAway: 2,
    },
    expectedScore: 3,
  },
]

it("calculates scores for matches correctly", () => {
  scoreTests.forEach(({ match, prediction, expectedScore }) => {
    expect(calculateScoreForMatch(match, prediction)).toEqual(expectedScore)
  })
})

export {}
