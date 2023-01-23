import { useMemo } from "react"
import { getPoolTotal } from "sections/pools/header/PoolsHeader.utils"
import { BN_0, BN_1, BN_10 } from "utils/constants"
import { useGlobalFarm, useYieldFarm, useYieldFarms } from "api/farms"
import { usePools, usePoolShareToken, usePoolShareTokens } from "api/pools"
import { useTotalIssuance, useTotalIssuances } from "api/totalIssuance"
import { useAsset, useUsdPeggedAsset } from "api/asset"
import { useSpotPrices } from "api/spotPrice"
import { useAllUserDeposits } from "utils/farms/deposits"
import { PalletLiquidityMiningYieldFarmEntry } from "@polkadot/types/lookup"
import { PoolBase } from "@galacticcouncil/sdk"
import { useBestNumber } from "api/chain"
import * as liquidityMining from "@galacticcouncil/math-liquidity-mining"
import BN from "bignumber.js"

export const useTotalInPositions = () => {
  const deposits = useAllUserDeposits()

  const pools = usePools()
  const yieldFarms = useYieldFarms(
    deposits.data?.positions?.map(
      ({ position: { yieldFarmId, globalFarmId }, poolId }) => ({
        yieldFarmId: yieldFarmId,
        globalFarmId: globalFarmId,
        poolId,
      }),
    ) ?? [],
  )
  const shareTokens = usePoolShareTokens(
    deposits.data?.deposits?.map(({ deposit }) => deposit.ammPoolId) ?? [],
  )
  const totalIssuances = useTotalIssuances(
    shareTokens.map((st) => st.data?.token),
  )
  const usd = useUsdPeggedAsset()
  const spotPrices = useSpotPrices(
    pools.data?.map((pool) => pool.tokens.map((token) => token.id)).flat(2) ??
      [],
    usd.data?.id,
  )

  const queries = [
    deposits,
    pools,
    yieldFarms,
    ...shareTokens,
    ...totalIssuances,
    usd,
    ...spotPrices,
  ]
  const isLoading = queries.some((q) => q.isInitialLoading)

  const data = useMemo(() => {
    if (
      !deposits.data.deposits ||
      !deposits.data.positions ||
      !pools.data ||
      !yieldFarms.data ||
      !usd.data ||
      shareTokens.some((q) => !q.data) ||
      totalIssuances.some((q) => !q.data) ||
      spotPrices.some((q) => !q.data)
    )
      return undefined

    const values = deposits.data.positions
      .map(({ position, poolId }) => {
        const yieldFarm = yieldFarms.data?.find((yf) =>
          yf.id.eq(position.yieldFarmId),
        )
        const pool = pools.data?.find((p) => poolId.eq(p.address))
        const shareToken = shareTokens.find(
          (st) => st.data?.poolId.toString() === pool?.address,
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
    deposits.data.deposits,
    deposits.data.positions,
    pools.data,
    usd.data,
    yieldFarms,
    shareTokens,
    totalIssuances,
    spotPrices,
  ])

  return { data, isLoading }
}

export const usePoolPosition = ({
  position,
  pool,
}: {
  position: PalletLiquidityMiningYieldFarmEntry
  pool: PoolBase
}) => {
  const globalFarm = useGlobalFarm(position.globalFarmId)
  const yieldFarm = useYieldFarm({
    yieldFarmId: position.yieldFarmId,
    globalFarmId: position.globalFarmId,
    poolId: pool.address,
  })

  const shareToken = usePoolShareToken(pool.address)
  const totalIssuance = useTotalIssuance(shareToken.data?.token)
  const usd = useUsdPeggedAsset()
  const spotPrices = useSpotPrices(
    pool.tokens.map((token) => token.id),
    usd.data?.id,
  )

  const rewardAsset = useAsset(globalFarm.data?.rewardCurrency)
  const bestNumber = useBestNumber()

  const queries = [
    globalFarm,
    yieldFarm,
    shareToken,
    totalIssuance,
    usd,
    rewardAsset,
    bestNumber,
    ...spotPrices,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  const mined = useMemo(() => {
    if (
      bestNumber.data == null ||
      globalFarm.data == null ||
      yieldFarm.data == null
    )
      return null

    const currentPeriod = bestNumber.data.relaychainBlockNumber
      .toBigNumber()
      .dividedToIntegerBy(globalFarm.data.blocksPerPeriod.toBigNumber())

    const periods = currentPeriod.minus(position.enteredAt.toBigNumber())

    let loyaltyMultiplier = BN_1.toString()

    if (!yieldFarm.data.loyaltyCurve.isNone) {
      const { initialRewardPercentage, scaleCoef } =
        yieldFarm.data.loyaltyCurve.unwrap()

      loyaltyMultiplier = liquidityMining.calculate_loyalty_multiplier(
        periods.toFixed(),
        initialRewardPercentage.toBigNumber().toFixed(),
        scaleCoef.toBigNumber().toFixed(),
      )
    }

    return new BN(
      liquidityMining.calculate_user_reward(
        position.accumulatedRpvs.toBigNumber().toFixed(),
        position.valuedShares.toBigNumber().toFixed(),
        position.accumulatedClaimedRewards.toBigNumber().toFixed(),
        yieldFarm.data.accumulatedRpvs.toBigNumber().toFixed(),
        loyaltyMultiplier,
      ),
    )
  }, [
    bestNumber.data,
    globalFarm.data,
    position.accumulatedClaimedRewards,
    position.accumulatedRpvs,
    position.enteredAt,
    position.valuedShares,
    yieldFarm.data,
  ])

  const data = useMemo(() => {
    if (!yieldFarm.data || !totalIssuance.data) return undefined

    const farmTotalValued = yieldFarm.data.totalValuedShares.toBigNumber()
    const farmTotal = yieldFarm.data.totalShares.toBigNumber()
    const positionTotalValued = position.valuedShares.toBigNumber()
    const positionRatio = positionTotalValued.div(farmTotalValued)

    const farmRatio = farmTotal.div(totalIssuance.data.total)
    const poolTotal = getPoolTotal(
      pool.tokens,
      spotPrices.map((sp) => sp.data),
    )

    const farmValue = poolTotal.times(farmRatio)
    const usdValue = farmValue.times(positionRatio)

    const [assetA, assetB] = pool.tokens.map((token) => {
      const balance = new BN(token.balance).div(
        BN_10.pow(new BN(token.decimals)),
      )
      const farmAmount = balance.times(farmRatio)
      const positionAmount = farmAmount.times(positionRatio)

      return { symbol: token.symbol, amount: positionAmount }
    })

    return { usdValue, assetA, assetB }
  }, [yieldFarm.data, totalIssuance.data, spotPrices, position, pool])

  return {
    ...data,
    mined,
    rewardAsset: rewardAsset.data,
    isLoading,
  }
}
