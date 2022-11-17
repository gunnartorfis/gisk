import React, { useEffect } from "react"
import Layout from "../../app/core/layouts/Layout"
import addUserToLeagueIfExists from "../../app/leagues/mutations/addUserToLeagueIfExists"
import { Text } from "@chakra-ui/react"
import { Spinner } from "@chakra-ui/spinner"
import { BlitzPage } from "@blitzjs/next"
import { useRouter } from "next/router"
import { invoke } from "@blitzjs/rpc"
import Head from "next/head"

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
          await push(`/leagues/${league.id}`)
        }
      } catch {
        setError("League not found")
      }
    }

    addUserToLeague().catch((_) => setError("League not found"))
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
