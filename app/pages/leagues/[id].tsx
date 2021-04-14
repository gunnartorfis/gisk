import { Container } from "@chakra-ui/layout"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head } from "blitz"
import React, { Suspense } from "react"

export const League = () => {
  return <div>My league</div>
}

const LeaguesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>League</title>
      </Head>

      <Container paddingTop="16px">
        <Suspense fallback={<div>Loading...</div>}>
          <League />
        </Suspense>
      </Container>
    </>
  )
}

LeaguesPage.authenticate = true
LeaguesPage.getLayout = (page) => <Layout>{page}</Layout>

export default LeaguesPage
