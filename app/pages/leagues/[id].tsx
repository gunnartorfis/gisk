import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getLeague from "app/leagues/queries/getLeague"
import { BlitzPage, Head, useQuery, useRouter } from "blitz"
import React, { Suspense } from "react"

export const League = () => {
  const router = useRouter()
  const [league, { isLoading, error }] = useQuery(getLeague, {
    id: router.params.id,
  })
  if (error) {
    console.log("ERror loading league", error)
    return <Text>ERror! </Text>
  }
  if (isLoading) {
    return <Text>Loading</Text>
  }
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
            <Th>#</Th>
            <Th isNumeric>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {league.UserLeague.map((ul, i) => (
            <Tr key={ul.userId}>
              <Td>{ul.user.name}</Td>
              <Td>{i + 1} (ToDo)</Td>
              <Td isNumeric></Td>
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
