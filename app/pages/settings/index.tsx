import { Box, Button, Flex, FormControl, Stack, useColorModeValue } from "@chakra-ui/react"
import Form, { FormContext } from "app/core/components/Form"
import LabeledTextField from "app/core/components/LabeledTextField"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import updateUser, { UpdateUserForm } from "app/mutations/updateUser"
import { BlitzPage, useMutation, useRouter } from "blitz"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const SettingsPage: BlitzPage = () => {
  const [updateUserMutation] = useMutation(updateUser)
  const router = useRouter()
  const currentUser = useCurrentUser()

  const { t } = useTranslation()

  return (
    <Form
      schema={UpdateUserForm}
      initialValues={{ name: currentUser?.name ?? "" }}
      onSubmit={async (values) => {
        await updateUserMutation(values)
        const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
        router.push(next)
      }}
    >
      <Flex bg={useColorModeValue("", "gray.800")}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8}>
            <Stack spacing={4}>
              <FormControl id="email">
                <LabeledTextField
                  name="email"
                  label={t("EMAIL")}
                  placeholder={t("EMAIL")}
                  type="email"
                  disabled
                  value={currentUser?.email}
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
              <FormContext.Consumer>
                {({ submitting }) => (
                  <Button type="submit" disabled={submitting}>
                    {t("UPDATE")}
                  </Button>
                )}
              </FormContext.Consumer>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Form>
  )
}

SettingsPage.getLayout = (page) => (
  <Layout title="Settings">
    <Suspense fallback="">{page}</Suspense>
  </Layout>
)

export default SettingsPage
