import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import removeUserFromLeagueIfExists from "app/leagues/mutations/removeUserFromLeagueIfExists"
import getLeague from "app/leagues/queries/getLeague"
import getMatches from "app/matches/queries/getMatches"
import getMatchResults from "app/matches/queries/getMatchResults"
import { BlitzPage, Head, useMutation, useQuery, useRouter } from "blitz"
import React, { Suspense } from "react"

export const League = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [removeUser, { isLoading: isRemovingUser }] = useMutation(removeUserFromLeagueIfExists)
  const leagueId = router.params.id
  const [league, { isLoading, error }] = useQuery(getLeague, {
    id: leagueId,
  })
  const [matches, { isLoading: isLoadingMatches }] = useQuery(getMatchResults, {})
  if (error) {
    return <Text>ERror! </Text>
  }
  if (isLoading || isLoadingMatches) {
    return <Text>Loading</Text>
  }
  const userIsLeagueAdmin =
    currentUser?.userLeague.find((l) => l.leagueId === leagueId)?.role === "ADMIN"

  return (
    <Flex direction="column">
      <Box>
        <Text fontSize="6xl" fontWeight="extrabold">
          {league.name}
        </Text>
        <Text fontSize="1xl">
          Invite code: <strong>{league.inviteCode}</strong>
        </Text>
      </Box>
      <Table variant="simple" mt="32px">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Score</Th>
            {userIsLeagueAdmin ? <Th>-</Th> : null}
          </Tr>
        </Thead>
        <Tbody>
          {league.UserLeague.map((ul, i) => (
            <Tr key={ul.userId}>
              <Td>{ul.user.name}</Td>
              <Td isNumeric>
                {(() => {
                  let score = 0
                  ul.predictions.forEach((prediction) => {
                    const match = matches.find((m) => m.id === prediction.matchId)
                    if (match) {
                      const { resultHome, resultAway } = match
                      if (resultHome !== null && resultAway !== null) {
                        if (
                          resultHome === prediction.resultHome &&
                          resultAway === prediction.resultAway
                        ) {
                          score += 1
                        }

                        if (
                          resultHome === resultAway &&
                          prediction.resultHome === prediction.resultAway
                        ) {
                          score += 1
                        } else {
                          const resultMatch = Math.sign(resultHome - resultAway)
                          const resultUser = Math.sign(
                            prediction.resultHome - prediction.resultAway
                          )
                          if (resultMatch === resultUser) {
                            score += 1
                          }
                        }
                      }
                    }
                  })
                  return score
                })()}
              </Td>
              {userIsLeagueAdmin ? (
                <Td
                  color="red.400"
                  cursor="pointer"
                  onClick={async () => {
                    if (!isRemovingUser) {
                      removeUser({
                        leagueId: ul.leagueId,
                        userId: ul.userId,
                      })
                    }
                  }}
                >
                  <DeleteIcon />
                </Td>
              ) : null}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  )
}

const LeaguesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>League</title>
      </Head>

      <Container paddingTop="16px">
        <Suspense fallback={<div>Loading...</div>}>
          <League />
        </Suspense>
      </Container>
    </>
  )
}

LeaguesPage.authenticate = true
LeaguesPage.getLayout = (page) => <Layout>{page}</Layout>

export default LeaguesPage
