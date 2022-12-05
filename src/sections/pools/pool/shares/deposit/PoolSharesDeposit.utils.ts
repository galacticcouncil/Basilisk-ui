import { BLOCK_TIME, BN_0 } from "utils/constants"
import { DepositNftType } from "api/deposits"
import { getFloatingPointAmount } from "utils/balance"
import { getPoolTotal } from "sections/pools/header/PoolsHeader.utils"
import { PoolBase } from "@galacticcouncil/sdk"
import { subSeconds } from "date-fns"
import { u32 } from "@polkadot/types"
import { useUsdPeggedAsset } from "api/asset"
import { useGlobalFarms, useYieldFarms } from "api/farms"
import { useMath } from "utils/api"
import { useMemo } from "react"
import { usePoolShareToken } from "api/pools"
import { useSpotPrices } from "api/spotPrice"
import { useTotalIssuance } from "api/totalIssuance"
import BN from "bignumber.js"

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

  const math = useMath()

  const queries = [
    globalFarms,
    yieldFarms,
    shareToken,
    totalIssuance,
    usd,
    math,
    ...spotPrices,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  // use the most recent entry date to show in UI
  const enteredDate = useMemo(() => {
    const lastEnteredAt = depositNft.deposit.yieldFarmEntries.reduce<{
      value: BN
      globalFarmId: u32 | null
    }>(
      (memo, i) => {
        if (memo.value.lt(i.toHex())) {
          return {
            value: i.enteredAt.toBigNumber(),
            globalFarmId: i.globalFarmId,
          }
        }

        return memo
      },
      { value: BN_0, globalFarmId: null },
    )

    const lastGlobalFarm = globalFarms.data?.find((i) =>
      i.id.eq(lastEnteredAt.globalFarmId),
    )

    if (lastGlobalFarm == null) return "-"
    const blocksPerPeriod = lastGlobalFarm.blocksPerPeriod.toBigNumber()
    const blockRange = lastEnteredAt.value
      .times(blocksPerPeriod)
      .plus(blocksPerPeriod.plus(1))

    const date = subSeconds(Date.now(), blockRange.times(BLOCK_TIME).toNumber())
    return date
  }, [depositNft.deposit.yieldFarmEntries, globalFarms.data])

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
    enteredDate,
    isLoading,
  }
}
