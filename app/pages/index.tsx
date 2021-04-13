import { Button } from "@chakra-ui/button"
import { Center, Grid, Text, Box } from "@chakra-ui/layout"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Link, useMutation } from "blitz"
import { Suspense } from "react"

const Dashboard = () => {
  const currentUser = useCurrentUser()

  if (currentUser) {
    return (
      <Box>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Button>
            <Link href="/groups">Groups</Link>
          </Button>
          <Button>
            <Link href="/matches">Matches</Link>
          </Button>
        </Grid>
      </Box>
    )
  }

  return <UserInfo />
}

const UserInfo = ({ hideLoginSignup }: { hideLoginSignup?: boolean }) => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

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
            Logout
          </Button>
        </Box>
      </Box>
    )
  }

  if (hideLoginSignup) {
    return null
  }

  return (
    <>
      <Button variant="solid">
        <Link href="/signup">
          <a className="">
            <strong>Sign Up</strong>
          </a>
        </Link>
      </Button>
      <Button>
        <Link href="/login">Login</Link>
      </Button>
    </>
  )
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <Center flexDirection="column">
          <Text
            fontSize="6xl"
            textAlign="center"
            fontWeight="extrabold"
            bgGradient="linear(to-l, #7928CA,#FF0080)"
            bgClip="text"
          >
            Euro 2020
          </Text>
        </Center>
        <div className="buttons" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <Suspense fallback="Loading...">
            <Dashboard />
          </Suspense>
        </div>
      </main>

      <footer>
        <Box
          bg="gray.100"
          w="100%"
          h="60px"
          border="1px"
          padding="0 16px"
          borderColor="#eaeaea"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <a href="https://twitter.com/gunnarthedev" target="_blank" rel="noopener noreferrer">
            Made by Gunnar with Blitz
          </a>
          <Suspense fallback="Loading...">
            <UserInfo hideLoginSignup />
          </Suspense>
        </Box>
      </footer>

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
          min-height: 100vh;
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
