import { Button } from "@chakra-ui/button"
import { Box, Center, Container, Text } from "@chakra-ui/layout"
import { ListItem, UnorderedList, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import logout from "app/auth/mutations/logout"
import CreateLeagueModal from "app/core/components/CreateLeagueModal"
import Welcome from "app/core/components/Welcome"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import LeagueInvite from "app/leagues/components/LeagueInvite"
import { BlitzPage, useMutation } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const CORRECT_RESULT = "correct_result"
export const CORRECT_SCORE = "correct_score"

const Dashboard = () => {
  const currentUser = useCurrentUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const notInLeagueBg = useColorModeValue("white", "gray.900")
  const { t } = useTranslation()

  if (!currentUser) {
    return <UserInfo />
  }

  const userIsNotInLeague = currentUser.userLeague?.length === 0

  if (userIsNotInLeague) {
    return (
      <Center mt="16px">
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          w="100%"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          bg={notInLeagueBg}
          boxShadow="md"
          padding="40px 80px"
          margin={["0px 40px", 0]}
        >
          <Button onClick={onOpen} mb={["32px", 0]}>
            {t("NEW_LEAGUE")}
          </Button>
          <Box
            w="2px"
            h="100px"
            bg="gray.100"
            marginX="40px"
            display={{ base: "none", md: "block" }}
          />
          <LeagueInvite />
        </Box>
        <CreateLeagueModal isOpen={isOpen} onClose={onClose} />
      </Center>
    )
  }

  return (
    <Container>
      <Text fontSize="3xl" fontWeight="bold">
        {t("SCORING")}
      </Text>
      <UnorderedList>
        {[
          {
            rule: t("SCORING_RULE_1"),
            key: CORRECT_RESULT,
            score: 1,
          },
          {
            rule: t("SCORING_RULE_2"),
            key: CORRECT_SCORE,
            score: 2,
          },
        ].map(({ score, rule }) => (
          <ListItem key={`${score}.${rule}`}>
            <Text display="inline">{rule}: </Text>
            <Text display="inline" fontWeight="semibold">
              {score} {t("POINT")}
            </Text>
          </ListItem>
        ))}
      </UnorderedList>
    </Container>
  )
}

const UserInfo = ({ hideLoginSignup }: { hideLoginSignup?: boolean }) => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const { t } = useTranslation()

  if (currentUser) {
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <Text display="inline" fontSize="l" marginRight="8px">
          {currentUser.name}
        </Text>
        <Box>
          <Button
            variant="text"
            onClick={async () => {
              await logoutMutation()
            }}
          >
            {t("LOGOUT")}
          </Button>
        </Box>
      </Box>
    )
  }

  if (hideLoginSignup) {
    return null
  }

  return <Welcome />
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Suspense fallback="">
          <Dashboard />
        </Suspense>
      </main>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;700&display=swap");

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: "Libre Franklin", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          box-sizing: border-box;
        }
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main p {
          font-size: 1.2rem;
        }

        footer {
          width: 100%;
        }

        .buttons {
          display: grid;
          grid-auto-flow: column;
          grid-gap: 0.5rem;
        }
        .button {
          font-size: 1rem;
          background-color: #6700eb;
          padding: 1rem 2rem;
          color: #f4f4f4;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
