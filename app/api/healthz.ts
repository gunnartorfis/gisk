import { BlitzApiResponse } from "blitz"

const handler = (_, res: BlitzApiResponse) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ status: "Healthy" }))
}
export default handler
