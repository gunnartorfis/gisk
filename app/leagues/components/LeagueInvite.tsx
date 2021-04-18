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
  const router = useRouter()
  const [error, setError] = React.useState<string | undefined>()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  return (
    <>
      <Button variant="text" ref={finalRef} onClick={onOpen}>
        {t("GOT_AN_INVITE")}
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
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
    </>
  )
}

export default LeagueInvite
