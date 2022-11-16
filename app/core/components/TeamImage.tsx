import { Box, useBreakpoint } from "@chakra-ui/react"
import { Team } from "@prisma/client"
import Image from "next/image"
import React from "react"
import styles from "./TeamImage.module.css"

interface TeamImageProps {
  team: Team
  size?: number
}

const TeamImage: React.FC<TeamImageProps> = ({ team, size = 30 }) => {
  const breakpoint = useBreakpoint()
  const shouldDisplaySmall = ["base", "sm"].includes(breakpoint)
  console.log(breakpoint)
  return (
    <Box
      className={styles.teamImageContainer}
      width={["16px", "16px", "30px"]}
      height={["16px", "16px", "30px"]}
    >
      <Image
        src={`/teams/${team.countryCode}.png`}
        alt={team.countryCode}
        style={{
          objectFit: "fill",
          height: shouldDisplaySmall ? 16 : 30,
          borderRadius: "50%",
        }}
        width={shouldDisplaySmall ? 16 : 30}
        height={shouldDisplaySmall ? 16 : 30}
      />
    </Box>
  )
}

export default TeamImage
