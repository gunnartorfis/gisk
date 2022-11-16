import Head from "next/head"
import { useRouter } from "next/router"
import { useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { Flex, Text } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import Layout from "app/core/layouts/Layout"
import getTeam from "app/teams/queries/getTeam"
import { Suspense } from "react"
import { MatchesForDay } from "pages/matches"
import groupMatchesByDate from "app/utils/groupMatchesByDate"
import getUserLeagueMatches from "app/matches/queries/getUserLeagueMatches"
import { MatchWithScore } from "app/matches/queries/getMatches"
import React from "react"
import { calculateScoreForMatch } from "app/utils/calculateScore"
import Image from "next/image"
import TeamImage from "app/core/components/TeamImage"

export const TeamDetails = () => {
  const router = useRouter()

  const [team] = useQuery(getTeam, {
    name: router.query.name as string,
  })

  const [userLeagueMatches] = useQuery(getUserLeagueMatches, {})

  const homeMatches = team.homeMatches
  const awayMatches = team.awayMatches

  const matchesByDate = React.useMemo(() => {
    const matches: MatchWithScore[] = [...team.homeMatches, ...team.awayMatches].map((match) => {
      const userLeagueMatch = userLeagueMatches.find(
        (userLeagueMatch) => userLeagueMatch.matchId === match.id
      )
      return {
        ...match,
        userPredictionAway: userLeagueMatch?.resultAway,
        userPredictionHome: userLeagueMatch?.resultHome,
        score: calculateScoreForMatch(
          {
            resultHome: match.resultHome,
            resultAway: match.resultAway,
            scoreMultiplier: match.scoreMultiplier,
          },
          {
            resultHome: userLeagueMatch?.resultHome ?? null,
            resultAway: userLeagueMatch?.resultAway ?? null,
          }
        ),
      }
    })
    matches.sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime())

    const matchesByDate = groupMatchesByDate(matches)

    return matchesByDate
  }, [homeMatches, awayMatches])

  return (
    <Flex direction="column" wrap="wrap" maxWidth="700px" mx="auto" pt={8}>
      <Flex direction="row" alignItems="center" ml={["16px", 0]}>
        <TeamImage team={team} />
        <Text fontSize="2xl" fontWeight="bold" ml={2}>
          {team.name}
        </Text>
      </Flex>

      {Object.keys(matchesByDate).map((date) => {
        return <MatchesForDay key={date} matches={matchesByDate[date]} date={date} />
      })}
    </Flex>
  )
}

const TeamDetailPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Team</title>
      </Head>

      <div>
        <Suspense fallback={<div></div>}>
          <TeamDetails />
        </Suspense>
      </div>
    </>
  )
}

TeamDetailPage.authenticate = true
TeamDetailPage.getLayout = (page) => <Layout>{page}</Layout>

export default TeamDetailPage
