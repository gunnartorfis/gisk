import { Box, Center, Flex, Input, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { Match, Team, UserLeagueMatch } from "@prisma/client"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import updateResultForUser from "app/matches/mutations/updateResultForUser"
import getMatches from "app/matches/queries/getMatches"
import { BlitzPage, Head, Image, invoke, useQuery, useRouter } from "blitz"
import dayjs from "dayjs"
import { Suspense } from "react"

export const MatchesList = () => {
  const user = useCurrentUser()
  const [matches, { isLoading }] = useQuery(
    getMatches,
    {},
    {
      enabled: (user?.userLeague?.length ?? 0) > 0,
    }
  )

  const router = useRouter()
  if (user?.userLeague?.length === 0) {
    router.push("/")
    return null
  }

  if (isLoading) {
    return null
  }

  const onChangeResult = async ({
    userMatchId,
    newValue,
    resultKey,
  }: {
    userMatchId: string
    newValue: number
    resultKey: "resultHome" | "resultAway"
  }) => {
    await invoke(updateResultForUser, {
      userMatchId,
      newValue,
      resultKey,
    })
  }

  const getDateWithoutTimeFromDate = (date: Date) => {
    return new Date(dayjs(date).format("MM/DD/YYYY"))
  }

  const matchesByDate: {
    [key: string]: (UserLeagueMatch & {
      match: Match & {
        awayTeam: Team
        homeTeam: Team
      }
    })[]
  } = {}
  matches?.forEach((m) => {
    const currentMatchDate = dayjs(getDateWithoutTimeFromDate(m.match.kickOff)).format(
      "DD. MMM YYYY"
    )
    if (currentMatchDate in matchesByDate) {
      matchesByDate[currentMatchDate].push(m)
    } else {
      matchesByDate[currentMatchDate] = [m]
    }
  })

  return (
    <Box>
      {Object.keys(matchesByDate).map((date) => {
        const matchesForDay = matchesByDate[date]
        return (
          <Box mt="16px" key={date}>
            <Text fontWeight="semibold" textAlign="center">
              {date}
            </Text>
            <Table
              variant="simple"
              size="sm"
              w={["200px", "300px"]}
              margin="0 auto"
              mt={["8px", "20px"]}
            >
              <Thead>
                <Tr>
                  <Th>Home</Th>
                  <Th colSpan={3} textAlign="center">
                    Prediction
                  </Th>
                  <Th>Away</Th>
                </Tr>
              </Thead>
              <Tbody>
                {matchesForDay?.map((m) => (
                  <Tr key={m.id}>
                    <Td w={["70px", "150px"]}>
                      <Flex dir="row" alignItems="center">
                        <Box
                          w={{ base: "14px", md: "30px" }}
                          h={{ base: "14px", md: "30px" }}
                          mr="8px"
                        >
                          <Image
                            src={`/teams/${m.match.homeTeam.countryCode}.png`}
                            alt={m.match.homeTeam.countryCode}
                            width={30}
                            height={30}
                          />
                        </Box>
                        <Text display={{ md: "inline", base: "none" }}>
                          {m.match.homeTeam.name}
                        </Text>
                        <Text display={{ base: "inline", md: "none" }}>
                          {m.match.homeTeam.countryCode}
                        </Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Input
                        placeholder="0"
                        textAlign="center"
                        defaultValue={m.resultHome}
                        w="60px"
                        type="number"
                        onChange={(e) =>
                          onChangeResult({
                            userMatchId: m.id,
                            newValue: Number.parseInt(e.target.value),
                            resultKey: "resultHome",
                          })
                        }
                      />
                    </Td>
                    <Td>{dayjs(m.match.kickOff).format("HH:mm")}</Td>
                    <Td>
                      <Input
                        placeholder="0"
                        textAlign="center"
                        defaultValue={m.resultAway}
                        w="60px"
                        type="number"
                        onChange={(e) =>
                          onChangeResult({
                            userMatchId: m.id,
                            newValue: Number.parseInt(e.target.value),
                            resultKey: "resultAway",
                          })
                        }
                      />
                    </Td>
                    <Td w="150px">
                      <Flex dir="row" alignItems="center">
                        <Box
                          w={{ base: "14px", md: "30px" }}
                          h={{ base: "14px", md: "30px" }}
                          mr="8px"
                        >
                          <Image
                            src={`/teams/${m.match.awayTeam.countryCode}.png`}
                            alt={m.match.awayTeam.countryCode}
                            width={30}
                            height={30}
                          />
                        </Box>
                        <Text display={{ md: "inline", base: "none" }}>
                          {m.match.awayTeam.name}
                        </Text>
                        <Text display={{ base: "inline", md: "none" }}>
                          {m.match.awayTeam.countryCode}
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )
      })}
    </Box>
  )
}

const MatchesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Matches</title>
      </Head>

      <Suspense fallback={<div>Loading...</div>}>
        <MatchesList />
      </Suspense>
    </>
  )
}

MatchesPage.authenticate = true
MatchesPage.getLayout = (page) => <Layout>{page}</Layout>

export default MatchesPage
