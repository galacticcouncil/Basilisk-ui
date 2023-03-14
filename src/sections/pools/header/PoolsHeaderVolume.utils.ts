import { usePoolsDetailsTradeVolumes } from "../pool/details/PoolDetails.utils"
import { useFilteredPools } from "../PoolsPage.utils"

export function useTotalVolumesInPools() {
  const pools = useFilteredPools({
    showMyPositions: false,
  })

  const totalVolume = usePoolsDetailsTradeVolumes(
    pools.data?.map((pool) => pool.address) ?? [],
  )

  const queries = [pools, totalVolume]
  const isLoading = queries.some((query) => query.isLoading)

  return {
    isLoading,
    value: totalVolume.data,
  }
}

export function useTotalVolumesInPoolsUser() {
  const pools = useFilteredPools({
    showMyPositions: true,
  })

  const addresses = pools.data?.map((pool) => pool.address) ?? []

  const totalVolume = usePoolsDetailsTradeVolumes(addresses)

  const queries = [pools, totalVolume]
  const isLoading = queries.some((query) => query.isLoading)

  return {
    isLoading,
    value: totalVolume.data,
  }
}
