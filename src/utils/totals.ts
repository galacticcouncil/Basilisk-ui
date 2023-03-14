import {
  PalletLiquidityMiningYieldFarmData,
  PalletLiquidityMiningYieldFarmEntry,
} from "@polkadot/types/lookup"
import { useUsdPeggedAsset } from "api/asset"
import { DepositNftType } from "api/deposits"
import { useYieldFarms } from "api/farms"
import { usePools, usePoolShareToken, usePoolShareTokens } from "api/pools"
import { useSpotPrices } from "api/spotPrice"
import { useTotalIssuance, useTotalIssuances } from "api/totalIssuance"
import BN from "bignumber.js"
import { useMemo } from "react"
import { getPoolTotal } from "sections/pools/header/PoolsHeader.utils"
import { BN_0 } from "./constants"
import { useAllUserDeposits } from "./farms/deposits"

export const useTotalInDeposit = (depositNft: DepositNftType) => {
  const pools = usePools()
  const pool = pools.data?.find(
    (p) => p.address === depositNft.deposit.ammPoolId.toString(),
  )

  const entries = depositNft.deposit.yieldFarmEntries
  const farmIds = entries.map((entry) => ({
    yieldFarmId: entry.yieldFarmId,
    globalFarmId: entry.globalFarmId,
    poolId: depositNft.deposit.ammPoolId,
  }))
  const yieldFarms = useYieldFarms(farmIds)

  const shareToken = usePoolShareToken(pool?.address ?? "")
  const totalIssuance = useTotalIssuance(shareToken.data?.token)

  const usd = useUsdPeggedAsset()
  const spotPrices = useSpotPrices(
    pool?.tokens.map((token) => token.id) ?? [],
    usd.data?.id,
  )

  const queries = [
    pools,
    yieldFarms,
    shareToken,
    totalIssuance,
    usd,
    ...spotPrices,
  ]
  const isLoading = queries.some((q) => q.isInitialLoading)

  const data = useMemo(() => {
    if (
      !pool ||
      !yieldFarms.data ||
      !totalIssuance.data ||
      spotPrices.some((q) => !q.data) ||
      isLoading
    )
      return undefined

    const poolTotal = getPoolTotal(
      pool.tokens,
      spotPrices.map((sp) => sp.data),
    )
    const total = getDepositTotal({
      entries,
      yieldFarms: yieldFarms.data,
      totalIssuance: totalIssuance.data.total,
      poolTotal,
    })

    return total
  }, [
    pool,
    entries,
    yieldFarms.data,
    totalIssuance.data,
    spotPrices,
    isLoading,
  ])

  return { data, isLoading }
}

export const useTotalInDeposits = (depositNfts: DepositNftType[]) => {
  const poolsData = usePools()
  const pools = poolsData.data?.filter((p) =>
    depositNfts.some((d) => d.deposit.ammPoolId.toString() === p.address),
  )

  const entries = depositNfts.reduce(
    (acc, curr) => [...acc, ...curr.deposit.yieldFarmEntries],
    [] as PalletLiquidityMiningYieldFarmEntry[],
  )
  const farmIds = depositNfts
    .map((depositNft) =>
      depositNft.deposit.yieldFarmEntries.map((entry) => ({
        yieldFarmId: entry.yieldFarmId,
        globalFarmId: entry.globalFarmId,
        poolId: depositNft.deposit.ammPoolId,
      })),
    )
    .flat()
  const yieldFarms = useYieldFarms(farmIds)

  const shareTokens = usePoolShareTokens(pools?.map((p) => p.address) ?? [])
  const totalIssuances = useTotalIssuances(
    shareTokens.map((st) => st.data?.token) ?? [],
  )

  const usd = useUsdPeggedAsset()
  const spotPrices = useSpotPrices(
    pools?.map((pool) => pool.tokens.map((t) => t.id)).flat() ?? [],
    usd.data?.id,
  )

  const queries = [
    poolsData,
    yieldFarms,
    ...shareTokens,
    ...totalIssuances,
    usd,
    ...spotPrices,
  ]
  const isLoading = queries.some((q) => q.isInitialLoading)

  const data = useMemo(() => {
    if (
      pools === undefined ||
      shareTokens.some((q) => !q.data) ||
      totalIssuances.some((q) => !q.data) ||
      !yieldFarms.data ||
      isLoading
    )
      return undefined

    const totals = depositNfts.map((depositNft) => {
      const poolId = depositNft.deposit.ammPoolId.toString()
      const pool = pools?.find((p) => p.address === poolId)
      const shareToken = shareTokens.find(
        (st) => st.data?.poolId.toString() === poolId,
      )
      const totalIssuance = totalIssuances.find(
        (ti) =>
          ti.data?.token.toString() === shareToken?.data?.token.toString(),
      )

      if (!pool || !totalIssuance?.data) {
        console.error("Unable to calculate deposit total")
        return BN_0
      }

      const poolTotal = getPoolTotal(
        pool.tokens,
        spotPrices.map((sp) => sp.data),
      )
      const total = getDepositTotal({
        entries,
        yieldFarms: yieldFarms.data,
        totalIssuance: totalIssuance.data.total,
        poolTotal,
      })

      return total
    })

    return totals.reduce((acc, curr) => acc.plus(curr), BN_0)
  }, [pools, shareTokens, totalIssuances, yieldFarms.data, isLoading])

  return { data, isLoading }
}

export const useUsersTotalInDeposits = () => {
  const deposits = useAllUserDeposits()
  const total = useTotalInDeposits(deposits.data.deposits ?? [])

  const isLoading = deposits.isLoading || total.isLoading
  const data = useMemo(() => total.data, [total])

  return { data, isLoading }
}

const getDepositTotal = ({
  entries,
  yieldFarms,
  totalIssuance,
  poolTotal,
}: {
  entries: PalletLiquidityMiningYieldFarmEntry[]
  yieldFarms: PalletLiquidityMiningYieldFarmData[]
  totalIssuance: BN
  poolTotal: BN
}) => {
  let depositTotal = BN_0

  for (const entry of entries) {
    const yieldFarm = yieldFarms.find(
      (yf) => yf.id.toString() === entry.yieldFarmId.toString(),
    )
    if (!yieldFarm) {
      console.error("Missing yield farm for deposit")
      continue
    }

    const farmTotal = yieldFarm.totalShares.toBigNumber()
    const farmTotalValued = yieldFarm.totalValuedShares.toBigNumber()
    const entryTotalValued = entry.valuedShares.toBigNumber()

    const farmRatio = farmTotal.div(totalIssuance)
    const entryRatio = entryTotalValued.div(farmTotalValued)

    const farmValue = poolTotal.times(farmRatio)
    const entryValue = farmValue.times(entryRatio)

    depositTotal = depositTotal.plus(entryValue)
  }

  return depositTotal
}
