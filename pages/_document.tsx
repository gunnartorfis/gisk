import Document, { Html, Head, Main, NextScript } from "next/document"
import { ColorModeScript, theme } from "@chakra-ui/react"

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
          <Main />
          <NextScript />
          <div id="portal" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
