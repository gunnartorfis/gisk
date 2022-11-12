import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Switch,
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
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"
import Layout from "app/core/layouts/Layout"
import updateResultForUser from "app/matches/mutations/updateResultForUser"
import getMatches, { MatchWithScore } from "app/matches/queries/getMatches"
import getQuizQuestions from "app/matches/queries/getQuizQuestions"
import getTeams from "app/teams/queries/getTeams"
import updateQuizAnswer from "app/users/mutations/updateQuizAnswers"
import randomGeneratePredictionsMutation from "app/users/mutations/randomGeneratePredictions"
import { BlitzPage, Head, Image, invoke, useMutation, useQuery, useRouter } from "blitz"
import dayjs from "dayjs"
import "dayjs/locale/en"
import "dayjs/locale/is"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const MATCH_FORMAT = "dddd DD. MMMM YYYY"

type MatchesByDayType = {
  [key: string]: MatchWithScore[]
}

export const MatchesList = () => {
  const user = useCurrentUser()
  const showPredictedMatches = React.useRef(true)
  const showPastMatches = React.useRef(true)
  const [matches, { isLoading, refetch }] = useQuery(
    getMatches,
    {
      showPredictedMatches: showPredictedMatches.current,
      showPastMatches: showPastMatches.current,
    },
    {
      enabled: (user?.userLeague?.length ?? 0) > 0,
    }
  )
  const [randomGeneratePredictions, { isLoading: isRandomGeneratingPredictions }] = useMutation(
    randomGeneratePredictionsMutation
  )
  const [quizQuestions, { isLoading: isLoadingQuiz }] = useQuery(getQuizQuestions, {})
  const [teams] = useQuery(getTeams, {}, { enabled: !isLoadingQuiz || quizQuestions?.length > 0 })
  const [updateQuizAnswerMutation, { isLoading: isSubmittingQuiz }] = useMutation(updateQuizAnswer)

  // const todaySection = React.useRef<HTMLDivElement>(null)
  const router = useRouter()

  const bgColorMode = useColorModeValue("gray.50", "gray.900")
  const questionsBg = useColorModeValue("white", "gray.700")
  const { t, i18n } = useTranslation()

  const [randomGenerateModalIsOpen, setRandomGenerateModalIsOpen] = React.useState(false)
  const onCloseRandomGenerateModal = () => setRandomGenerateModalIsOpen(false)
  const randomGenerateModalCancelButtonRef = React.useRef<HTMLButtonElement>(null)

  useUserLocale(user)

  const filterBoxBgMode = useColorModeValue("white", "gray.700")

  const getDateWithoutTimeFromDate = (date: Date) => {
    return new Date(dayjs(date).format("MM/DD/YYYY"))
  }

  const onChangeShowPredictedMatches = (checked: boolean) => {
    showPredictedMatches.current = checked
    refetch()
  }

  const onChangeShowPastMatches = (checked: boolean) => {
    showPastMatches.current = checked
    refetch()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const matchesByDate: MatchesByDayType = {}

  matches?.forEach((m) => {
    const currentMatchDate = dayjs(getDateWithoutTimeFromDate(m.kickOff)).toString()

    if (currentMatchDate in matchesByDate) {
      matchesByDate[currentMatchDate].push(m)
    } else {
      matchesByDate[currentMatchDate] = [m]
    }
  })

  if (user?.userLeague?.length === 0) {
    router.push("/")
    return null
  }

  if (isLoading || isLoadingQuiz) {
    return null
  }

  return (
    <>
      <Box pb="16px" bg={bgColorMode}>
        {quizQuestions.length > 0 ? (
          <details>
            <summary>
              <Alert bg={questionsBg} status="info">
                <AlertIcon />
                {t("QUIZ_ALERT")}
              </Alert>
            </summary>

            <Box
              padding="32px"
              borderTop="1px"
              borderBottom="1px"
              borderColor="gray.200"
              boxShadow="md"
              margin="0 auto"
              bg={questionsBg}
            >
              <Grid
                templateColumns={{ base: "auto", md: "auto auto" }}
                gap={5}
                justifyItems="start"
              >
                {quizQuestions.map((question) => {
                  return (
                    <Box key={question.id}>
                      <FormLabel>
                        {question.translations.find((t) => t.language === i18n.language)?.question}
                      </FormLabel>
                      <Box>
                        <Select
                          id={question.id}
                          defaultValue={
                            question.UserQuizQuestion.find(
                              (uq) => uq.quizQuestionId === question.id
                            )?.answer ?? "-1"
                          }
                        >
                          <option disabled value="-1">
                            {t("SELECT_A_TEAM")}
                          </option>
                          {teams?.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </Select>
                        <Button
                          disabled={isSubmittingQuiz}
                          variant="text"
                          onClick={async () => {
                            const quizQuestionId = question.id
                            const answer = (document.getElementById(
                              question.id
                            ) as HTMLInputElement)?.value

                            updateQuizAnswerMutation({
                              quizQuestionId,
                              answer,
                            })
                          }}
                        >
                          {t("UPDATE")}
                        </Button>
                      </Box>
                    </Box>
                  )
                })}
              </Grid>
            </Box>
          </details>
        ) : null}
        <Text width="100%" textAlign="center" paddingTop="8px">
          {t("MATCHES_TIMEZONE_INFO")}
        </Text>
        <Box
          borderRadius="md"
          boxShadow="md"
          display="flex"
          direction="row"
          padding="8px 16px"
          backgroundColor={filterBoxBgMode}
          rounded="16px"
          alignItems="center"
          justifyContent="center"
          width="max-content"
          margin="16px auto 0 auto"
        >
          <FormControl
            w="auto"
            onChange={(e) => {
              onChangeShowPredictedMatches((e.target as any).checked)
            }}
          >
            <FormLabel htmlFor="show-predicted-matches" mb="0">
              {t("SHOW_PREDICTED_MATCHES")}
            </FormLabel>
            <Switch defaultChecked id="show-predicted-matches" />
          </FormControl>
          <FormControl
            w="auto"
            onChange={(e) => {
              onChangeShowPastMatches((e.target as any).checked)
            }}
          >
            <FormLabel htmlFor="show-past-matches" mb="0">
              {t("SHOW_PAST_MATCHES")}
            </FormLabel>
            <Switch defaultChecked id="show-past-matches" />
          </FormControl>
        </Box>
        <Button
          onClick={() => setRandomGenerateModalIsOpen(true)}
          m="0 auto"
          display="block"
          mt="16px"
        >
          {t("RANDOM_GENERATE_PREDICTIONS")}
        </Button>
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
              {t("REMOVE_USER_FROM_LEAGUE_MODAL_TITLE")}
            </AlertDialogHeader>

            <AlertDialogBody>{t("REMOVE_USER_FROM_LEAGUE_MODAL_DESCRIPTION")}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={randomGenerateModalCancelButtonRef} onClick={onCloseRandomGenerateModal}>
                {t("CANCEL")}
              </Button>
              <Button
                isLoading={isRandomGeneratingPredictions}
                onClick={async () => {
                  await randomGeneratePredictions()
                  onCloseRandomGenerateModal()
                  refetch()
                }}
                colorScheme="blue"
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
    <Flex direction="column" justifyContent="center" alignItems="center" pt="32px" key={date}>
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
          w={["95%", "90%", "60%"]}
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
                      <Flex dir="row" alignItems="center">
                        <Box
                          maxWidth={{ base: "14px", md: "30px" }}
                          maxHeight={{ base: "14px", md: "30px" }}
                          mr="8px"
                        >
                          <Image
                            src={`/teams/${m.homeTeam.countryCode}.png`}
                            alt={m.homeTeam.countryCode}
                            width="30px"
                            height="30px"
                            loading="lazy"
                          />
                        </Box>
                        <Text display={{ md: "inline", base: "none" }}>{m.homeTeam.name}</Text>
                        <Text display={{ base: "inline", md: "none" }}>
                          {m.homeTeam.countryCode}
                        </Text>
                        <Text marginLeft="2px">({m.homeTeam.group})</Text>
                      </Flex>
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
                      <Flex dir="row" alignItems="center">
                        <Box
                          maxWidth={{ base: "14px", md: "30px" }}
                          maxHeight={{ base: "14px", md: "30px" }}
                          mr="8px"
                        >
                          <Image
                            src={`/teams/${m.awayTeam.countryCode}.png`}
                            alt={m.awayTeam.countryCode}
                            width="30px"
                            height="30px"
                            loading="lazy"
                          />
                        </Box>
                        <Text display={{ md: "inline", base: "none" }}>{m.awayTeam.name}</Text>
                        <Text display={{ base: "inline", md: "none" }}>
                          {m.awayTeam.countryCode}
                        </Text>
                        <Text marginLeft="2px">({m.awayTeam.group})</Text>
                      </Flex>
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
