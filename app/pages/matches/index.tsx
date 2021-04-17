import {
  Box,
  Image,
  Flex,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { Match, Team, UserLeagueMatch } from "@prisma/client"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import updateResultForUser from "app/matches/mutations/updateResultForUser"
import getMatches from "app/matches/queries/getMatches"
import { BlitzPage, Head, invoke, useQuery, useRouter } from "blitz"
import dayjs from "dayjs"
import { Suspense, useState } from "react"

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
  const toast = useToast()
  const bgColorMode = useColorModeValue("white", "gray.900")
  const tableBgColorMode = useColorModeValue("gray.50", "gray.700")
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
    try {
      if (newValue) {
        console.log("AA", newValue)
        await invoke(updateResultForUser, {
          userMatchId,
          newValue,
          resultKey,
        })
        toast({
          title: "Success!",
          description: "Score updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      toast({
        title: "Oops.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
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
      "DD. MMMM YYYY"
    )
    if (currentMatchDate in matchesByDate) {
      matchesByDate[currentMatchDate].push(m)
    } else {
      matchesByDate[currentMatchDate] = [m]
    }
  })

  return (
    <Box pb="16px" bg={bgColorMode}>
      {Object.keys(matchesByDate).map((date) => {
        const matchesForDay = matchesByDate[date]
        return (
          <Flex direction="column" justifyContent="center" alignItems="center" pt="16px" key={date}>
            <Text fontWeight="semibold" textAlign="center">
              {date}
            </Text>
            <Box
              p="16px"
              borderRadius="md"
              boxShadow="md"
              display="inline-block"
              margin="0 auto"
              mt={["8px", "20px"]}
              bg={tableBgColorMode}
            >
              <Table
                variant="simple"
                size="sm"
                maxWidth="600px"
                style={{
                  tableLayout: "fixed",
                }}
                bg={tableBgColorMode}
              >
                <Thead>
                  <Tr>
                    <Th pl={[0, "1.5rem"]} pr={[0, "1.5rem"]} textAlign="center">
                      Home
                    </Th>
                    <Th colSpan={3} textAlign="center">
                      Prediction
                    </Th>
                    <Th pl={[0, "1.5rem"]} pr={[0, "1.5rem"]} textAlign="center">
                      Away
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {matchesForDay?.map((m) => (
                    <Tr key={m.id}>
                      <Td w={["70px", "150px"]}>
                        <Flex dir="row" alignItems="center">
                          <Image
                            src={`/teams/${m.match.homeTeam.countryCode}.png`}
                            alt={m.match.homeTeam.countryCode}
                            w={{ base: "14px", md: "30px" }}
                            h={{ base: "14px", md: "30px" }}
                            mr="8px"
                          />
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
                          disabled={new Date() > m.match.kickOff}
                          onChange={(e) =>
                            onChangeResult({
                              userMatchId: m.id,
                              newValue: Number.parseInt(e.target.value),
                              resultKey: "resultHome",
                            })
                          }
                        />
                      </Td>
                      <Td textAlign="center" fontSize={{ base: "12px", md: "14px" }}>
                        {dayjs(m.match.kickOff).format("HH:mm")}
                      </Td>
                      <Td>
                        <Input
                          placeholder="0"
                          textAlign="center"
                          defaultValue={m.resultAway}
                          w="60px"
                          type="number"
                          disabled={new Date() > m.match.kickOff}
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
                          <Image
                            src={`/teams/${m.match.awayTeam.countryCode}.png`}
                            alt={m.match.awayTeam.countryCode}
                            mr="8px"
                            w={{ base: "14px", md: "30px" }}
                            h={{ base: "14px", md: "30px" }}
                          />
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
          </Flex>
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
