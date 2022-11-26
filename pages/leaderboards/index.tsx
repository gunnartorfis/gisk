import Head from "next/head"
import { useRouter } from "next/router"
import { invoke, useMutation, useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import {
  Box,
  Flex,
  Image,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { Match, Team, UserLeagueMatch } from "@prisma/client"
import Layout from "app/core/layouts/Layout"
import updateResultForUser from "app/matches/mutations/updateResultForUser"
import getQuizQuestions from "app/matches/queries/getQuizQuestions"
import dayjs from "dayjs"
import "dayjs/locale/is"
import "dayjs/locale/en"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import getMatchesFromCompetitors from "app/matches/queries/getMatchesFromCompetitors"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"
import TeamImage from "app/core/components/TeamImage"
import getLeaderboards from "app/matches/queries/getLeaderboards"

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

const MatchesLeaguePage: BlitzPage = () => {
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

MatchesLeaguePage.authenticate = true
MatchesLeaguePage.getLayout = (page) => <Layout>{page}</Layout>

export default MatchesLeaguePage
