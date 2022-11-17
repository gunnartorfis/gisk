import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { invoke, useMutation, useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { Box, FormLabel, Grid, Input, useColorModeValue } from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"
import Layout from "app/core/layouts/Layout"
import getQuizQuestions from "app/matches/queries/getQuizQuestions"
import getTeams from "app/teams/queries/getTeams"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import getPlayers from "app/matches/queries/getPlayers"

export const MatchesList = () => {
  const user = useCurrentUser()
  const { query } = useRouter()
  const userId = query.id as string | undefined
  const [quizQuestions] = useQuery(getQuizQuestions, { userId })
  const [teams] = useQuery(getTeams, {}, { enabled: quizQuestions?.length > 0 })
  const [players] = useQuery(
    getPlayers,
    { useGoalies: false },
    { enabled: quizQuestions?.length > 0 }
  )
  const [goalies] = useQuery(
    getPlayers,
    { useGoalies: true },
    { enabled: quizQuestions?.length > 0 }
  )

  const getAnswer = (answerId?: string | null) =>
    teams?.find((team) => team.id === answerId)?.name ||
    players?.find((player) => player.id === answerId)?.name ||
    goalies?.find((g) => g.id === answerId)?.name ||
    (t("UNANSWERED") as string)
  const { t, i18n } = useTranslation()

  useUserLocale(user)
  const bgColorMode = useColorModeValue("gray.50", "gray.900")
  const questionsBg = useColorModeValue("white", "gray.700")

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
          <Grid templateColumns={{ base: "auto", md: "auto auto" }} gap={5} justifyItems="start">
            {quizQuestions.map((question) => {
              const localizedQuestion = question.translations.find(
                (t) => t.language === i18n.language
              )

              return (
                <Box key={question.id}>
                  <FormLabel>{localizedQuestion?.question}</FormLabel>
                  <Input
                    disabled
                    value={getAnswer(
                      question.UserQuizQuestion.find((uq) => uq.quizQuestionId === question.id)
                        ?.answer
                    )}
                  />
                </Box>
              )
            })}
          </Grid>
        </Box>
      ) : null}
    </Box>
  )
}

const Questions: BlitzPage = () => {
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

Questions.authenticate = true
Questions.getLayout = (page) => <Layout>{page}</Layout>

export default Questions
