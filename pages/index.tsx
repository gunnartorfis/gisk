import { useRouter } from "next/router"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { BlitzPage } from "@blitzjs/next"
import { Button } from "@chakra-ui/button"
import { AddIcon } from "@chakra-ui/icons"
import { Box, Center, Text } from "@chakra-ui/layout"
import { useColorModeValue, useDisclosure } from "@chakra-ui/react"
import logout from "app/auth/mutations/logout"
import CreateLeagueModal from "app/core/components/CreateLeagueModal"
import Welcome from "app/core/components/Welcome"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import useUserLocale from "app/core/hooks/useUserLocale"
import Layout from "app/core/layouts/Layout"
import LeagueInvite from "app/leagues/components/LeagueInvite"
import getMatches from "app/matches/queries/getMatches"
import dayjs from "dayjs"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { MatchesForDay } from "./matches"

export const CORRECT_RESULT = "correct_result"
export const CORRECT_SCORE = "correct_score"

const date = new Date()

const Dashboard = () => {
  const currentUser = useCurrentUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const notInLeagueBg = useColorModeValue("white", "gray.700")
  const { t } = useTranslation()
  const router = useRouter()

  const [matchesForToday, { isLoading }] = useQuery(
    getMatches,
    {
      date,
    },
    {
      enabled: !!currentUser,
    }
  )

  useUserLocale(currentUser)

  if (!currentUser || isLoading) {
    return <UserInfo />
  }

  const userIsNotInLeague = currentUser.userLeague?.length === 0

  if (userIsNotInLeague) {
    return (
      <Center mt="16px">
        <Box
          display="flex"
          flexDirection="column"
          flexWrap="wrap"
          w="100%"
          alignItems="center"
          justifyContent="center"
          borderRadius="md"
          bg={notInLeagueBg}
          boxShadow="md"
          padding="40px 80px"
          margin={["0px", 0]}
        >
          <Button onClick={onOpen} mb={["32px", "12px"]}>
            {t("NEW_LEAGUE")}
            <AddIcon w={3} h={3} ml="8px" />
          </Button>
          <LeagueInvite />
        </Box>
        <CreateLeagueModal isOpen={isOpen} onClose={onClose} />
      </Center>
    )
  }

  if (matchesForToday?.length === 0) {
    router.replace("/matches")
    return null
  }

  return (
    <Box>
      <MatchesForDay matches={matchesForToday} date={dayjs().toString()} />
    </Box>
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

      {/* eslint-disable-next-line react/no-unknown-property */}
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
