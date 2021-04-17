import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import LoginPage from "app/auth/pages/login"
import ButtonTheme from "app/core/chakraTheme/Button"
import Colors from "app/core/chakraTheme/colors"
import {
  AppProps,
  AuthenticationError,
  AuthorizationError,
  ErrorComponent,
  ErrorFallbackProps,
  useRouter,
} from "blitz"
import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { queryCache } from "react-query"
import "./_app.css"
import "react-datepicker/dist/react-datepicker.css"
import InputTheme from "app/core/chakraTheme/Input"

export const theme = extendTheme({
  components: {
    Button: ButtonTheme,
    Input: InputTheme,
  },
  useSystemColorMode: true,
  colors: Colors,
})

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ChakraProvider theme={theme}>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        resetKeys={[router.asPath]}
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
