import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import LoginPage from "app/auth/pages/login"
import ButtonTheme from "app/core/chakraTheme/Button"
import Colors from "app/core/chakraTheme/colors"
import Sentry from "integrations/sentry"
import {
  AppProps,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useRouter,
  useSession,
} from "blitz"
import React, { Suspense, useEffect } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { queryCache } from "react-query"
import "./_app.css"
import "react-datepicker/dist/react-datepicker.css"
import InputTheme from "app/core/chakraTheme/Input"
import "app/core/translations/i18n"
import ErrorComponent from "app/core/components/ErrorComponent"
import ReactGA from "react-ga"

if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID) {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID)
}

export const theme = extendTheme({
  components: {
    Button: ButtonTheme,
    Input: InputTheme,
  },
  useSystemColorMode: true,
  colors: Colors,
})

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
  // const session = useSession()
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ChakraProvider theme={theme}>
      <Suspense fallback="">
        <SentrySession />
      </Suspense>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        resetKeys={[router.asPath]}
        onError={(error, componentStack) => {
          if (process.env.NODE_ENV === "production") {
            Sentry.captureException(error, { contexts: { react: { componentStack } } })
          }
        }}
        onReset={() => {
          // This ensures the Blitz useQuery hooks will automatically refetch
          // data any time you reset the error boundary
          queryCache.resetErrorBoundaries()
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
    </ChakraProvider>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
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
