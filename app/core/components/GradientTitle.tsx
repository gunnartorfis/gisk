import { Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Colors from "../chakraTheme/colors"

const GradientTitle: React.FunctionComponent<
  React.PropsWithChildren<{
    smaller?: boolean
  }>
> = ({ smaller, children }) => {
  return (
    <Text
      textAlign={useBreakpointValue({ base: "center", md: "left" })}
      fontFamily={"heading"}
      fontWeight="extrabold"
      bgGradient={`linear(to-l, ${Colors.secondary},${Colors.primary})"`}
      bgClip="text"
      fontSize={smaller ? "xl" : ["60px", "100px"]}
      color={useColorModeValue("gray.800", "white")}
      style={{ textAlign: "center" }}
    >
      {children}
    </Text>
  )
}

export default GradientTitle
