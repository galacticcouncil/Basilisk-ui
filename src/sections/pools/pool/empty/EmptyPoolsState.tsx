import { ReactComponent as NoPoolsState } from "assets/icons/NoPoolsState.svg"
import { SEmptyStateContainer } from "./EmptyPoolsState.styled"
import { Text } from "components/Typography/Text/Text"
import { Trans, useTranslation } from "react-i18next"
import { Spacer } from "components/Spacer/Spacer"

export const EmptyPoolsState = () => {
  const { t } = useTranslation()
  return (
    <SEmptyStateContainer>
      <NoPoolsState sx={{ color: "neutralGray500" }} />
      <Spacer size={21} />

      <Text color="neutralGray500" tAlign="center">
        <Trans t={t} i18nKey="pools.emptyState.description" />
      </Text>
    </SEmptyStateContainer>
  )
}
