import { ErrorComponent as DefaultErrorComponent } from "@blitzjs/next"
import Sentry from "integrations/sentry"

type ExtraProps = {
  hasGetInitialPropsRun?: boolean
  err?: any
}

class ErrorComponent extends DefaultErrorComponent<ExtraProps> {
  render() {
    const { statusCode, hasGetInitialPropsRun, err } = this.props
    if (!hasGetInitialPropsRun && err) {
      // getInitialProps is not called in case of
      // https://github.com/vercel/next.js/issues/8592. As a workaround, we pass
      // err via _app.js so it can be captured
      Sentry.captureException(err)
    }

    return <DefaultErrorComponent statusCode={statusCode} />
  }
}

ErrorComponent.getInitialProps = async (ctx) => {
  const errorInitialProps = await DefaultErrorComponent.getInitialProps(ctx)

  // Workaround for https://github.com/vercel/next.js/issues/8592, mark when
  // getInitialProps has run
  ;(errorInitialProps as any).hasGetInitialPropsRun = true

  // Running on the server, the response object (`res`) is available.
  // Next.js will pass an err on the server if a page's data fetching methods
  // threw or returned a Promise that rejected
  //
  // Running on the client (browser), Next.js will provide an err if:
  //  - a page's `getInitialProps` threw or returned a Promise that rejected
  //  - an exception was thrown somewhere in the React lifecycle (render,
  //    componentDidMount, etc) that was caught by Next.js's React Error
  //    Boundary. Read more about what types of exceptions are caught by Error
  //    Boundaries: https://reactjs.org/docs/error-boundaries.html

  if (ctx.res?.statusCode === 404) {
    // Opinionated: do not record an exception in Sentry for 404
    return { statusCode: 404 }
  }
  if (ctx.err) {
    Sentry.captureException(ctx.err)
    await Sentry.flush(2000)
    return errorInitialProps
  }

  // If this point is reached, getInitialProps was called without any
  // information about what the error might be. This is unexpected and may
  // indicate a bug introduced in Next.js, so record it in Sentry
  Sentry.captureException(
    new Error(`_error.js getInitialProps missing data at path: ${ctx.asPath}`)
  )
  await Sentry.flush(2000)

  return errorInitialProps
}

export default ErrorComponent
