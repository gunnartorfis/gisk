import dayjs from "dayjs"
import React from "react"

const useUserLocale = (user: any) => {
  React.useEffect(() => {
    if (user) {
      dayjs.locale(user.language ?? "en")
    }
  }, [user])
}

export default useUserLocale
