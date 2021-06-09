import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { invoke, useRouter } from "blitz"
import React from "react"
import { useTranslation } from "react-i18next"
import addUserToLeagueIfExists from "../mutations/addUserToLeagueIfExists"

const LeagueInvite = () => {
  const { t } = useTranslation()

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button variant="text" onClick={onOpen}>
        {t("GOT_AN_INVITE")}
      </Button>
      <LeagueInviteModal onRequestClose={onClose} isOpen={isOpen} />
    </>
  )
}

export const LeagueInviteModal = ({
  isOpen = true,
  onRequestClose,
}: {
  isOpen?: boolean
  onRequestClose?: () => void
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [error, setError] = React.useState<string | undefined>()

  const _onClose = () => {
    onRequestClose?.()
  }

  const initialRef = React.useRef(null)

  if (!isOpen) {
    return null
  }

  return (
    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={_onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("JOIN_LEAGUE_MODAL")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box>
            <FormControl>
              <FormLabel textAlign="center">{t("INVITE_CODE")}</FormLabel>
              <Flex justifyContent="center">
                <Input
                  type="text"
                  ref={initialRef}
                  maxLength={6}
                  textTransform="uppercase"
                  padding="40px 0"
                  w={"180px"}
                  textAlign="center"
                  fontSize="3xl"
                  fontWeight="semibold"
                  placeholder="ABC123"
                  onChange={async (e) => {
                    const newInviteCode = e.target.value
                    if (newInviteCode.length === 6) {
                      try {
                        const league = await invoke(addUserToLeagueIfExists, {
                          inviteCode: newInviteCode,
                        })
                        router.push(`/leagues/${league.id}`)
                        _onClose()
                      } catch (error) {
                        setError("League not found")
                      }
                    }
                  }}
                />
              </Flex>
              {error ? (
                <Text color="red.400" textAlign="center">
                  {error}
                </Text>
              ) : null}
            </FormControl>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default LeagueInvite
