import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import createGroup from "app/groups/mutations/createGroup"
import { GroupForm, FORM_ERROR } from "app/groups/components/GroupForm"
import { Container, Text } from "@chakra-ui/layout"

const NewGroupPage: BlitzPage = () => {
  const router = useRouter()
  const [createGroupMutation] = useMutation(createGroup)

  return (
    <Container centerContent>
      <Text fontSize="3xl" textAlign="center" as="b">
        New group
      </Text>

      <GroupForm
        submitText="Create Group"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateGroup}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const group = await createGroupMutation(values)
            router.push(`/groups/${group.id}`)
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </Container>
  )
}

NewGroupPage.authenticate = true
NewGroupPage.getLayout = (page) => <Layout title={"Create New Group"}>{page}</Layout>

export default NewGroupPage
