import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getMatch from "app/matches/queries/getMatch"
import updateMatch from "app/matches/mutations/updateMatch"
import { MatchForm, FORM_ERROR } from "app/matches/components/MatchForm"

export const EditMatch = () => {
  const router = useRouter()
  const matchId = useParam("matchId", "number")
  const [match, { setQueryData }] = useQuery(getMatch, { id: matchId })
  const [updateMatchMutation] = useMutation(updateMatch)

  return (
    <>
      <Head>
        <title>Edit Match {match.id}</title>
      </Head>

      <div>
        <h1>Edit Match {match.id}</h1>
        <pre>{JSON.stringify(match)}</pre>

        <MatchForm
          submitText="Update Match"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateMatch}
          initialValues={match}
          onSubmit={async (values) => {
            try {
              const updated = await updateMatchMutation({
                id: match.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(`/matches/${updated.id}`)
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditMatchPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditMatch />
      </Suspense>

      <p>
        <Link href="/matches">
          <a>Matches</a>
        </Link>
      </p>
    </div>
  )
}

EditMatchPage.authenticate = true
EditMatchPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditMatchPage
