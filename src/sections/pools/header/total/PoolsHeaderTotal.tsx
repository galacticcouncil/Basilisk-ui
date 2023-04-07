import BigNumber from "bignumber.js"
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
import { PoolsHeaderTotalValue } from "../value/PoolsHeaderValue"

type Props = { myPositions: boolean; variant: "pools" | "farms" }

export const PoolsHeaderTotal = ({ myPositions, variant }: Props) => {
  if (myPositions && variant === "pools") return <PoolsHeaderTotalPoolsUser />
  if (!myPositions && variant === "pools") return <PoolsHeaderTotalPools />
  if (myPositions && variant === "farms") return <PoolsHeaderTotalFarmsUser />
  if (!myPositions && variant === "farms") return <PoolsHeaderTotalFarms />

  return null
}

const PoolsHeaderTotalPools = () => {
  const { data, isLoading } = useTotalLocked()
  return <PoolsHeaderTotalValue amount={data} isLoading={isLoading} />
}

const PoolsHeaderTotalPoolsUser = () => {
  const { data, isLoading } = useUsersTotalLocked()
  return <PoolsHeaderTotalValue amount={data} isLoading={isLoading} />
}

const PoolsHeaderTotalFarms = () => {
  const { data, isLoading } = useTotalInAllDeposits()
  return <PoolsHeaderTotalValue amount={data} isLoading={isLoading} />
}

const PoolsHeaderTotalFarmsUser = () => {
  const { data, isLoading } = useTotalInUsersDeposits()
  return <PoolsHeaderTotalValue amount={data} isLoading={isLoading} />
}
