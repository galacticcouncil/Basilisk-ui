import {
  PalletLiquidityMiningYieldFarmData,
  PalletLiquidityMiningYieldFarmEntry,
} from "@polkadot/types/lookup"
import { useUsdPeggedAsset } from "api/asset"
import {
  DepositNftType,
  useAccountDepositIds,
  useAllDeposits,
  useDeposits,
} from "api/deposits"
import { useYieldFarms } from "api/farms"
import { usePools, usePoolShareToken, usePoolShareTokens } from "api/pools"
import { useSpotPrices } from "api/spotPrice"
import { useTotalIssuance, useTotalIssuances } from "api/totalIssuance"
import BN from "bignumber.js"
import { useMemo } from "react"
import { getPoolTotal } from "sections/pools/header/PoolsHeader.utils"
import { useAccountStore } from "state/store"
import { useQueryReduce } from "utils/helpers"
import { BN_0 } from "../constants"

export const useUserDeposits = (poolId: string) => {
  const { account } = useAccountStore()
  const deposits = useDeposits(poolId)
  const depositIds = useAccountDepositIds(account?.address)

  return useQueryReduce(
    [deposits, depositIds] as const,
    (deposits, depositIds) => {
      return deposits.filter((deposit) =>
        depositIds?.some((id) => id.instanceId.eq(deposit.id)),
      )
    },
  )
}

export const useAllUserDeposits = () => {
  const { account } = useAccountStore()
  const pools = usePools()
  const allDeposits = useAllDeposits(pools.data?.map((p) => p.address) ?? [])
  const depositIds = useAccountDepositIds(account?.address)

  const queries = [pools, ...allDeposits, depositIds]
  const isLoading = queries.some((q) => q.isLoading)
  const isInitialLoading = queries.some((q) => q.isInitialLoading)

  const deposits = useMemo(() => {
    if (allDeposits.some((q) => !q.data) || !depositIds.data) return undefined

    return (
      allDeposits
        .map((d) => d.data)
        .filter((x): x is DepositNftType[] => x !== undefined)
        .flat(2)
        .filter((deposit) =>
          depositIds.data?.some(
            (id) => id.instanceId.toString() === deposit?.id.toString(),
          ),
        ) ?? []
    )
  }, [allDeposits, depositIds.data])

  const positions = useMemo(
    () =>
      deposits
        ?.map(({ deposit }) =>
          deposit.yieldFarmEntries.map((position) => ({
            position,
            poolId: deposit.ammPoolId,
          })),
        )
        .flat(2),
    [deposits],
  )

  return {
    data: { deposits, positions },
    isLoading,
    isInitialLoading,
  }
}

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
        entries: depositNft.deposit.yieldFarmEntries,
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

export const useTotalInUsersDeposits = () => {
  const deposits = useAllUserDeposits()
  const total = useTotalInDeposits(deposits.data.deposits ?? [])

  return { data: total.data, isLoading: deposits.isLoading || total.isLoading }
}

export const useTotalInAllDeposits = () => {
  const pools = usePools()
  const allDeposits = useAllDeposits(pools.data?.map((pool) => pool.address))
  const deposits = allDeposits.reduce(
    (acc, deposit) => (deposit.data ? [...acc, ...deposit.data] : acc),
    [] as DepositNftType[],
  )
  const total = useTotalInDeposits(deposits)

  const isLoading =
    allDeposits.some((q) => q.isLoading) || total.isLoading || pools.isLoading

  return { data: total.data, isLoading }
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
