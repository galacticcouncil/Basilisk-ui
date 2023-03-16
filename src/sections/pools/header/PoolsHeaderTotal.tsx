import { Heading } from "components/Typography/Heading/Heading"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"
import {
  useTotalLocked,
  useUsersTotalLocked,
} from "sections/pools/header/PoolsHeader.utils"
import {
  useTotalInAllDeposits,
  useTotalInUsersDeposits,
} from "utils/farms/deposits"

type Props = { myPositions: boolean; variant: "pools" | "farms" }

export const PoolsHeaderTotal = ({ myPositions, variant }: Props) => {
  if (myPositions && variant === "pools") return <PoolsHeaderTotalPoolsUser />
  if (!myPositions && variant === "pools") return <PoolsHeaderTotalPools />
  if (myPositions && variant === "farms") return <PoolsHeaderTotalFarmsUser />
  if (!myPositions && variant === "farms") return <PoolsHeaderTotalFarms />

  return null
}

const PoolsHeaderTotalPools = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTotalLocked()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? t("value.usd", { amount: data }) : <Skeleton width={256} />}
    </Heading>
  )
}

const PoolsHeaderTotalPoolsUser = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useUsersTotalLocked()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? t("value.usd", { amount: data }) : <Skeleton width={256} />}
    </Heading>
  )
}

const PoolsHeaderTotalFarms = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTotalInAllDeposits()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? t("value.usd", { amount: data }) : <Skeleton width={256} />}
    </Heading>
  )
}

const PoolsHeaderTotalFarmsUser = () => {
  const { t } = useTranslation()
  const { data, isLoading } = useTotalInUsersDeposits()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? t("value.usd", { amount: data }) : <Skeleton width={256} />}
    </Heading>
  )
}
