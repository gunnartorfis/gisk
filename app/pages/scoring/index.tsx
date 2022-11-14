import { Center, Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import { Suspense } from "react"
import { useTranslation } from "react-i18next"

export const ScoringPage: BlitzPage = () => {
  const { t } = useTranslation()

  return (
    <Center>
      <Flex direction={"column"} p={4}>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {t("SCORING")}
        </Text>
        <Table>
          <Thead>
            <Tr>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{t("SCORING_RULE_1")}</Td>
              <Td>1 {t("POINT")}</Td>
            </Tr>
            <Tr>
              <Td>{t("SCORING_RULE_2")}</Td>
              <Td>2 {t("POINT")}</Td>
            </Tr>
            <Tr>
              <Td>{t("SCORING_TOTAL")}</Td>
              <Td>2 {t("POINT")}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Flex>
    </Center>
  )
}

ScoringPage.getLayout = (page) => (
  <Layout title="Scoring">
    <Suspense fallback="">{page}</Suspense>
  </Layout>
)

export default ScoringPage
