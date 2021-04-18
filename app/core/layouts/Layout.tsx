import { Box } from "@chakra-ui/layout"
import { useColorModeValue } from "@chakra-ui/react"
import { Head } from "blitz"
import React, { ReactNode, Suspense } from "react"
import Header, { HeaderFallback } from "./Header"

type LayoutProps = {
  title?: string
  children: ReactNode
  isAuth?: boolean
}

const Layout = ({ title, children, isAuth }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "euro2020"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!isAuth ? (
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
      ) : null}
      <Box width="100%" minH="calc(100vh - 60px)" bg={useColorModeValue("gray.50", "gray.800")}>
        {children}
      </Box>
    </>
  )
}

export default Layout
