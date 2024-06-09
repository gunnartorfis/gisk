import { AppProps, ErrorBoundary, ErrorComponent, ErrorFallbackProps } from "@blitzjs/next"
import { ChakraProvider } from "@chakra-ui/react"
import { withBlitz } from "app/blitz-client"
import theme from "app/core/chakraTheme/theme"
import Welcome from "app/core/components/Welcome"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import "app/core/translations/i18n"
import i18n from "app/core/translations/i18n"
import { AuthenticationError, AuthorizationError } from "blitz"
import React, { Suspense } from "react"
import ReactGA from "react-ga"
import "./_app.css"

ReactGA.initialize("G-1291FQHLBL")

function UserSession() {
  const currentUser = useCurrentUser()

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
      <ErrorBoundary FallbackComponent={RootErrorFallback}>
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
