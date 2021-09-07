import {
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  Link,
  Stack,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react"
import Form, { FormContext, FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useMutation, useRouter } from "blitz"
import { useTranslation } from "react-i18next"
import login from "../mutations/login"
import { Login } from "../validations"

export const LoginPage: BlitzPage = () => {
  const [loginMutation] = useMutation(login)
  const router = useRouter()
  const { t } = useTranslation()
  const oauthLoginError = router.params.authError
  const bgColorMode = useColorModeValue("gray.50", "gray.800")
  const boxColorMode = useColorModeValue("white", "gray.700")
  const theme = useTheme()

  return (
    <Form
      schema={Login}
      initialValues={{ email: "", password: "" }}
      onSubmit={async (values) => {
        try {
          await loginMutation(values)
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        } catch (error) {
          if (error.statusCode === 401) {
            return { [FORM_ERROR]: "Invalid email or password" }
          }
          if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            // This error comes from Prisma
            return { email: "This email is already being used" }
          } else {
            return { [FORM_ERROR]: error.toString() }
          }
        }
      }}
    >
      <FormContext.Consumer>
        {({ submitting, submitError }) => (
          <Flex align={"center"} justify={"center"} bg={bgColorMode}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
              <Box rounded={"lg"} bg={boxColorMode} boxShadow={"lg"} p={8}>
                <Stack spacing={4}>
                  <FormControl id="email">
                    <LabeledTextField
                      name="email"
                      label={t("EMAIL")}
                      placeholder={t("EMAIL")}
                      type="email"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormControl id="password">
                    <LabeledTextField
                      name="password"
                      label={t("PASSWORD")}
                      placeholder={t("PASSWORD")}
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  {submitError ? (
                    <Box role="alert" style={{ color: "red" }}>
                      {submitError}
                    </Box>
                  ) : null}
                  {oauthLoginError ? (
                    <Box role="alert" style={{ color: "red" }}>
                      {oauthLoginError}
                    </Box>
                  ) : null}
                  <Stack spacing={4}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"flex-end"}
                    >
                      <Link color={"blue.400"} href="/forgot-password">
                        {t("FORGOT_PASSWORD")}
                      </Link>
                    </Stack>
                    <Button type="submit" disabled={submitting}>
                      {t("LOGIN_BUTTON")}
                    </Button>

                    <Link href="/signup">
                      <Button variant="ghost" w="100%">
                        {t("LOGIN_FORM_SIGNUP")}
                      </Button>
                    </Link>

                    <div
                      style={{
                        width: "100%",
                        backgroundColor: theme.colors.gray[200],
                        height: 1,
                      }}
                    />

                    <Button
                      onClick={() => {
                        router.push("/api/auth/facebook")
                      }}
                      style={{
                        background: theme.colors.facebook[600],
                      }}
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => {
                        router.push("/api/auth/google")
                      }}
                    >
                      Google
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        )}
      </FormContext.Consumer>
    </Form>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
