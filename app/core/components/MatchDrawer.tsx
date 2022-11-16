import { useQuery } from "blitz"
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react"
import createMatch from "app/matches/mutations/createMatch"
import deleteMatch from "app/matches/mutations/deleteMatch"
import updateMatch from "app/matches/mutations/updateMatch"
import getTeams from "app/teams/queries/getTeams"
import { useMutation } from "blitz"
import React, { forwardRef, useRef } from "react"
import DatePicker from "react-datepicker"
import { MatchWithTeams } from "../../pages/adminMatches"
import "react-datepicker/dist/react-datepicker.css"
import { Button } from "@chakra-ui/button"

const MatchDrawer: React.FunctionComponent<{
  isOpen: boolean
  onClose: () => void
  match?: MatchWithTeams
}> = ({ isOpen, onClose, match }) => {
  const firstField = React.useRef(null)
  const [teams, { isLoading }] = useQuery(
    getTeams,
    {},
    {
      enabled: !match,
    }
  )

  const [updateMutation, { isLoading: isLoadingUpdate }] = useMutation(updateMatch)
  const [deleteMutation, { isLoading: isLoadingDelete }] = useMutation(deleteMatch)
  const [createMutation, { isLoading: isLoadingCreate }] = useMutation(createMatch)

  const [kickOff, setKickOff] = React.useState<any>()
  const homeTeamRef = useRef<any>()
  const awayTeamRef = useRef<any>()
  const homeResultRef = useRef<any>()
  const awayResultRef = useRef<any>()
  const scoreMultiplierRef = useRef<any>()

  if (isLoading || !teams) {
    return null
  }

  const close = () => {
    onClose()
  }

  const isSubmitting = isLoadingUpdate || isLoadingDelete || isLoadingCreate

  return (
    <div className="match-drawer">
      <Drawer isOpen={isOpen} placement="right" initialFocusRef={firstField} onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">{match ? "Edit" : "New"} match</DrawerHeader>

            <DrawerBody>
              <Stack spacing="24px">
                <Box>
                  <FormLabel htmlFor="owner">Select Home Team</FormLabel>
                  <Select ref={homeTeamRef} id="homeTeam" defaultValue={match?.homeTeamId ?? "-1"}>
                    <option disabled value="-1">
                      Select a team
                    </option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <FormLabel htmlFor="owner">Select Away Team</FormLabel>
                  <Select ref={awayTeamRef} id="awayTeam" defaultValue={match?.awayTeamId ?? "-1"}>
                    <option disabled value="-1">
                      Select a team
                    </option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <FormLabel htmlFor="owner">Result Home</FormLabel>
                  <Input
                    ref={homeResultRef}
                    type="numeric"
                    defaultValue={match?.resultHome ?? ""}
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor="owner">Result Away</FormLabel>
                  <Input
                    ref={awayResultRef}
                    type="numeric"
                    defaultValue={match?.resultAway ?? ""}
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor="scoreMultiplier">Score multiplier</FormLabel>
                  <Input
                    ref={scoreMultiplierRef}
                    type="numeric"
                    defaultValue={`${match?.scoreMultiplier ?? 1}`}
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor="owner">Kickoff</FormLabel>
                  <DatePicker
                    customInput={<DatePickerInput />}
                    selected={kickOff ?? match?.kickOff ?? new Date()}
                    dateFormat="dd. MMMM yyyy HH:mm"
                    onChange={(date) => setKickOff(date)}
                    showTimeSelect
                    popperClassName="match-drawer"
                    popperPlacement="left-end"
                    popperModifiers={{
                      offset: {
                        enabled: true,
                        offset: "5px, 10px",
                      },
                      preventOverflow: {
                        enabled: true,
                        escapeWithReference: false,
                        boundariesElement: "viewport",
                      },
                    }}
                  />
                </Box>
                {match ? (
                  <Box>
                    <Button
                      bg="red.400"
                      onClick={async () => {
                        // eslint-disable-next-line no-restricted-globals
                        const shouldDelete = confirm("Are you sure you want to delete this match?")
                        if (shouldDelete) {
                          // eslint-disable-next-line no-restricted-globals
                          const confirmed = confirm(
                            "IMPORTANT: Doing this will delete all predictions for all users in the system."
                          )

                          if (confirmed) {
                            await deleteMutation({ id: match.id })
                            close()
                          }
                        }
                      }}
                    >
                      Delete match
                    </Button>
                  </Box>
                ) : null}
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="text" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={async () => {
                  const homeResult = homeResultRef.current.value
                  const awayResult = awayResultRef.current.value
                  const newMatch = {
                    homeTeamId: homeTeamRef.current.value,
                    awayTeamId: awayTeamRef.current.value,
                    resultHome: homeResult ? Number.parseInt(homeResult) : null,
                    resultAway: awayResult ? Number.parseInt(awayResult) : null,
                    kickOff: kickOff ?? match?.kickOff ?? new Date(),
                    scoreMultiplier: Number.parseFloat(scoreMultiplierRef.current?.value) ?? 1,
                  }
                  if (match) {
                    await updateMutation({
                      ...newMatch,
                      id: match.id,
                    })
                  } else {
                    await createMutation(newMatch)
                  }
                  close()
                }}
              >
                {match ? "Update" : "Create"}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </div>
  )
}

const DatePickerInput = forwardRef<any, any>(({ value, onClick }, ref) => (
  <Button variant="text" onClick={onClick} ref={ref}>
    {value}
  </Button>
))

export default MatchDrawer
