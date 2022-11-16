import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { invoke, useMutation, useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Flex,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import { Button } from "@chakra-ui/button"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"
import Layout from "app/core/layouts/Layout"
import ArrowPath from "app/icons/ArrowPath"
import updateResultForUser from "app/matches/mutations/updateResultForUser"
import getMatches, { MatchWithScore } from "app/matches/queries/getMatches"
import randomGeneratePredictionsMutation from "app/users/mutations/randomGeneratePredictions"
import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/is"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import groupMatchesByDate from "app/utils/groupMatchesByDate"
import TeamImage from "app/core/components/TeamImage"
import Link from "next/link"
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.guess()

export const MATCH_FORMAT = "dddd DD. MMMM YYYY"

export const MatchesList = () => {
  const user = useCurrentUser()
  const [matches, { isLoading, refetch }] = useQuery(
    getMatches,
    {},
    {
      enabled: (user?.userLeague?.length ?? 0) > 0,
    }
  )
  const [randomGeneratePredictions, { isLoading: isRandomGeneratingPredictions }] = useMutation(
    randomGeneratePredictionsMutation
  )

  const router = useRouter()
  const toast = useToast()

  const bgColorMode = useColorModeValue("gray.50", "gray.900")
  const { t } = useTranslation()

  const [randomGenerateModalIsOpen, setRandomGenerateModalIsOpen] = React.useState(false)
  const onCloseRandomGenerateModal = () => setRandomGenerateModalIsOpen(false)
  const randomGenerateModalCancelButtonRef = React.useRef<HTMLButtonElement>(null)

  useUserLocale(user)

  const matchesByDate = groupMatchesByDate(matches)

  const userHasUnpredictedMatches = React.useMemo(() => {
    return matches?.some((m) => {
      return m.userPredictionHome === undefined && m.userPredictionAway === undefined
    })
  }, [matches])

  if (user?.userLeague?.length === 0) {
    toast({
      title: t("NO_LEAGUE_WARNING_TITLE"),
      description: t("NO_LEAGUE_WARNING_DESCRIPTION"),
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "bottom-right",
    })
    router.push("/")
    return null
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      <Box pb="16px" bg={bgColorMode}>
        {userHasUnpredictedMatches ? (
          <Box
            display={"flex"}
            flexDirection={["column", "row"]}
            alignItems={["center"]}
            justifyContent="space-between"
            mt="20px"
          >
            <Button
              onClick={() => setRandomGenerateModalIsOpen(true)}
              m="0 auto"
              display=""
              variant="solid"
            >
              {t("RANDOM_GENERATE_PREDICTIONS")}
              <ArrowPath style={{ marginLeft: 8 }} />
            </Button>
          </Box>
        ) : null}

        {Object.keys(matchesByDate).map((date) => {
          return <MatchesForDay key={date} matches={matchesByDate[date]} date={date} />
        })}
      </Box>
      <AlertDialog
        isOpen={randomGenerateModalIsOpen}
        leastDestructiveRef={randomGenerateModalCancelButtonRef}
        onClose={onCloseRandomGenerateModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("RANDOM_GENERATE_MODAL_TITLE")}
            </AlertDialogHeader>

            <AlertDialogBody>{t("RANDOM_GENERATE_MODAL_DESCRIPTION")}</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                variant="outline"
                ref={randomGenerateModalCancelButtonRef}
                onClick={onCloseRandomGenerateModal}
              >
                {t("CANCEL")}
              </Button>
              <Button
                isLoading={isRandomGeneratingPredictions}
                onClick={async () => {
                  await randomGeneratePredictions()
                  onCloseRandomGenerateModal()
                  refetch()
                }}
                variant="solid"
                ml={3}
              >
                {t("CONFIRM")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export const MatchesForDay = ({ matches, date }: { matches?: MatchWithScore[]; date: string }) => {
  const dayjsDate = dayjs(date)
  const currentDate = dayjs()
  const dateIsToday = dayjsDate.isSame(currentDate, "day")
  const dateIsInFuture = dayjsDate.diff(currentDate)

  let isExpandedInitial = false
  if (dateIsInFuture >= 0 || dateIsToday) {
    isExpandedInitial = true
  }

  const isToday = dayjs(date).isSame(dayjs(), "day")
  const [isExpanded, setIsExpanded] = React.useState(isExpandedInitial)

  const { t } = useTranslation()
  const toast = useToast()
  const tableBgColorMode = useColorModeValue("white", "gray.700")

  const onChangeResult = async ({
    matchId,
    newValue,
    resultKey,
  }: {
    matchId: string
    newValue: number
    resultKey: "resultHome" | "resultAway"
  }) => {
    try {
      if (newValue >= 0) {
        await invoke(updateResultForUser, {
          matchId,
          newValue,
          resultKey,
        })
        toast({
          title: t("SCORE_UPDATED_TITLE"),
          description: t("SCORE_UPDATED"),
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        })
      } else if (newValue < 0) {
        toast({
          title: t("SCORE_UPDATED_ERROR"),
          description: t("SCORE_NON_NEGATIVE"),
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        })
      }
    } catch (error) {
      toast({
        title: t("SCORE_UPDATED_ERROR"),
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      })
    }
  }

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      pt="32px"
      key={date}
      maxWidth="700px"
      mx="auto"
    >
      <Box
        display="flex"
        flexDir="row"
        cursor="pointer"
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
      >
        <Text fontWeight="semibold" textAlign="center">
          {dayjs(date).format(MATCH_FORMAT)} {isToday ? `(${t("TODAY").toLowerCase()})` : ""}
        </Text>
        {isExpanded ? <ChevronUpIcon fontSize="24px" /> : <ChevronDownIcon fontSize="24px" />}
      </Box>
      {isExpanded ? (
        <Box
          p="16px"
          borderRadius="md"
          boxShadow="md"
          display="inline-block"
          margin="0 auto"
          mt={["8px", "20px"]}
          bg={tableBgColorMode}
          w={["95%", "95%", "100%"]}
          // w="95%"
        >
          <Table
            variant="simple"
            size="sm"
            // maxWidth="600px"
            style={{
              tableLayout: "fixed",
            }}
            bg={tableBgColorMode}
          >
            <Thead>
              <Tr>
                <Th pl={[0, "1.5rem"]} pr={[0, "1.5rem"]} textAlign="center">
                  {t("HOME")}
                </Th>
                <Th textAlign="center">{t("PREDICTION")}</Th>
                <Th textAlign="center">{t("RESULT")}</Th>
                <Th textAlign="center">{t("PREDICTION")}</Th>
                <Th pl={[0, "1.5rem"]} pr={[0, "1.5rem"]} textAlign="center">
                  {t("AWAY")}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {matches?.map((m) => {
                return (
                  <Tr key={m.id}>
                    <Td p="0">
                      <Link href={`/teams/${m.homeTeam.name}`}>
                        <Flex dir="row" alignItems="center">
                          <TeamImage team={m.homeTeam} />
                          <Text ml="8px" display={{ md: "inline", base: "none" }}>
                            {m.homeTeam.name}
                          </Text>
                          <Text display={{ base: "inline", md: "none" }}>
                            {m.homeTeam.countryCode}
                          </Text>
                          <Text marginLeft="2px">({m.homeTeam.group})</Text>
                        </Flex>
                      </Link>
                    </Td>
                    <Td textAlign="center">
                      <Input
                        placeholder="-"
                        textAlign="center"
                        defaultValue={m.userPredictionHome ?? undefined}
                        type="number"
                        w="50px"
                        disabled={new Date() > m.kickOff}
                        onChange={(e) =>
                          onChangeResult({
                            matchId: m.id,
                            newValue: Number.parseInt(e.target.value),
                            resultKey: "resultHome",
                          })
                        }
                      />
                    </Td>
                    <Td p="0" textAlign="center" fontSize={{ base: "12px", md: "14px" }}>
                      {m.resultHome !== null && m.resultAway !== null ? (
                        <Box display="flex" flexDirection="column">
                          <Text>
                            {m.resultHome} - {m.resultAway}{" "}
                          </Text>
                          <Text color="darkgreen">
                            (+ {m.score}){" "}
                            {(m.scoreMultiplier ?? 1) > 1 ? `${m.scoreMultiplier}x points` : ""}
                          </Text>
                        </Box>
                      ) : (
                        <Box display="flex" flexDirection="column">
                          <Text>{dayjs(m.kickOff).format("HH:mm")}</Text>
                          {(m.scoreMultiplier ?? 1) > 1 ? (
                            <Text color="darkgreen">{m.scoreMultiplier}x points</Text>
                          ) : null}
                        </Box>
                      )}
                    </Td>
                    <Td p="0" textAlign="center">
                      <Input
                        placeholder="-"
                        textAlign="center"
                        defaultValue={m.userPredictionAway ?? undefined}
                        type="number"
                        w="50px"
                        disabled={new Date() > m.kickOff}
                        onChange={(e) =>
                          onChangeResult({
                            matchId: m.id,
                            newValue: Number.parseInt(e.target.value),
                            resultKey: "resultAway",
                          })
                        }
                      />
                    </Td>
                    <Td p="0">
                      <Link href={`/teams/${m.awayTeam.name}`}>
                        <Flex dir="row" alignItems="center">
                          <TeamImage team={m.awayTeam} />
                          <Text ml="8px" display={{ md: "inline", base: "none" }}>
                            {m.awayTeam.name}
                          </Text>
                          <Text display={{ base: "inline", md: "none" }}>
                            {m.awayTeam.countryCode}
                          </Text>
                          <Text marginLeft="2px">({m.awayTeam.group})</Text>
                        </Flex>
                      </Link>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      ) : null}
    </Flex>
  )
}

const MatchesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Matches</title>
      </Head>

      <Suspense fallback={<div></div>}>
        <MatchesList />
      </Suspense>
    </>
  )
}

MatchesPage.authenticate = true
MatchesPage.getLayout = (page) => <Layout>{page}</Layout>

export default MatchesPage
