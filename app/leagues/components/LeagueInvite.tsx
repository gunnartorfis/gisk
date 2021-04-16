import { Box, Input, Text } from "@chakra-ui/react"
import { invoke, useRouter } from "blitz"
import React from "react"
import addUserToLeagueIfExists from "../mutations/addUserToLeagueIfExists"

export const LeagueInviteInput = () => {
  const router = useRouter()
  const [error, setError] = React.useState<string | undefined>()
  return (
    <Box>
      <Input
        type="text"
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
              console.log("Error adding user to league: ", error)
              setError("League not found")
            }
          }
        }}
      />
      {error ? <Text color="red.400">{error}</Text> : null}
    </Box>
  )
}

const LeagueInvite = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Text>Got an invite?</Text>
      <LeagueInviteInput />
    </Box>
  )
}

export default LeagueInvite
