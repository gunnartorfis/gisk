import { Flex, Text } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getTeam from "app/teams/queries/getTeam"
import { BlitzPage, Head, useQuery, useRouter } from "blitz"
import { Suspense } from "react"

export const TeamDetails = () => {
  const router = useRouter()

  const [team] = useQuery(getTeam, {
    name: router.params.name,
  })

  // const matches = [
  //   ...team.homeMatches.map((m) => ({
  //     ...m,
  //     isHome: true,
  //   })),
  //   ...team.awayMatches.map((m) => ({
  //     ...m,
  //     isHome: false,
  //   })),
  // ].sort((a, b) => {
  //   if (a.kickOff > b.kickOff) return -1
  //   if (a.kickOff < b.kickOff) return 1
  //   return 0
  // })

  return (
    <Flex direction="column" wrap="wrap">
      <Text fontSize="3xl" fontWeight="semibold">
        {team.name}
      </Text>

      <Text>Matches</Text>
      {team.homeMatches.map((match) => (
        <Flex key={match.id} flex={1} p="40px" direction="column">
          <Table variant="simple" mt="8px" w="180px">
            <Thead>
              <Tr>
                <Th isTruncated>Home</Th>
                <Th isTruncated>Away</Th>
                <Th isTruncated>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {team.homeMatches?.map((match) => (
                <Tr key={match.id}>
                  <Td isTruncated w="80px">
                    {team.name}
                  </Td>
                  <Td isTruncated w="160px" cursor="pointer">
                    {match.awayTeam.name}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Flex>
      ))}
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
        <Suspense fallback={<div>Loading...</div>}>
          <TeamDetails />
        </Suspense>
      </div>
    </>
  )
}

TeamDetailPage.authenticate = true
TeamDetailPage.getLayout = (page) => <Layout>{page}</Layout>

export default TeamDetailPage
