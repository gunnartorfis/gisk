import { Button } from "@chakra-ui/button"
import { Container, Text } from "@chakra-ui/layout"
import { Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import LeagueInvite from "app/leagues/components/LeagueInvite"
import getLeagues from "app/leagues/queries/getLeagues"
import { BlitzPage, Head, Link, usePaginatedQuery, useRouter } from "blitz"
import React, { Suspense } from "react"

const ITEMS_PER_PAGE = 100

export const LeaguesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ leagues, hasMore }] = usePaginatedQuery(getLeagues, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <Text fontSize="xl">Leagues</Text>
      {leagues.length === 0 ? <Text>No leagues</Text> : null}
      <ul>
        {leagues.map((league) => (
          <li key={league.id}>
            <Link href={`/leagues/${league.id}`}>
              <a>{league.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const LeaguesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Leagues</title>
      </Head>

      <Container paddingTop="16px">
        <Box display="flex" flexDir="row">
          <Button>
            <Link href="/leagues/new">
              <a>Create Leage</a>
            </Link>
          </Button>
        </Box>

        <Suspense fallback={<div>Loading...</div>}>
          <LeaguesList />
        </Suspense>
        <LeagueInvite />
      </Container>
    </>
  )
}

LeaguesPage.authenticate = true
LeaguesPage.getLayout = (page) => <Layout>{page}</Layout>

export default LeaguesPage
