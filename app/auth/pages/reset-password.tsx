import { BlitzPage, useRouterQuery, Link, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FormContext, FORM_ERROR } from "app/core/components/Form"
import { ResetPassword } from "app/auth/validations"
import resetPassword from "app/auth/mutations/resetPassword"
import React from "react"
import { Text } from "@chakra-ui/layout"
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"

const ResetPasswordPage: BlitzPage = () => {
  const query = useRouterQuery()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  const bgColorMode = useColorModeValue("gray.50", "gray.800")
  const boxColorMode = useColorModeValue("white", "gray.700")

  return (
    <Container centerContent>
      <Text fontSize="3xl" textAlign="center" as="b">
        Forgot your password?
      </Text>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href="/">homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          initialValues={{ password: "", passwordConfirmation: "" }}
          onSubmit={async (values) => {
            try {
              await resetPasswordMutation({ ...values, token: query.token as string })
            } catch (error) {
              if (error.name === "ResetPasswordError") {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
                }
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
                      <FormControl id="password">
                        <LabeledTextField
                          name="password"
                          label="Password"
                          placeholder="Password"
                          type="password"
                        />
                      </FormControl>
                      <FormControl id="passwordConfirmation">
                        <LabeledTextField
                          name="passwordConfirmation"
                          label="Confirm New Password"
                          type="password"
                        />
                      </FormControl>
                      {submitError ? (
                        <Box role="alert" style={{ color: "red" }}>
                          {submitError}
                        </Box>
                      ) : null}
                      <Button type="submit" disabled={submitting}>
                        Reset password
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Flex>
            )}
          </FormContext.Consumer>
        </Form>
      )}
    </Container>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = "/"
ResetPasswordPage.getLayout = (page) => (
  <Layout isAuth title="Reset Your Password">
    {page}
  </Layout>
)

export default ResetPasswordPage
