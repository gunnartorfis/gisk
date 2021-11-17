import getCurrentUser from "app/users/queries/getCurrentUser"
import { useQuery } from "blitz"

export const useCurrentUser = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const [user] = useQuery(getCurrentUser, null, {
    enabled,
  })
  return user
}
