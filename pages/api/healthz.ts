import { api } from "app/blitz-server"
import { NextApiResponse } from "next"

const handler = (_, res: NextApiResponse) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify({ status: "Healthy" }))
}
export default api(handler)
