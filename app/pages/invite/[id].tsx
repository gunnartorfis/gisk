import { BlitzPage, Head, useRouter, useMutation, invoke } from "blitz"
import React, { useEffect } from "react"
import Layout from "../../core/layouts/Layout"
import addUserToLeagueIfExists from "../../leagues/mutations/addUserToLeagueIfExists"
import { Text } from "@chakra-ui/react"
import { Spinner } from "@chakra-ui/spinner"

const InvitePage: BlitzPage = () => {
  const {
    query: { id },
    push,
  } = useRouter()
  const [error, setError] = React.useState<string | undefined>(undefined)

  useEffect(() => {
    const addUserToLeague = async () => {
      try {
        if (id) {
          const league = await invoke(addUserToLeagueIfExists, {
            inviteCode: id,
          })
          push(`/leagues/${league.id}`)
        }
      } catch {
        setError("League not found")
      }
    }

    addUserToLeague()
  }, [id, push])

  return (
    <>
      <Head>
        <title>Invite</title>
      </Head>

      {error ? (
        <Text color="red.400" textAlign="center">
          {error}
        </Text>
      ) : (
        <Spinner
          size="xl"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        />
      )}
    </>
  )
}

InvitePage.authenticate = true
InvitePage.getLayout = (page) => <Layout>{page}</Layout>

export default InvitePage
