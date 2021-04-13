import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGroup from "app/groups/queries/getGroup"
import updateGroup from "app/groups/mutations/updateGroup"
import { GroupForm, FORM_ERROR } from "app/groups/components/GroupForm"

export const EditGroup = () => {
  const router = useRouter()
  const groupId = useParam("groupId", "number")
  const [group, { setQueryData }] = useQuery(getGroup, { id: groupId })
  const [updateGroupMutation] = useMutation(updateGroup)

  return (
    <>
      <Head>
        <title>Edit Group {group.id}</title>
      </Head>

      <div>
        <h1>Edit Group {group.id}</h1>
        <pre>{JSON.stringify(group)}</pre>

        <GroupForm
          submitText="Update Group"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateGroup}
          initialValues={group}
          onSubmit={async (values) => {
            try {
              const updated = await updateGroupMutation({
                id: group.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(`/groups/${updated.id}`)
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

const EditGroupPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditGroup />
      </Suspense>

      <p>
        <Link href="/groups">
          <a>Groups</a>
        </Link>
      </p>
    </div>
  )
}

EditGroupPage.authenticate = true
EditGroupPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditGroupPage
