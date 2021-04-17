import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Match, Team } from "@prisma/client"
import Layout from "app/core/layouts/Layout"
import getMatchResults from "app/matches/queries/getMatchResults"
import { BlitzPage, getSession, Head, useQuery } from "blitz"
import dayjs from "dayjs"
import { Suspense, useRef, useState } from "react"
import MatchDrawer from "./components/MatchDrawer"

export type MatchWithTeams = Match & {
  homeTeam: Team
  awayTeam: Team
}

export const AdminList = () => {
  const [matches, { isLoading, refetch }] = useQuery(getMatchResults, {})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const match = useRef<MatchWithTeams | undefined>()

  const bgColorMode = useColorModeValue("white", "gray.900")
  const tableBgColorMode = useColorModeValue("gray.50", "gray.700")

  if (isLoading) {
    return <p>Loading...</p>
  }

  const getDateWithoutTimeFromDate = (date: Date) => {
    return new Date(dayjs(date).format("MM/DD/YYYY"))
  }

  const onCloseDrawer = () => {
    onClose()
    refetch()
  }

  const onClickMatch = (m?: MatchWithTeams) => {
    match.current = m
    onOpen()
  }

  const matchesByDate: {
    [key: string]: MatchWithTeams[]
  } = {}
  matches?.forEach((m) => {
    const currentMatchDate = dayjs(getDateWithoutTimeFromDate(m.kickOff)).format("DD. MMM YYYY")
    if (currentMatchDate in matchesByDate) {
      matchesByDate[currentMatchDate].push(m)
    } else {
      matchesByDate[currentMatchDate] = [m]
    }
  })

  return (
    <Box bg={bgColorMode}>
      <Container pb="16px" pt="16px">
        <Flex direction="row" justifyContent="space-between">
          <Text
            fontSize="xl"
            color="yellow.400"
            textDecoration="underline"
            fontWeight="semibold"
            textAlign="center"
          >
            CAUTION! ADMIN PANEL
          </Text>
          <Button onClick={() => onClickMatch()}>New match</Button>
        </Flex>
        {Object.keys(matchesByDate).map((date) => {
          const matchesForDay = matchesByDate[date]
          return (
            <Flex
              bg={bgColorMode}
              direction="column"
              justifyContent="center"
              alignItems="center"
              pt="16px"
              key={date}
            >
              <Text fontWeight="semibold" textAlign="center">
                {date}
              </Text>
              <Box display="inline-block" margin="0 auto" mt={["8px", "20px"]} bg={bgColorMode}>
                <Table
                  p="16px"
                  borderRadius="md"
                  boxShadow="md"
                  variant="simple"
                  size="sm"
                  maxWidth="700px"
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
                      <Tr key={m.id} cursor="pointer" onClick={() => onClickMatch(m)}>
                        <Td w={["70px", "150px"]}>
                          <Flex dir="row" alignItems="center">
                            <Image
                              src={`/teams/${m.homeTeam.countryCode}.png`}
                              alt={m.homeTeam.countryCode}
                              w={{ base: "14px", md: "30px" }}
                              h={{ base: "14px", md: "30px" }}
                              mr="8px"
                            />
                            <Text display={{ md: "inline", base: "none" }}>{m.homeTeam.name}</Text>
                            <Text display={{ base: "inline", md: "none" }}>
                              {m.homeTeam.countryCode}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Text textAlign="center" w="60px">
                            {m.resultHome ?? "-"}
                          </Text>
                        </Td>
                        <Td textAlign="center" fontSize={{ base: "12px", md: "14px" }}>
                          {dayjs(m.kickOff).format("HH:mm")}
                        </Td>
                        <Td>
                          <Text textAlign="center" w="60px">
                            {m.resultAway ?? "-"}
                          </Text>
                        </Td>
                        <Td w="150px">
                          <Flex dir="row" alignItems="center">
                            <Image
                              src={`/teams/${m.awayTeam.countryCode}.png`}
                              alt={m.awayTeam.countryCode}
                              mr="8px"
                              w={{ base: "14px", md: "30px" }}
                              h={{ base: "14px", md: "30px" }}
                            />
                            <Text display={{ md: "inline", base: "none" }}>{m.awayTeam.name}</Text>
                            <Text display={{ base: "inline", md: "none" }}>
                              {m.awayTeam.countryCode}
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
        <MatchDrawer match={match.current} isOpen={isOpen} onClose={onCloseDrawer} />
      </Container>
    </Box>
  )
}

const AdminPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminList />
        </Suspense>
      </div>
    </>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)

  if (session.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return { props: {} }
}

AdminPage.authenticate = true
AdminPage.getLayout = (page) => <Layout>{page}</Layout>

export default AdminPage
