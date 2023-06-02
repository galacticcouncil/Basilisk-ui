import {
  useTotalLocked,
  useUsersTotalLocked,
} from "sections/pools/header/PoolsHeader.utils"
import {
  useTotalInAllDeposits,
  useTotalInUsersDeposits,
} from "utils/farms/deposits"
import { PoolsHeaderTotalValue } from "../value/PoolsHeaderValue"
import { isApiLoaded } from "utils/helpers"
import {
  useTotalVolumesInPools,
  useTotalVolumesInPoolsUser,
} from "../volume/PoolsHeaderVolume.utils"
import { useApiPromise } from "utils/api"
import Skeleton from "react-loading-skeleton"

type Props = { myPositions: boolean; variant: "pools" | "farms" | "volume" }

export const PoolsHeaderTotal = ({ myPositions, variant }: Props) => {
  const api = useApiPromise()
  if (!isApiLoaded(api))
    return <Skeleton sx={{ height: [24, 42], width: [180, 200] }} />

  if (myPositions && variant === "pools") return <PoolsHeaderTotalPoolsUser />
  if (!myPositions && variant === "pools") return <PoolsHeaderTotalPools />
  if (myPositions && variant === "farms") return <PoolsHeaderTotalFarmsUser />
  if (!myPositions && variant === "farms") return <PoolsHeaderTotalFarms />
  if (myPositions && variant === "volume") return <PoolsHeaderTotalVolumeUser />
  if (!myPositions && variant === "volume") return <PoolsHeaderTotalVolume />

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
const PoolsHeaderTotalVolume = () => {
  const { value, isLoading } = useTotalVolumesInPools()
  return <PoolsHeaderTotalValue amount={value} isLoading={isLoading} />
}
const PoolsHeaderTotalVolumeUser = () => {
  const { value, isLoading } = useTotalVolumesInPoolsUser()
  return <PoolsHeaderTotalValue amount={value} isLoading={isLoading} />
}
