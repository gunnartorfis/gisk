import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import { useTheme } from "@chakra-ui/react"
import { Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/table"
import Layout from "app/core/layouts/Layout"
import getTeams from "app/teams/queries/getTeams"
import { BlitzPage, Head, Image, Link, useQuery } from "blitz"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const TeamsList = () => {
  const [teams] = useQuery(getTeams, {})
  const { t } = useTranslation()
  const theme = useTheme()
  const groups = Array.from(new Set(teams.map((t) => t.group)))
  const teamsByGroups = groups.map((group) => ({
    group,
    teams: teams.filter((t) => t.group === group),
  }))

  return (
    <Flex direction="row" flexWrap="wrap" maxW={"700px"} mx="auto">
      {teamsByGroups.map((group) => (
        <Box
          width="200px"
          key={group.group}
          p={4}
          mr={5}
          mt={5}
          border={`2px solid ${theme.colors.primary}`}
          borderRadius={"20px"}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mb={4}
            textAlign="center"
            borderBottom={`1px solid ${theme.colors.primary}`}
          >
            {`${t("GROUP")} ${group.group}`}
          </Text>
          {group.teams.map((team) => (
            <Flex direction="row" key={team.id} alignItems="center" mb={2}>
              <Image
                src={`/teams/${team.countryCode}.png`}
                alt={team.countryCode}
                width={30}
                height={30}
                loading="lazy"
              />
              <Box ml={2}>
                <Link href={`/teams/${team.name}`}>
                  <Text>
                    {team.name} ({team.countryCode})
                  </Text>
                </Link>
              </Box>
            </Flex>
          ))}
        </Box>
      ))}
    </Flex>
  )

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
