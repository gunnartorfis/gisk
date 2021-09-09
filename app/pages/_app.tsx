import { ChakraProvider } from "@chakra-ui/react"
import LoginPage from "app/auth/pages/login"
import ErrorComponent from "app/core/components/ErrorComponent"
import "app/core/translations/i18n"
import {
  AppProps,
  AuthenticationError,
  AuthorizationError,
  ErrorBoundary,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
  useSession,
} from "blitz"
import Sentry from "integrations/sentry"
import React, { Suspense, useEffect } from "react"
import ReactGA from "react-ga"
import "./_app.css"

ReactGA.initialize("G-1291FQHLBL")

// export const theme = extendTheme({
//   components: {
//     Button: ButtonTheme,
//     Input: InputTheme,
//   },
//   useSystemColorMode: true,
//   colors: Colors,
// })

function SentrySession() {
  const session = useSession()
  useEffect(() => {
    if (session.userId) Sentry.setUser({ id: session.userId.toString() })
  }, [session])

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

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ChakraProvider>
      <Suspense fallback="">
        <SentrySession />
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
}

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginPage />
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
