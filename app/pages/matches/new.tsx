import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createMatch from "app/matches/mutations/createMatch"
import { MatchForm, FORM_ERROR } from "app/matches/components/MatchForm"

const NewMatchPage: BlitzPage = () => {
  const router = useRouter()
  const [createMatchMutation] = useMutation(createMatch)

  return (
    <div>
      <h1>Create New Match</h1>

      <MatchForm
        submitText="Create Match"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateMatch}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const match = await createMatchMutation(values)
            router.push(`/matches/${match.id}`)
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href="/matches">
          <a>Matches</a>
        </Link>
      </p>
    </div>
  )
}

NewMatchPage.authenticate = true
NewMatchPage.getLayout = (page) => <Layout title={"Create New Match"}>{page}</Layout>

export default NewMatchPage
