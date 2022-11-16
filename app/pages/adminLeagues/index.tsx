import { Box, Container, Flex, useColorModeValue, Text } from "@chakra-ui/react"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import { Match, Team } from "@prisma/client"
import Layout from "app/core/layouts/Layout"
import getAllLeagues from "app/leagues/queries/getAllLeagues"
import { BlitzPage, getSession, Head, useQuery } from "blitz"
import { Suspense } from "react"

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
                  <Th colSpan={3} textAlign="center">
                    Fjöldi notenda
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {leagues?.map((m) => (
                  <Tr key={m.id}>
                    <Td w={["70px", "150px"]}>
                      <Text>
                        {m.name} ({m.inviteCode})
                      </Text>
                    </Td>
                    <Td>
                      <Text textAlign="center" w="60px">
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

AdminLeaguesPage.authenticate = true
AdminLeaguesPage.getLayout = (page) => <Layout>{page}</Layout>

export default AdminLeaguesPage
