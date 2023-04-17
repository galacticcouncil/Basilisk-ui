import { PoolsHeaderTotalValue } from "../value/PoolsHeaderValue"
import {
  useTotalVolumesInPools,
  useTotalVolumesInPoolsUser,
} from "./PoolsHeaderVolume.utils"

type Props = { myPositions: boolean; variant: "pools" | "farms" }

export const PoolsHeaderVolume = ({ myPositions, variant }: Props) => {
  if (myPositions && variant === "pools") return <PoolsHeaderTotalVolumeUser />
  if (!myPositions && variant === "pools") return <PoolsHeaderTotalVolume />

  return null
}

const PoolsHeaderTotalVolume = () => {
  const { value, isLoading } = useTotalVolumesInPools()
  return <PoolsHeaderTotalValue amount={value} isLoading={isLoading} />
}

const PoolsHeaderTotalVolumeUser = () => {
  const { value, isLoading } = useTotalVolumesInPoolsUser()
  return <PoolsHeaderTotalValue amount={value} isLoading={isLoading} />
}
