import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import Form, { FormContext, FORM_ERROR } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, useMutation, useRouter } from "blitz"
import { useTranslation } from "react-i18next"
import signup from "../mutations/signup"
import { Signup } from "../validations"

const SignupPage: BlitzPage = () => {
  const [signupMutation] = useMutation(signup)
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Form
      schema={Signup}
      initialValues={{ email: "", password: "", name: "" }}
      onSubmit={async (values) => {
        try {
          await signupMutation(values)
          router.push("/")
        } catch (error) {
          if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            // This error comes from Prisma
            return { email: "This email is already being used" }
          } else {
            return { [FORM_ERROR]: error.toString() }
          }
        }
      }}
    >
      <Flex
        // minH={"100vh"}
        align={"center"}
        justify={"center"}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>{t("CREATE_ACCOUNT_TITLE")}</Heading>
            <Text fontSize={"lg"} textAlign="center" color={"gray.600"}>
              {t("CREATE_ACCOUNT_SUBTITLE")}{" "}
              <span role="img" aria-label="peace symbol">
                ✌️
              </span>
            </Text>
          </Stack>
          <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <LabeledTextField
                  name="email"
                  label={t("EMAIL")}
                  placeholder={t("EMAIL")}
                  type="email"
                />
              </FormControl>
              <FormControl id="password">
                <LabeledTextField
                  name="password"
                  label={t("PASSWORD")}
                  placeholder={t("PASSWORD")}
                  type="password"
                />
              </FormControl>
              <FormControl id="name">
                <LabeledTextField
                  name="name"
                  label={t("NAME")}
                  placeholder={t("NAME")}
                  type="text"
                />
              </FormControl>
              <Stack spacing={4}>
                <FormContext.Consumer>
                  {({ submitting }) => (
                    <Button type="submit" disabled={submitting}>
                      {t("CREATE_ACCOUNT_TITLE")}
                    </Button>
                  )}
                </FormContext.Consumer>
                <Link href="/login">
                  <Button variant="ghost" w="100%">
                    {t("SIGNUP_FORM_LOGIN")}
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Form>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
