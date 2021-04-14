import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetLeaguesInput
  extends Pick<Prisma.LeagueFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetLeaguesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: leagues, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.league.count({ where }),
      query: (paginateArgs) => db.league.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      leagues,
      nextPage,
      hasMore,
      count,
    }
  }
)
