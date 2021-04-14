import { Button } from "@chakra-ui/button"
import { Box, Center, Container, Grid, Text } from "@chakra-ui/layout"
import {
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import LeagueInvite from "app/leagues/components/LeagueInvite"
import createLeague from "app/leagues/mutations/createLeague"
import { BlitzPage, Link, useMutation, useRouter } from "blitz"
import React, { Suspense } from "react"
import { FiTv, FiUsers } from "react-icons/fi"

const DashboardItem: React.FunctionComponent<{
  href: string
}> = ({ children, href }) => {
  return (
    <Link href={href}>
      <Box
        padding="40px"
        bg="primary"
        borderRadius="base"
        color="white"
        fontSize="3xl"
        fontWeight="semibold"
        cursor="pointer"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        w="200px"
        h="200px"
        _hover={{
          bg: "primarydarker",
        }}
        role="group"
      >
        <Box
          transition="transform .2s"
          _groupHover={{
            transform: "scale(1.2)",
          }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _hover={{}}
        >
          {children}
        </Box>
      </Box>
    </Link>
  )
}

const Dashboard = () => {
  const currentUser = useCurrentUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const initialRef = React.useRef<any>(null)
  const [createLeagueMutation, { isLoading }] = useMutation(createLeague)

  if (!currentUser) {
    return <UserInfo />
  }

  const userIsNotInLeague = currentUser.leagues?.length === 0

  if (userIsNotInLeague) {
    return (
      <Center mt="16px">
        <Box
          display="flex"
          flexDirection="row"
          w="100%"
          alignItems="center"
          justifyContent="space-between"
          border="1px"
          borderColor="gray.100"
          padding="40px"
        >
          <Button onClick={onOpen}>Create a league</Button>
          <Box w="2px" h="100px" bg="gray.100" marginX="80px" />
          <LeagueInvite />
        </Box>
        <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <ModalHeader>New league</ModalHeader>
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>League name</FormLabel>
                  <Input ref={initialRef} placeholder="League name" />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  type="submit"
                  mr={3}
                  onClick={async () => {
                    if (initialRef?.current !== null) {
                      await createLeagueMutation({
                        name: initialRef.current?.value,
                      })
                      router.push("/matches")
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Center>
    )
  }

  return (
    <Container>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <DashboardItem href="/leagues">
          <FiUsers color="white" size="40px" />
          Leagues
        </DashboardItem>
        <DashboardItem href="/matches">
          <FiTv color="white" size="40px" />
          Matches
        </DashboardItem>
      </Grid>
    </Container>
  )
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
      {/* <Container> */}
      <header></header>
      <main>
        <Suspense fallback="Loading...">
          <Dashboard />
        </Suspense>
      </main>
      {/* </Container> */}

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
