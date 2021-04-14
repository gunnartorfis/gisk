import { resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTeamsInput
  extends Pick<Prisma.TeamFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(resolver.authorize(), async ({ where, orderBy }: GetTeamsInput) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const teams = await db.team.findMany()
  console.log({ teams })
  return teams
})
