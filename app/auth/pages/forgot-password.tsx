import { BlitzPage, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import { ForgotPassword } from "app/auth/validations"
import forgotPassword from "app/auth/mutations/forgotPassword"
import { Container, Text } from "@chakra-ui/layout"
import { useTranslation } from "react-i18next"

const ForgotPasswordPage: BlitzPage = () => {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)
  const { t } = useTranslation()
  return (
    <Container centerContent>
      <Text fontSize="3xl" textAlign="center" as="b">
        {t("FORGOT_PASSWORD")}
      </Text>

      {isSuccess ? (
        <div>
          <h2>{t("REQUEST_SUBMITTED")}</h2>
          <p>{t("RESET_PASSWORD_INSTRUCTIONS")}</p>
        </div>
      ) : (
        <Form
          submitText={t("SEND_RESET_PASSWORD_INSTRUCTIONS")}
          schema={ForgotPassword}
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            try {
              await forgotPasswordMutation(values)
            } catch (error) {
              return {
                [FORM_ERROR]: "Sorry, we had an unexpected error. Please try again.",
              }
            }
          }}
        >
          <LabeledTextField name="email" label={t("EMAIL")} placeholder={t("EMAIL")} />
        </Form>
      )}
    </Container>
  )
}

ForgotPasswordPage.redirectAuthenticatedTo = "/"
ForgotPasswordPage.getLayout = (page) => (
  <Layout isAuth title="Forgot Your Password?">
    {page}
  </Layout>
)

export default ForgotPasswordPage
