import React, { ReactNode, Suspense } from "react"
import { Head } from "blitz"
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
      {children}
    </>
  )
}

export default Layout
