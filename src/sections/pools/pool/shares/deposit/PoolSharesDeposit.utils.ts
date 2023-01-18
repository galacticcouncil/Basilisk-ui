import { BN_0 } from "utils/constants"
import { DepositNftType } from "api/deposits"
import { getFloatingPointAmount } from "utils/balance"
import { getPoolTotal } from "sections/pools/header/PoolsHeader.utils"
import { PoolBase } from "@galacticcouncil/sdk"
import { useUsdPeggedAsset } from "api/asset"
import { useGlobalFarms, useYieldFarms } from "api/farms"
import { useMemo } from "react"
import { usePoolShareToken } from "api/pools"
import { useSpotPrices } from "api/spotPrice"
import { useTotalIssuance } from "api/totalIssuance"

export const usePoolSharesDeposit = ({
  depositNft,
  pool,
}: {
  depositNft: DepositNftType
  pool: PoolBase
}) => {
  const globalFarms = useGlobalFarms(
    depositNft.deposit.yieldFarmEntries.map((i) => i.globalFarmId),
  )

  const yieldFarms = useYieldFarms(
    depositNft.deposit.yieldFarmEntries.map((i) => ({
      yieldFarmId: i.yieldFarmId,
      globalFarmId: i.globalFarmId,
      poolId: depositNft.deposit.ammPoolId,
    })),
  )

  const usd = useUsdPeggedAsset()

  const shareToken = usePoolShareToken(pool.address)
  const totalIssuance = useTotalIssuance(shareToken.data?.token)

  const spotPrices = useSpotPrices(
    pool.tokens.map((token) => token.id),
    usd.data?.id,
  )

  const queries = [
    globalFarms,
    yieldFarms,
    shareToken,
    totalIssuance,
    usd,
    ...spotPrices,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (!yieldFarms.data || !totalIssuance.data) return undefined

    // sum for each entry
    let usdValue = BN_0
    const [assetA, assetB] = pool.tokens.map((token) => ({
      symbol: token.symbol,
      amount: BN_0,
    }))

    for (const position of depositNft.deposit.yieldFarmEntries) {
      const yieldFarm = yieldFarms.data.find((i) =>
        i.id.eq(position.yieldFarmId),
      )

      if (!yieldFarm) {
        console.error("Failed to find position")
        continue
      }

      const farmTotalValued = yieldFarm.totalValuedShares.toBigNumber()
      const farmTotal = yieldFarm.totalShares.toBigNumber()
      const positionTotalValued = position.valuedShares.toBigNumber()

      const farmRatio = farmTotal.div(totalIssuance.data.total)
      const positionRatio = positionTotalValued.div(farmTotalValued)

      const poolSpotTotal = getPoolTotal(
        pool.tokens,
        spotPrices.map((sp) => sp.data),
      )

      const [assetAValue, assetBValue] = pool.tokens.map((token) => {
        const balance = getFloatingPointAmount(token.balance, token.decimals)
        return balance.times(farmRatio).times(positionRatio)
      })

      usdValue = usdValue.plus(
        poolSpotTotal.times(farmRatio).times(positionRatio),
      )

      assetA.amount = assetA.amount.plus(assetAValue)
      assetB.amount = assetB.amount.plus(assetBValue)
    }

    return { usdValue, assetA, assetB }
  }, [
    depositNft.deposit.yieldFarmEntries,
    pool.tokens,
    spotPrices,
    totalIssuance.data,
    yieldFarms.data,
  ])

  return {
    usdValue: data?.usdValue,
    assetA: data?.assetA,
    assetB: data?.assetB,
    isLoading,
  }
}
