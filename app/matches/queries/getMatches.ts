import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetMatchesInput
  extends Pick<Prisma.MatchFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetMatchesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: matches, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.match.count({ where }),
      query: (paginateArgs) => db.match.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      matches,
      nextPage,
      hasMore,
      count,
    }
  }
)
