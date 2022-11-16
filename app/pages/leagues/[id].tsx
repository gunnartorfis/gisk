import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useTheme,
  useToast,
} from "@chakra-ui/react"
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"
import { UserLeague } from "@prisma/client"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import deleteLeagueMutation from "app/leagues/mutations/deleteLeague"
import removeUserFromLeagueIfExists from "app/leagues/mutations/removeUserFromLeagueIfExists"
import getLeague from "app/leagues/queries/getLeague"
import { BlitzPage, Head, Link, useMutation, useQuery, useRouter } from "blitz"
import React, { Suspense } from "react"
import { useTranslation } from "react-i18next"
import { FiStar } from "react-icons/fi"
import { Button, IconButton } from "@chakra-ui/button"
import { useClipboard } from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"

const BASEURL = process.env.NODE_ENV === "production" ? "https://gisk.app" : "http://localhost:3000"

export const League = () => {
  const theme = useTheme()
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [removeUser, { isLoading: isRemovingUser }] = useMutation(removeUserFromLeagueIfExists)
  const [deleteLeague, { isLoading: isDeletingLeague, error: errorDeletingLeague }] =
    useMutation(deleteLeagueMutation)
  const leagueId = router.query.id as string
  const [league, { isLoading, refetch: refetchLeague }] = useQuery(getLeague, {
    id: leagueId,
  })
  const toast = useToast()
  const { t } = useTranslation()
  const { onCopy } = useClipboard(`${BASEURL}/invite/${league.inviteCode}`)

  const [deleteModalIsOpen, setDeleteModalIsOpen] = React.useState(false)
  const onCloseDeleteModal = () => setDeleteModalIsOpen(false)
  const deleteLeagueCancelButtonRef = React.useRef<HTMLButtonElement>(null)

  const [removeUserModalIsOpen, setRemoveUserModalIsOpen] = React.useState(false)
  const onCloseRemoveUserModal = () => setRemoveUserModalIsOpen(false)
  const userLeagueBeingRemoved = React.useRef<UserLeague | null>(null)
  const removeUserModalCancelButtonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (errorDeletingLeague) {
      toast({
        status: "error",
        isClosable: true,
        title: "Oops.",
        description: (errorDeletingLeague as any).message,
        position: "bottom-right",
      })
      onCloseRemoveUserModal()
    }
  }, [errorDeletingLeague, toast])

  if (isLoading) {
    return <Text>Loading</Text>
  }

  const userIsLeagueAdmin =
    currentUser?.userLeague.find((l) => l.leagueId === leagueId)?.role === "ADMIN"

  return (
    <>
      <Flex direction="column" overflowX="scroll">
        <Box>
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Text fontSize="4xl" fontWeight="extrabold">
                {league.name}
              </Text>
              <Text fontSize="xl">
                {t("INVITE_CODE_TO_LEAGUE")}: <strong>{league.inviteCode}</strong>{" "}
                <CopyIcon
                  _hover={{ cursor: "pointer" }}
                  onClick={onCopy}
                  title={t("INVITE_LINK_TO_LEAGUE")}
                />
              </Text>
            </Box>
            {userIsLeagueAdmin ? (
              <IconButton
                variant="danger"
                onClick={() => setDeleteModalIsOpen(true)}
                aria-label="Search database"
                icon={<DeleteIcon />}
              />
            ) : null}
          </Flex>
        </Box>
        <Table variant="simple" mt="32px">
          <Thead>
            <Tr>
              <Th>{t("NAME")}</Th>
              <Th>{t("SHOW_PREDICTED_MATCHES")}</Th>
              <Th>{t("QUESTIONS")}</Th>
              <Th isNumeric>{t("SCORE")}</Th>

              {userIsLeagueAdmin ? <Th></Th> : null}
            </Tr>
          </Thead>
          <Tbody>
            {league.UserLeague.map((ul, i) => (
              <Tr key={ul.userId}>
                <Td>
                  <Flex direction="row" alignItems="center">
                    {ul.user.name}
                    {ul.role === "ADMIN" ? (
                      <Box ml="8px">
                        <FiStar />
                      </Box>
                    ) : null}
                  </Flex>
                </Td>
                <Td>
                  <Link
                    href={currentUser?.id === ul.user.id ? "/matches" : `/matches/${ul.user.id}`}
                  >
                    <Text
                      color={theme.colors.primary}
                      _hover={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      {t("PREDICTION")}
                    </Text>
                  </Link>
                </Td>
                <Td>
                  <Link
                    href={
                      currentUser?.id === ul.user.id ? "/questions" : `/questions/${ul.user.id}`
                    }
                  >
                    <Text
                      color={theme.colors.primary}
                      _hover={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      {t("QUESTIONS")}
                    </Text>
                  </Link>
                </Td>
                <Td isNumeric>{ul.score}</Td>
                {userIsLeagueAdmin ? (
                  <Td
                    color="red.400"
                    cursor="pointer"
                    onClick={() => {
                      userLeagueBeingRemoved.current = ul
                      setRemoveUserModalIsOpen(true)
                    }}
                  >
                    <IconButton variant="danger" aria-label="Remove user" icon={<DeleteIcon />} />
                  </Td>
                ) : null}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
      <AlertDialog
        isOpen={deleteModalIsOpen}
        leastDestructiveRef={deleteLeagueCancelButtonRef}
        onClose={onCloseDeleteModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("DELETE_LEAGUE_MODAL_TITLE")}
            </AlertDialogHeader>

            <AlertDialogBody>{t("DELETE_LEAGUE_MODAL_DESCRIPTION")}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteLeagueCancelButtonRef} onClick={onCloseDeleteModal}>
                {t("CANCEL")}
              </Button>
              <Button
                variant="danger"
                isLoading={isDeletingLeague}
                onClick={async () => {
                  await deleteLeague({
                    leagueId: league.id,
                  })
                  setDeleteModalIsOpen(false)
                  router.push("/")
                }}
                colorScheme="red"
                ml={3}
              >
                {t("DELETE")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <AlertDialog
        isOpen={removeUserModalIsOpen}
        leastDestructiveRef={removeUserModalCancelButtonRef}
        onClose={onCloseRemoveUserModal}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("REMOVE_USER_FROM_LEAGUE_MODAL_TITLE")}
            </AlertDialogHeader>

            <AlertDialogBody>{t("REMOVE_USER_FROM_LEAGUE_MODAL_DESCRIPTION")}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={deleteLeagueCancelButtonRef} onClick={onCloseRemoveUserModal}>
                {t("CANCEL")}
              </Button>
              <Button
                variant="danger"
                isLoading={isDeletingLeague}
                onClick={async () => {
                  const ul = userLeagueBeingRemoved.current
                  if (!isRemovingUser && ul) {
                    if (ul.role === "ADMIN") {
                      return toast({
                        status: "error",
                        isClosable: true,
                        title: "Oops.",
                        description: "It is not possible to remove an admin.",
                        position: "bottom-right",
                      })
                    }

                    await removeUser({
                      leagueId: ul.leagueId,
                      userId: ul.userId,
                    })

                    onCloseRemoveUserModal()
                    refetchLeague()
                  }
                }}
                colorScheme="red"
                ml={3}
              >
                {t("DELETE")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const LeaguesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>League</title>
      </Head>

      <Container paddingTop="16px" maxW="75ch">
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
