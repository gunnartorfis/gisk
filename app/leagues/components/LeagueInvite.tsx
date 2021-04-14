import { Box, Input, Text } from "@chakra-ui/react"
import { invoke, useRouter } from "blitz"
import React from "react"
import addUserToLeagueIfExists from "../mutations/addUserToLeagueIfExists"

export const LeagueInviteInput = () => {
  const router = useRouter()
  return (
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
            await invoke(addUserToLeagueIfExists, {
              inviteCode: newInviteCode,
            })
            router.push("/")
          } catch (error) {
            console.log("Error adding user to league: ", error)
          }
        }
      }}
    />
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
