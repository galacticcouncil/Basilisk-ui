import {
  useTotalInFarms,
  useTotalsInPools,
} from "sections/pools/header/PoolsHeader.utils"
import { Heading } from "components/Typography/Heading/Heading"
import { useTranslation } from "react-i18next"
import { useUsersPositionsValue } from "utils/farms/positions"
import Skeleton from "react-loading-skeleton"

export const PoolsHeaderTotalPools = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTotalsInPools()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? (
        t("value.usd", {
          amount: data?.poolTotal,
        })
      ) : (
        <Skeleton width={256} />
      )}
    </Heading>
  )
}

export const PoolsHeaderTotalPoolsUser = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTotalsInPools()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? (
        t("value.usd", {
          amount: data?.userTotal,
        })
      ) : (
        <Skeleton width={256} />
      )}
    </Heading>
  )
}

export const PoolsHeaderTotalFarms = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTotalInFarms()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? (
        t("value.usd", {
          amount: data,
        })
      ) : (
        <Skeleton width={256} />
      )}
    </Heading>
  )
}

export const PoolsHeaderTotalFarmsUser = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useUsersPositionsValue()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? (
        t("value.usd", {
          amount: data,
        })
      ) : (
        <Skeleton width={256} />
      )}
    </Heading>
  )
}
