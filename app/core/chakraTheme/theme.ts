import { extendTheme } from "@chakra-ui/react"
import ButtonTheme from "./Button"
import Colors from "./colors"

const theme = extendTheme({
  components: {
    Button: ButtonTheme,
  },
  colors: Colors
})

export default theme
