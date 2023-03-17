import {
  useTotalVolumesInPools,
  useTotalVolumesInPoolsUser,
} from "./PoolsHeaderVolume.utils"
import Skeleton from "react-loading-skeleton"
import { Heading } from "../../../components/Typography/Heading/Heading"
import { useTranslation } from "react-i18next"
import BN from "bignumber.js"

type Props = { myPositions: boolean; variant: "pools" | "farms" }

const PoolsHeaderTotalVolumeData = ({
  value,
  isLoading,
}: {
  value: BN | undefined
  isLoading: boolean
}) => {
  const { t } = useTranslation()

  return (
    <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
      {!isLoading ? (
        t("value.usd", {
          amount: value,
        })
      ) : (
        <Skeleton width={256} />
      )}
    </Heading>
  )
}

const PoolsHeaderTotalVolume = () => {
  const { value, isLoading } = useTotalVolumesInPools()
  return <PoolsHeaderTotalVolumeData value={value} isLoading={isLoading} />
}

const PoolsHeaderTotalVolumeUser = () => {
  const { value, isLoading } = useTotalVolumesInPoolsUser()
  return <PoolsHeaderTotalVolumeData value={value} isLoading={isLoading} />
}

export const PoolsHeaderVolume = ({ myPositions, variant }: Props) => {
  if (myPositions && variant === "pools") {
    return <PoolsHeaderTotalVolumeUser />
  }

  if (!myPositions && variant === "pools") {
    return <PoolsHeaderTotalVolume />
  }

  return null
}
