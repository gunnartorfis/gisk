import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head } from "blitz"
import { Suspense } from "react"

export const AdminList = () => {
  return (
    <div>
      <p>Admins</p>
    </div>
  )
}

const AdminPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminList />
        </Suspense>
      </div>
    </>
  )
}

AdminPage.authenticate = true
AdminPage.getLayout = (page) => <Layout>{page}</Layout>

export default AdminPage
