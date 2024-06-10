import { BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { Flex, Text } from "@chakra-ui/layout"
import TeamImage from "app/core/components/TeamImage"
import Layout from "app/core/layouts/Layout"
import { MatchWithScore } from "app/matches/queries/getMatches"
import getUserLeagueMatches from "app/matches/queries/getUserLeagueMatches"
import getTeam from "app/teams/queries/getTeam"
import { calculateScoreForMatch } from "app/utils/calculateScore"
import groupMatchesByDate from "app/utils/groupMatchesByDate"
import Head from "next/head"
import { useRouter } from "next/router"
import { MatchesForDay } from "pages/matches"
import React, { Suspense } from "react"
import { useCurrentUser } from "../../app/core/hooks/useCurrentUser"
import getActiveTournament from "app/matches/queries/getActiveTournament"

export const TeamDetails = () => {
  const router = useRouter()

  const [team] = useQuery(getTeam, {
    name: router.query.name as string,
  })

  const [userLeagueMatches] = useQuery(getUserLeagueMatches, {})
  const [tournament] = useQuery(getActiveTournament, {})

  const user = useCurrentUser()

  const matchesByDate = React.useMemo(() => {
    const matches: MatchWithScore[] = [...team.homeMatches, ...team.awayMatches].map((match) => {
      const userLeagueMatch = userLeagueMatches.find(
        (userLeagueMatch) => userLeagueMatch.matchId === match.id
      )
      return {
        ...match,
        userPredictionAway: userLeagueMatch?.resultAway,
        userPredictionHome: userLeagueMatch?.resultHome,
        score: calculateScoreForMatch({
          match: {
            resultHome: match.resultHome,
            resultAway: match.resultAway,
            scoreMultiplier: match.scoreMultiplier,
            kickOff: match.kickOff,
          },
          prediction: {
            resultHome: userLeagueMatch?.resultHome ?? null,
            resultAway: userLeagueMatch?.resultAway ?? null,
          },
          user,
        }),
      }
    })
    matches.sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime())

    const matchesByDate = groupMatchesByDate(matches)

    return matchesByDate
  }, [team.homeMatches, team.awayMatches, userLeagueMatches, user])

  return (
    <Flex direction="column" wrap="wrap" maxWidth="700px" mx="auto" pt={8}>
      <Flex direction="row" alignItems="center" ml={["16px", 0]}>
        <TeamImage team={team} />
        <Text fontSize="2xl" fontWeight="bold" ml={2}>
          {team.name}
        </Text>
      </Flex>

      {Object.keys(matchesByDate).map((date) => {
        return (
          <MatchesForDay
            key={date}
            matches={matchesByDate[date]}
            date={date}
            tournament={tournament}
          />
        )
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
