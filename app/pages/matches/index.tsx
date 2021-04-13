import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import getMatches from "app/matches/queries/getMatches"

const ITEMS_PER_PAGE = 100

export const MatchesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ matches, hasMore }] = usePaginatedQuery(getMatches, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {matches.map((match) => (
          <li key={match.id}>
            <Link href={`/matches/${match.id}`}>
              <a>{match.name}</a>
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

const MatchesPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Matches</title>
      </Head>

      <div>
        <p>
          <Link href="/matches/new">
            <a>Create Match</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <MatchesList />
        </Suspense>
      </div>
    </>
  )
}

MatchesPage.authenticate = true
MatchesPage.getLayout = (page) => <Layout>{page}</Layout>

export default MatchesPage
