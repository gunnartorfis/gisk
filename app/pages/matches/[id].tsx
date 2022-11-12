import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  Image,
  Input,
  Select,
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
import getTeams from "app/teams/queries/getTeams"
import updateQuizAnswer from "app/users/mutations/updateQuizAnswers"
import { BlitzPage, Head, invoke, useMutation, useQuery, useRouter } from "blitz"
import dayjs from "dayjs"
import "dayjs/locale/is"
import "dayjs/locale/en"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import getMatchesFromCompetitors from "app/matches/queries/getMatchesFromCompetitors"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"

export const MatchList = () => {
  const router = useRouter()
  const userId = router.query.id
  const user = useCurrentUser()
  const [matches, { isLoading }] = useQuery(getMatchesFromCompetitors, { userId })
  const [quizQuestions, { isLoading: isLoadingQuiz }] = useQuery(getQuizQuestions, {})
  const [teams] = useQuery(getTeams, {}, { enabled: !isLoadingQuiz || quizQuestions?.length > 0 })
  const [updateQuizAnswerMutation, { isLoading: isSubmittingQuiz }] = useMutation(updateQuizAnswer)

  const toast = useToast()
  const tableBgColorMode = useColorModeValue("white", "gray.700")
  const bgColorMode = useColorModeValue("gray.50", "gray.900")
  const questionsBg = useColorModeValue("white", "gray.700")
  const { t, i18n } = useTranslation()

  useUserLocale(user)

  if (user?.userLeague?.length === 0) {
    router.push("/")
    return null
  }

  if (isLoading || isLoadingQuiz) {
    return null
  }

  const onChangeResult = async ({
    userMatchId,
    newValue,
    resultKey,
  }: {
    userMatchId: string
    newValue: number
    resultKey: "resultHome" | "resultAway"
  }) => {
    try {
      if (newValue >= 0) {
        await invoke(updateResultForUser, {
          userMatchId,
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

  const getDateWithoutTimeFromDate = (date: Date) => {
    return new Date(dayjs(date).format("MM/DD/YYYY"))
  }

  const matchesByDate: {
    [key: string]: (UserLeagueMatch & {
      match: Match & {
        awayTeam: Team
        homeTeam: Team
      }
    })[]
  } = {}
  matches?.forEach((m) => {
    const currentMatchDate = dayjs(getDateWithoutTimeFromDate(m.match.kickOff)).format(
      "DD. MMMM YYYY"
    )
    if (currentMatchDate in matchesByDate) {
      matchesByDate[currentMatchDate].push(m)
    } else {
      matchesByDate[currentMatchDate] = [m]
    }
  })

  return (
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
            <Grid templateColumns={{ base: "auto", md: "auto auto" }} gap={5} justifyItems="start">
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
                          question.UserQuizQuestion.find((uq) => uq.quizQuestionId === question.id)
                            ?.answer ?? "-1"
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
                          const answer = (document.getElementById(question.id) as HTMLInputElement)
                            ?.value

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
      <Text width="100%" textAlign="center" marginTop="8px">
        {t("MATCHES_TIMEZONE_INFO")}
      </Text>
      {Object.keys(matchesByDate).map((date) => {
        const matchesForDay = matchesByDate[date]
        return (
          <Flex direction="column" justifyContent="center" alignItems="center" pt="16px" key={date}>
            <Text fontWeight="semibold" textAlign="center">
              {date}
            </Text>
            <Box
              p="16px"
              borderRadius="md"
              boxShadow="md"
              display="inline-block"
              margin="0 auto"
              mt={["8px", "20px"]}
              bg={tableBgColorMode}
            >
              <Table
                variant="simple"
                size="sm"
                maxWidth="600px"
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
                    <Th colSpan={3} textAlign="center">
                      {t("PREDICTION")}
                    </Th>
                    <Th pl={[0, "1.5rem"]} pr={[0, "1.5rem"]} textAlign="center">
                      {t("AWAY")}
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {matchesForDay?.map((m) => (
                    <Tr key={m.id}>
                      <Td w={["70px", "150px"]}>
                        <Flex dir="row" alignItems="center">
                          <Image
                            src={`/teams/${m.match.homeTeam.countryCode}.png`}
                            alt={m.match.homeTeam.countryCode}
                            w={{ base: "14px", md: "30px" }}
                            h={{ base: "14px", md: "30px" }}
                            mr="8px"
                            loading="lazy"
                          />
                          <Text display={{ md: "inline", base: "none" }}>
                            {m.match.homeTeam.name}
                          </Text>
                          <Text display={{ base: "inline", md: "none" }}>
                            {m.match.homeTeam.countryCode}
                          </Text>
                          <Text marginLeft="2px">({m.match.homeTeam.group})</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Input
                          placeholder="0"
                          textAlign="center"
                          defaultValue={`${m.resultHome ?? 0}`}
                          w="60px"
                          type="number"
                          disabled={new Date() > m.match.kickOff}
                          onChange={(e) =>
                            onChangeResult({
                              userMatchId: m.id,
                              newValue: Number.parseInt(e.target.value),
                              resultKey: "resultHome",
                            })
                          }
                        />
                      </Td>
                      <Td textAlign="center" fontSize={{ base: "12px", md: "14px" }}>
                        {dayjs(m.match.kickOff).format("HH:mm")}
                      </Td>
                      <Td>
                        <Input
                          placeholder="0"
                          textAlign="center"
                          defaultValue={`${m.resultAway ?? 0}`}
                          w="60px"
                          type="number"
                          disabled={new Date() > m.match.kickOff}
                          onChange={(e) =>
                            onChangeResult({
                              userMatchId: m.id,
                              newValue: Number.parseInt(e.target.value),
                              resultKey: "resultAway",
                            })
                          }
                        />
                      </Td>
                      <Td w="150px">
                        <Flex dir="row" alignItems="center">
                          <Image
                            src={`/teams/${m.match.awayTeam.countryCode}.png`}
                            alt={m.match.awayTeam.countryCode}
                            mr="8px"
                            w={{ base: "14px", md: "30px" }}
                            h={{ base: "14px", md: "30px" }}
                            loading="lazy"
                          />
                          <Text display={{ md: "inline", base: "none" }}>
                            {m.match.awayTeam.name}
                          </Text>
                          <Text display={{ base: "inline", md: "none" }}>
                            {m.match.awayTeam.countryCode}
                          </Text>
                          <Text marginRight="2px">({m.match.awayTeam.group})</Text>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Flex>
        )
      })}
    </Box>
  )
}

const MatchesLeaguePage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Matches</title>
      </Head>

      <Suspense fallback={<div></div>}>
        <MatchList />
      </Suspense>
    </>
  )
}

MatchesLeaguePage.authenticate = true
MatchesLeaguePage.getLayout = (page) => <Layout>{page}</Layout>

export default MatchesLeaguePage
