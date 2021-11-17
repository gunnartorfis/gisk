import { DeleteIcon } from "@chakra-ui/icons"
import { Box, Container, Flex, Text } from "@chakra-ui/layout"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react"
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

export const League = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const [removeUser, { isLoading: isRemovingUser }] = useMutation(removeUserFromLeagueIfExists)
  const [deleteLeague, { isLoading: isDeletingLeague, error: errorDeletingLeague }] = useMutation(
    deleteLeagueMutation
  )
  const leagueId = router.params.id
  const [league, { isLoading, refetch: refetchLeague }] = useQuery(getLeague, {
    id: leagueId,
  })
  const toast = useToast()
  const { t } = useTranslation()

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
      <Flex direction="column">
        <Box>
          <Flex direction="row" justifyContent="space-between" alignItems="center">
            <Text fontSize="6xl" fontWeight="extrabold">
              {league.name}
            </Text>
            {userIsLeagueAdmin ? (
              <IconButton
                onClick={() => setDeleteModalIsOpen(true)}
                aria-label="Search database"
                icon={<DeleteIcon />}
              />
            ) : null}
          </Flex>
          <Text fontSize="1xl">
            {t("INVITE_CODE_TO_LEAGUE")}: <strong>{league.inviteCode}</strong>
          </Text>
        </Box>
        <Table variant="simple" mt="32px">
          <Thead>
            <Tr>
              <Th>{t("NAME")}</Th>
              <Th isNumeric>{t("SCORE")}</Th>
              {userIsLeagueAdmin ? <Th></Th> : null}
            </Tr>
          </Thead>
          <Tbody>
            {league.UserLeague.map((ul, i) => (
              <Tr key={ul.userId}>
                <Td _hover={{ textDecoration: "underline" }}>
                  <Flex direction="row" alignItems="center">
                    <Link
                      href={currentUser?.id === ul.user.id ? "/matches" : `/matches/${ul.user.id}`}
                    >
                      {ul.user.name}
                    </Link>
                    {ul.role === "ADMIN" ? (
                      <Box ml="8px">
                        <FiStar />
                      </Box>
                    ) : null}
                  </Flex>
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
                    <IconButton aria-label="Remove user" icon={<DeleteIcon />} />
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
              <Button ref={deleteLeagueCancelButtonRef} onClick={onCloseDeleteModal}>
                {t("CANCEL")}
              </Button>
              <Button
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

      <Container paddingTop="16px">
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
