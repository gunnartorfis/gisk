import { Button } from "@chakra-ui/button"
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
  UseDisclosureProps,
} from "@chakra-ui/react"
import createLeague from "app/leagues/mutations/createLeague"
import { useMutation, useRouter } from "blitz"
import React from "react"
import Emitter from "../eventEmitter/emitter"

export const CREATE_LEAGUE_MODAL_LEAGUE_CREATED = "CREATE_LEAGUE_MODAL_LEAGUE_CREATED"

const CreateLeagueModal: React.FunctionComponent<UseDisclosureProps> = ({
  isOpen,
  onClose,
  ...props
}) => {
  const router = useRouter()
  const initialRef = React.useRef<any>(null)
  const [createLeagueMutation, { isLoading }] = useMutation(createLeague)

  const _onClose = () => {
    onClose?.()
  }

  return (
    <Modal {...props} initialFocusRef={initialRef} isOpen={isOpen ?? false} onClose={_onClose}>
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
                  const league = await createLeagueMutation({
                    name: initialRef.current?.value,
                  })
                  router.push(`/leagues/${league.id}`)
                  _onClose()
                  Emitter.emit(CREATE_LEAGUE_MODAL_LEAGUE_CREATED, league)
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
  )
}

export default CreateLeagueModal
