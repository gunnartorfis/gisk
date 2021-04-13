import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGroup from "app/groups/queries/getGroup"
import deleteGroup from "app/groups/mutations/deleteGroup"

export const Group = () => {
  const router = useRouter()
  const groupId = useParam("groupId", "number")
  const [deleteGroupMutation] = useMutation(deleteGroup)
  const [group] = useQuery(getGroup, { id: groupId })

  return (
    <>
      <Head>
        <title>Group {group.id}</title>
      </Head>

      <div>
        <h1>Group {group.id}</h1>
        <pre>{JSON.stringify(group, null, 2)}</pre>

        <Link href={`/groups/${group.id}/edit`}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteGroupMutation({ id: group.id })
              router.push("/groups")
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

const ShowGroupPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/groups">
          <a>Groups</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Group />
      </Suspense>
    </div>
  )
}

ShowGroupPage.authenticate = true
ShowGroupPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowGroupPage
