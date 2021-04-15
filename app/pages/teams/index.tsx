import { Flex, Text } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getTeams from "app/teams/queries/getTeams"
import { BlitzPage, Head, Image, Link, useQuery } from "blitz"
import { Suspense } from "react"

export const TeamsList = () => {
  const [teams] = useQuery(getTeams, {})

  const groups = Array.from(new Set(teams.map((t) => t.group)))
  const teamsByGroups = groups.map((group) => ({
    group,
    teams: teams.filter((t) => t.group === group),
  }))

  return (
    <Flex direction="row" wrap="wrap">
      {teamsByGroups.map((teamsByGroup) => (
        <Flex key={teamsByGroup.group} flex={1} p="40px" direction="column">
          <Table variant="simple" mt="8px" w="180px">
            <Thead>
              <Tr>
                <Th isTruncated>Group {teamsByGroup.group}</Th>
                <Th isTruncated>Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teamsByGroup.teams?.map((team) => (
                <Tr key={team.id}>
                  <Td isTruncated w="80px">
                    <Image
                      src={`/teams/${team.countryCode}.png`}
                      alt={team.countryCode}
                      width={40}
                      height={40}
                    />
                  </Td>
                  <Td isTruncated w="160px" cursor="pointer">
                    <Link href={`/teams/${team.name}`}>
                      <Text>
                        {team.name} ({team.countryCode})
                      </Text>
                    </Link>
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

const TeamsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Teams</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <TeamsList />
        </Suspense>
      </div>
    </>
  )
}

TeamsPage.authenticate = true
TeamsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TeamsPage
