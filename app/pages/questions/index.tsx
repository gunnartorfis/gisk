import {
  Box,
  Button,
  FormLabel,
  Grid,
  Select,
  useColorModeValue
} from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"
import Layout from "app/core/layouts/Layout"
import getQuizQuestions from "app/matches/queries/getQuizQuestions"
import getTeams from "app/teams/queries/getTeams"
import updateQuizAnswer from "app/users/mutations/updateQuizAnswers"
import { BlitzPage, Head, Image, invoke, useMutation, useQuery, useRouter } from "blitz"
import dayjs from "dayjs"
import React, { Suspense, useState } from "react"
import { useTranslation } from "react-i18next"
import getMatches from "../../matches/queries/getMatches"
import getPlayers from "../../matches/queries/getPlayers"

export const MatchesList = () => {
  const user = useCurrentUser();
  const [quizQuestions, { isLoading: isLoadingQuiz }] = useQuery(getQuizQuestions, {})
  const [teams] = useQuery(getTeams, {}, { enabled: !isLoadingQuiz || quizQuestions?.length > 0 })
  const [players] = useQuery(getPlayers, { useGoalies: false }, { enabled: !isLoadingQuiz || quizQuestions?.length > 0 });
  const [goalies] = useQuery(getPlayers, { useGoalies: true }, { enabled: !isLoadingQuiz || quizQuestions?.length > 0 });
  const [matches] = useQuery(
    getMatches,
    {},
    {
      enabled: (user?.userLeague?.length ?? 0) > 0,
    }
  );

  const firstMatchKickoff = matches?.[0].kickOff;
  const hasTournamentStarted = firstMatchKickoff && dayjs(new Date()).isAfter(firstMatchKickoff);

  const [updateQuizAnswerMutation] = useMutation(updateQuizAnswer)
  const { t, i18n } = useTranslation()

  useUserLocale(user)
  const bgColorMode = useColorModeValue("gray.50", "gray.900")
  const questionsBg = useColorModeValue("white", "gray.700")


  // Need to disable questions when first match has started
  return (
    <Box pb="16px" bg={bgColorMode}>
      {quizQuestions.length > 0 ? (
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
              const localizedQuestion = question.translations.find((t) => t.language === i18n.language);

              return (
                <Box key={question.id}>
                  <FormLabel>
                    {localizedQuestion?.question}
                  </FormLabel>
                  <Box>
                    <Select
                      id={question.id}
                      defaultValue={
                        question.UserQuizQuestion.find(
                          (uq) => uq.quizQuestionId === question.id
                        )?.answer ?? "-1"
                      }
                      disabled={hasTournamentStarted}
                      onChange={async () => {
                        const quizQuestionId = question.id
                        const answer = (
                          document.getElementById(question.id) as HTMLInputElement
                        )?.value

                        updateQuizAnswerMutation({
                          quizQuestionId,
                          answer,
                        })
                      }}
                    >
                      {localizedQuestion?.usePlayers && !localizedQuestion?.useGoalies && (
                        <>
                          <option disabled value="-1">
                            {t("SELECT_PLAYER")}
                          </option>
                          {players?.map((player) => (
                            <option key={player.id} value={player.id}>
                              {player.name}
                            </option>
                          ))}
                        </>
                      )}
                      {localizedQuestion?.useGoalies && !localizedQuestion?.usePlayers && (
                        <>
                          <option disabled value="-1">
                            {t("SELECT_PLAYER")}
                          </option>
                          {goalies?.map((goaly) => (
                            <option key={goaly.id} value={goaly.id}>
                              {goaly.name}
                            </option>
                          ))}
                        </>
                      )}
                      {!localizedQuestion?.useGoalies && !localizedQuestion?.useGoalies &&
                        <>
                          <option disabled value="-1">
                            {t("SELECT_A_TEAM")}
                          </option>
                          {teams?.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </>
                      }
                    </Select>
                  </Box>
                </Box>
              )
            })}
          </Grid>
        </Box>
      ) : null}
    </Box>)
}

const QuestionsPage: BlitzPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Head>
        <title>{t("QUESTIONS")}</title>
      </Head>

      <Suspense fallback={<div></div>}>
        <MatchesList />
      </Suspense>
    </>
  )
}

QuestionsPage.authenticate = true
QuestionsPage.getLayout = (page) => <Layout>{page}</Layout>

export default QuestionsPage
