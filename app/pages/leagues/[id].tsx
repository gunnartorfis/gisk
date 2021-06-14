import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import { Table, Tbody, Td, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import removeUserFromLeagueIfExists from "app/leagues/mutations/removeUserFromLeagueIfExists"
import getLeague from "app/leagues/queries/getLeague"
import { BlitzPage, Head, Link, useMutation, useQuery, useRouter } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { FiStar } from "react-icons/fi"

export const League = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [removeUser, { isLoading: isRemovingUser }] = useMutation(removeUserFromLeagueIfExists)
  const leagueId = router.params.id
  const [league, { isLoading }] = useQuery(getLeague, {
    id: leagueId,
  })
  const toast = useToast()
  const { t } = useTranslation()

  if (isLoading) {
    return <Text>Loading</Text>
  }
  const userIsLeagueAdmin =
    currentUser?.userLeague.find((l) => l.leagueId === leagueId)?.role === "ADMIN"

  const leagueWithScores = league

  return (
    <Flex direction="column">
      <Box>
        <Text fontSize="6xl" fontWeight="extrabold">
          {league.name}
        </Text>
        <Text fontSize="1xl">
          {t("INVITE_CODE_TO_LEAGUE")}: <strong>{league.inviteCode}</strong>
        </Text>
      </Box>
      <Table variant="simple" mt="32px">
        <Thead>
          <Tr>
            <Th>{t("NAME")}</Th>
            <Th isNumeric>{t("SCORE")}</Th>
            {userIsLeagueAdmin ? <Th></Th> : null}
          </Tr>
        </Thead>
        <Tbody>
          {leagueWithScores.UserLeague.map((ul, i) => (
            <Tr key={ul.userId}>
              <Td _hover={{ textDecoration: "underline" }}>
                <Flex direction="row" alignItems="center">
                  <Link
                    href={currentUser?.id === ul.user.id ? "/matches" : `/matches/${ul.user.id}`}
                  >
                    {ul.user.name}
                  </Link>
                  {ul.role === "ADMIN" ? (
                    <Box ml="8px">
                      <FiStar />
                    </Box>
                  ) : null}
                </Flex>
              </Td>
              <Td isNumeric>{ul.score}</Td>
              {userIsLeagueAdmin ? (
                <Td
                  color="red.400"
                  cursor="pointer"
                  onClick={async () => {
                    if (!isRemovingUser) {
                      if (ul.role === "ADMIN") {
                        return toast({
                          status: "error",
                          isClosable: true,
                          title: "Oops.",
                          description: "It is not possible to remove an admin.",
                        })
                      }

                      removeUser({
                        leagueId: ul.leagueId,
                        userId: ul.userId,
                      })
                    }
                  }}
                >
                  <DeleteIcon />
                </Td>
              ) : null}
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
        <Suspense fallback={<div></div>}>
          <League />
        </Suspense>
      </Container>
    </>
  )
}

LeaguesPage.authenticate = true
LeaguesPage.getLayout = (page) => <Layout>{page}</Layout>

export default LeaguesPage
