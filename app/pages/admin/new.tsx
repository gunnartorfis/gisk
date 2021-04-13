import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createAdmin from "app/admins/mutations/createAdmin"
import { AdminForm, FORM_ERROR } from "app/admins/components/AdminForm"

const NewAdminPage: BlitzPage = () => {
  const router = useRouter()
  const [createAdminMutation] = useMutation(createAdmin)

  return (
    <div>
      <h1>Create New Admin</h1>

      <AdminForm
        submitText="Create Admin"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateAdmin}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const admin = await createAdminMutation(values)
            router.push(`/admins/${admin.id}`)
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href="/admins">
          <a>Admins</a>
        </Link>
      </p>
    </div>
  )
}

NewAdminPage.authenticate = true
NewAdminPage.getLayout = (page) => <Layout title={"Create New Admin"}>{page}</Layout>

export default NewAdminPage
