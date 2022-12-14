import { useMemo } from "react"
import { OmnipoolPool } from "sections/pools/PoolsPage.utils"
import { useAssetsHydraPositionsData } from "sections/wallet/assets/hydraPositions/data/WalletAssetsHydraPositionsData.utils"
import { usePoolDetailsTradeVolume } from "sections/pools/pool/details/PoolDetails.utils"
import { BN_NAN } from "utils/constants"

export const useOmnipoolData = (pool: OmnipoolPool) => {
  const positions = useAssetsHydraPositionsData()
  const volume = usePoolDetailsTradeVolume(pool.id.toString())

  const isLoading = positions.isLoading || volume.isLoading

  const data = useMemo(
    () => ({
      positions: positions.data.filter(
        (position) => position.id === pool.id.toString(),
      ),
      volume: volume.data ?? BN_NAN,
    }),
    [pool.id, positions.data, volume.data],
  )

  return { data, isLoading }
}
