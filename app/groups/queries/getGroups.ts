import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetGroupsInput
  extends Pick<Prisma.GroupFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetGroupsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: groups, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.group.count({ where }),
      query: (paginateArgs) => db.group.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      groups,
      nextPage,
      hasMore,
      count,
    }
  }
)
