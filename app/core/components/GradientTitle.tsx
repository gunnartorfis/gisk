import { Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react"
import Colors from "../chakraTheme/colors"

const GradientTitle: React.FunctionComponent<{
  smaller?: boolean
}> = ({ smaller, children }) => {
  return (
    <Text
      textAlign={useBreakpointValue({ base: "center", md: "left" })}
      fontFamily={"heading"}
      fontWeight="extrabold"
      bgGradient={`linear(to-l, ${Colors.secondary},${Colors.primary})"`}
      // bgGradient="linear(to-l, #7928CA,#FF0080)"
      bgClip="text"
      fontSize={smaller ? "xl" : ["60px", "100px"]}
      color={useColorModeValue("gray.800", "white")}
      style={{"textAlign": "center"}}
    >
      {children}
    </Text>
  )
}

export default GradientTitle
