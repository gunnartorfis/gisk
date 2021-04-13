import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getMatch from "app/matches/queries/getMatch"
import deleteMatch from "app/matches/mutations/deleteMatch"

export const Match = () => {
  const router = useRouter()
  const matchId = useParam("matchId", "number")
  const [deleteMatchMutation] = useMutation(deleteMatch)
  const [match] = useQuery(getMatch, { id: matchId })

  return (
    <>
      <Head>
        <title>Match {match.id}</title>
      </Head>

      <div>
        <h1>Match {match.id}</h1>
        <pre>{JSON.stringify(match, null, 2)}</pre>

        <Link href={`/matches/${match.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteMatchMutation({ id: match.id })
              router.push("/matches")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowMatchPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/matches">
          <a>Matches</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Match />
      </Suspense>
    </div>
  )
}

ShowMatchPage.authenticate = true
ShowMatchPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowMatchPage
