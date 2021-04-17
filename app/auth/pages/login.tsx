import { Box, Button, Flex, FormControl, Link, Stack, useColorModeValue } from "@chakra-ui/react"
import Form, { FormContext, FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useMutation, useRouter } from "blitz"
import login from "../mutations/login"
import { Login } from "../validations"

export const LoginPage: BlitzPage = () => {
  const [loginMutation] = useMutation(login)
  const router = useRouter()

  const bgColorMode = useColorModeValue("gray.50", "gray.800")
  const boxColorMode = useColorModeValue("white", "gray.700")

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
                    <LabeledTextField name="email" label="Email" placeholder="Email" type="email" />
                  </FormControl>
                  <FormControl id="password">
                    <LabeledTextField
                      name="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                    />
                  </FormControl>
                  {submitError ? (
                    <Box role="alert" style={{ color: "red" }}>
                      {submitError}
                    </Box>
                  ) : null}
                  <Stack spacing={4}>
                    <Stack
                      direction={{ base: "column", sm: "row" }}
                      align={"start"}
                      justify={"flex-end"}
                    >
                      <Link color={"blue.400"} href="/forgot-password">
                        Forgot password?
                      </Link>
                    </Stack>
                    <Button type="submit" disabled={submitting}>
                      Log in
                    </Button>

                    <Link href="/signup">
                      <Button variant="ghost" w="100%">
                        Sign up instead
                      </Button>
                    </Link>
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
