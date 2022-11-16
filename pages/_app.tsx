import { withBlitz } from "app/blitz-client"
import { useSession } from "@blitzjs/auth"
import { useQueryErrorResetBoundary } from "@blitzjs/rpc"
import { AppProps, ErrorBoundary, ErrorFallbackProps } from "@blitzjs/next"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "app/core/chakraTheme/theme"
import ErrorComponent from "app/core/components/ErrorComponent"
import Welcome from "app/core/components/Welcome"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import "app/core/translations/i18n"
import i18n from "app/core/translations/i18n"
import Sentry from "integrations/sentry"
import React, { Suspense, useEffect } from "react"
import ReactGA from "react-ga"
import "./_app.css"
import { AuthenticationError, AuthorizationError } from "blitz"

ReactGA.initialize("G-1291FQHLBL")

function UserSession() {
  const session = useSession()
  const currentUser = useCurrentUser()

  useEffect(() => {
    if (session.userId) Sentry.setUser({ id: session.userId.toString() })
  }, [session])

  React.useEffect(() => {
    i18n.changeLanguage(currentUser?.language ?? "en")
  }, [currentUser])

  return null
}

export function reportWebVitals({ id, name, label, value }) {
  ReactGA.send(
    {
      eventCategory: label === "web-vital" ? "Web Vitals" : "Blitz custom metric",
      eventAction: name,
      eventValue: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
      eventLabel: id, // id unique to current page load
      nonInteraction: true, // avoids affecting bounce rate.
    },
    ["event"]
  )
}

export default withBlitz(function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ChakraProvider theme={theme}>
      <Suspense fallback="">
        <UserSession />
      </Suspense>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        onError={(error, componentStack) => {
          if (process.env.NODE_ENV === "production") {
            Sentry.captureException(error, { contexts: { react: { componentStack } } })
          }
        }}
        onReset={useQueryErrorResetBoundary().reset}
      >
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
    </ChakraProvider>
  )
})

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <Welcome />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
