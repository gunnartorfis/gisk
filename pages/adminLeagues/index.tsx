import { gSSP } from "app/blitz-server"
import Head from "next/head"
import { useQuery } from "@blitzjs/rpc"
import { getSession } from "@blitzjs/auth"
import { BlitzPage } from "@blitzjs/next"
import {
  Box,
  Container,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react"
import { Match, Team } from "@prisma/client"
import Layout from "app/core/layouts/Layout"
import getAllLeagues from "app/leagues/queries/getAllLeagues"
import { Suspense } from "react"
import { GetServerSideProps } from "next"
import { assert } from "blitz"

export type MatchWithTeams = Match & {
  homeTeam: Team
  awayTeam: Team
}

export const AdminList = () => {
  const [leagues, { isLoading }] = useQuery(getAllLeagues, {})

  const bgColorMode = useColorModeValue("white", "gray.900")
  const tableBgColorMode = useColorModeValue("gray.50", "gray.700")

  if (isLoading) {
    return <p></p>
  }

  return (
    <Box bg={bgColorMode}>
      <Container pb="16px" pt="16px">
        <Flex
          bg={bgColorMode}
          direction="column"
          justifyContent="center"
          alignItems="center"
          pt="16px"
        >
          <Text fontWeight="semibold" textAlign="center">
            Deildir
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
                    Deild
                  </Th>
                  <Th textAlign="center">Fjöldi notenda</Th>
                </Tr>
              </Thead>
              <Tbody>
                {leagues?.map((m) => (
                  <Tr key={m.id}>
                    <Td flex={1}>
                      <Text>
                        {m.name} ({m.inviteCode})
                      </Text>
                    </Td>
                    <Td>
                      <Text textAlign="center">
                        {m.UserLeague.map(() => 1).reduce((a, b) => a + b, 0)}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}

const AdminLeaguesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Admin Leagues</title>
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

AdminLeaguesPage.authenticate = true
AdminLeaguesPage.getLayout = (page) => <Layout>{page}</Layout>

export default AdminLeaguesPage
