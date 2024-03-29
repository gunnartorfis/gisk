import { getSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { Button } from "@chakra-ui/button"
import {
  Box,
  Container,
  Flex,
  Image,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import { gSSP } from "app/blitz-server"
import MatchDrawer from "app/core/components/MatchDrawer"
import TeamImage from "app/core/components/TeamImage"
import Layout from "app/core/layouts/Layout"
import getMatchResults from "app/matches/queries/getMatchResults"
import { MatchWithTeams } from "app/types/MatchWithTeams"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { assert } from "blitz"
import dayjs from "dayjs"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { Suspense, useRef } from "react"

export const AdminList = () => {
  const [matches, { isLoading, refetch }] = useQuery(getMatchResults, {})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const match = useRef<MatchWithTeams | undefined>()

  const bgColorMode = useColorModeValue("white", "gray.900")
  const tableBgColorMode = useColorModeValue("gray.50", "gray.700")

  if (isLoading) {
    return <p></p>
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
      matchesByDate[currentMatchDate]?.push(m)
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
                            <TeamImage team={m.homeTeam} />
                            <Text ml="8px" display={{ md: "inline", base: "none" }}>
                              {m.homeTeam.name}
                            </Text>
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
                            <TeamImage team={m.awayTeam} />
                            <Text ml="8px" display={{ md: "inline", base: "none" }}>
                              {m.awayTeam.name}
                            </Text>
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

const AdminMatchesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <div>
        <Suspense fallback={<div></div>}>
          <AdminList />
        </Suspense>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context.req, context.res)

  try {
    assert(session.$isAuthorized("ADMIN"), "You must be logged in to access this page")
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return { props: {} }
}

AdminMatchesPage.authenticate = true
AdminMatchesPage.getLayout = (page) => <Layout>{page}</Layout>

export default AdminMatchesPage
