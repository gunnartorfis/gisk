import { BlitzPage } from "@blitzjs/next"
import { useQuery } from "@blitzjs/rpc"
import { Box, Table, Tbody, Td, Th, Thead, Tr, useColorModeValue } from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"
import Layout from "app/core/layouts/Layout"
import getLeaderboards from "app/matches/queries/getLeaderboards"
import "dayjs/locale/en"
import "dayjs/locale/is"
import Head from "next/head"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const Leaderboards = () => {
  const [users, { isLoading }] = useQuery(getLeaderboards, {})
  const tableBgColorMode = useColorModeValue("white", "gray.700")
  const bgColorMode = useColorModeValue("gray.50", "gray.900")
  const { t } = useTranslation()

  const user = useCurrentUser()
  useUserLocale(user)

  if (isLoading) {
    return null
  }

  return (
    <Box pb="16px" bg={bgColorMode}>
      <Table
        variant="simple"
        bg={tableBgColorMode}
        marginX="auto"
        maxWidth={["90%", "700px"]}
        marginTop="8px"
      >
        <Thead>
          <Tr>
            <Th textAlign="right">#</Th>
            <Th>{t("LEADERBOARDS_NAME")}</Th>
            <Th>{t("LEADERBOARDS_POINTS")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user, index) => (
            <Tr key={user.id} fontWeight={index === 0 ? "bold" : "normal"}>
              <Td textAlign="right">#{index + 1}</Td>
              <Td>{user.name}</Td>
              <Td>{user.score}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

const LeaderboardsMatchesLeaguePage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Leaderboards</title>
      </Head>

      <Suspense fallback={<div></div>}>
        <Leaderboards />
      </Suspense>
    </>
  )
}

LeaderboardsMatchesLeaguePage.authenticate = true
LeaderboardsMatchesLeaguePage.getLayout = (page) => <Layout>{page}</Layout>

export default LeaderboardsMatchesLeaguePage
