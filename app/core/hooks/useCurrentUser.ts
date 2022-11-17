import { useQuery } from "@blitzjs/rpc"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const [user] = useQuery(getCurrentUser, null, {
    enabled,
  })
  return user
}
