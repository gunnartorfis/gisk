import { Container, Flex, Text } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import getTeams from "app/teams/queries/getTeams"
import { BlitzPage, Head, Image, Link, useQuery } from "blitz"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const TeamsList = () => {
  const [teams] = useQuery(getTeams, {})
  const { t } = useTranslation()
  const groups = Array.from(new Set(teams.map((t) => t.group)))
  const teamsByGroups = groups.map((group) => ({
    group,
    teams: teams.filter((t) => t.group === group),
  }))

  return (
    <Container>
      <Flex direction="column">
        {teamsByGroups.map((teamsByGroup) => (
          <Table
            variant="simple"
            key={teamsByGroup.group}
            mt="8px"
            style={{
              tableLayout: "fixed",
            }}
          >
            <Thead>
              <Tr>
                <Th isTruncated w="120px">
                  {t("GROUP")} {teamsByGroup.group}
                </Th>
                <Th isTruncated>{t("NAME")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teamsByGroup.teams?.map((team) => (
                <Tr key={team.id}>
                  <Td isTruncated w="120px">
                    <Image
                      src={`/teams/${team.countryCode}.png`}
                      alt={team.countryCode}
                      width={40}
                      height={40}
                      loading="lazy"
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
        ))}
      </Flex>
    </Container>
  )
}

const TeamsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Teams</title>
      </Head>

      <div>
        <Suspense fallback={<div></div>}>
          <TeamsList />
        </Suspense>
      </div>
    </>
  )
}

TeamsPage.authenticate = true
TeamsPage.getLayout = (page) => <Layout>{page}</Layout>

export default TeamsPage
