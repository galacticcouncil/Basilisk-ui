import { useMemo } from "react"
import { getPoolTotal } from "sections/pools/header/PoolsHeader.utils"
import { BN_0 } from "utils/constants"
import { useYieldFarms } from "api/farms"
import { usePools, usePoolShareTokens } from "api/pools"
import { useTotalIssuances } from "api/totalIssuance"
import { useAUSD } from "api/asset"
import { useSpotPrices } from "api/spotPrice"
import { useAllUserDeposits } from "utils/farms/deposits"

export const useUsersPositionsValue = () => {
  const deposits = useAllUserDeposits()
  const positions = useMemo(
    () =>
      deposits.data
        ?.map(({ deposit }) =>
          deposit.yieldFarmEntries.map((position) => ({
            position,
            poolId: deposit.ammPoolId,
          })),
        )
        .flat(2) ?? [],
    [deposits.data],
  )

  const pools = usePools()
  const yieldFarms = useYieldFarms(
    positions.map(({ position: { yieldFarmId, globalFarmId }, poolId }) => ({
      yieldFarmId: yieldFarmId,
      globalFarmId: globalFarmId,
      poolId,
    })),
  )
  const shareTokens = usePoolShareTokens(
    deposits.data?.map(({ deposit }) => deposit.ammPoolId) ?? [],
  )
  const totalIssuances = useTotalIssuances(
    shareTokens.map((st) => st.data?.token),
  )
  const aUSD = useAUSD()
  const spotPrices = useSpotPrices(
    pools.data?.map((pool) => pool.tokens.map((token) => token.id)).flat(2) ??
      [],
    aUSD.data?.id,
  )

  const queries = [
    deposits,
    pools,
    yieldFarms,
    ...shareTokens,
    ...totalIssuances,
    aUSD,
    ...spotPrices,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (
      !deposits.data ||
      !pools.data ||
      !yieldFarms.data ||
      !aUSD.data ||
      shareTokens.some((q) => !q.data) ||
      totalIssuances.some((q) => !q.data) ||
      spotPrices.some((q) => !q.data)
    )
      return undefined

    const values = positions
      .map(({ position, poolId }) => {
        const yieldFarm = yieldFarms.data?.find((yf) =>
          yf.id.eq(position.yieldFarmId),
        )
        const pool = pools.data?.find((p) => poolId.eq(p.address))
        const shareToken = shareTokens.find((st) =>
          typeof st.data?.poolId === "string"
            ? st.data.poolId === pool?.address
            : st.data?.poolId.eq(pool?.address),
        )
        const totalIssuance = totalIssuances.find((ti) =>
          ti.data?.token.eq(shareToken?.data?.token),
        )

        if (!yieldFarm || !totalIssuance?.data || !pool) return BN_0

        const farmTotalValued = yieldFarm.totalValuedShares.toBigNumber()
        const farmTotal = yieldFarm?.totalShares.toBigNumber()
        const positionTotalValued = position.valuedShares.toBigNumber()
        const positionRatio = positionTotalValued.div(farmTotalValued)

        const farmRatio = farmTotal.div(totalIssuance.data.total)
        const poolTotal = getPoolTotal(
          pool.tokens,
          spotPrices.map((sp) => sp.data),
        )

        const farmValue = poolTotal.times(farmRatio)
        const positionValue = farmValue.times(positionRatio)

        return positionValue
      })
      .reduce((acc, value) => acc.plus(value), BN_0)

    return values
  }, [
    deposits.data,
    positions,
    pools.data,
    aUSD.data,
    yieldFarms,
    shareTokens,
    totalIssuances,
    spotPrices,
  ])

  return { data, isLoading }
}
