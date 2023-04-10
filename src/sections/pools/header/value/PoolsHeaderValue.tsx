import BigNumber from "bignumber.js"
import { Heading } from "components/Typography/Heading/Heading"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"

export const PoolsHeaderTotalValue = ({
  amount,
  isLoading,
}: {
  amount: BigNumber | undefined
  isLoading: boolean
}) => {
  const { t } = useTranslation()

  return (
    <Heading as="h3" fs={[18, 34]} lh={[24, 42]} fw={900}>
      {!isLoading ? t("value.usd", { amount }) : <Skeleton width={180} />}
    </Heading>
  )
}
