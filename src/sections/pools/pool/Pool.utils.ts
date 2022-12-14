import { useMemo } from "react"
import { OmnipoolPool } from "sections/pools/PoolsPage.utils"
import { useAssetsHydraPositionsData } from "sections/wallet/assets/hydraPositions/data/WalletAssetsHydraPositionsData.utils"
import { useOmnipoolAssets } from "api/omnipool"
import { useQueries } from "@tanstack/react-query"
import { QUERY_KEYS } from "utils/queryKeys"
import { getTradeVolume } from "api/volume"

export const useOmnipoolPositions = (pool: OmnipoolPool) => {
  const positions = useAssetsHydraPositionsData()

  const data = useMemo(
    () =>
      positions.data.filter((position) => position.id === pool.id.toString()),
    [pool.id, positions.data],
  )

  return { data, isLoading: positions.isLoading }
}

export const use24hVolumes = () => {
  const omnipoolAssets = useOmnipoolAssets()
  const ids = omnipoolAssets.data?.map((a) => a.id.toString()) ?? []
  const volumes = useQueries({
    queries: ids.map((assetId) => ({
      queryKey: QUERY_KEYS.tradeVolume(assetId),
      queryFn: getTradeVolume(assetId),
      enabled: !!assetId,
    })),
  })

  const queries = [omnipoolAssets, ...volumes]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => volumes.map((q) => q.data), [volumes])

  return { data, isLoading }
}
