import { PoolToken } from "@galacticcouncil/sdk"
import { u32 } from "@polkadot/types"
import { useUsdPeggedAsset } from "api/asset"
import { useAssetDetailsList } from "api/assetDetails"
import { useTokensBalances } from "api/balances"
import { useAllDeposits } from "api/deposits"
import { usePools, usePoolShareTokens } from "api/pools"
import { SpotPrice, useSpotPrices } from "api/spotPrice"
import { useTotalIssuances } from "api/totalIssuance"
import BN from "bignumber.js"
import { useMemo } from "react"
import { useAccountStore } from "state/store"
import { getFloatingPointAmount } from "utils/balance"
import { BN_0 } from "utils/constants"
import {
  useTotalInDeposits,
  useTotalInUsersDeposits,
} from "utils/farms/deposits"
import { isNotNil } from "utils/helpers"
import { useTotalInPools } from "../pool/Pool.utils"

export const useTotalsLocked = () => {
  const pools = usePools()
  const assets = useAssetDetailsList()
  const usd = useUsdPeggedAsset()
  const spotPrices = useSpotPrices(
    assets.data?.map((asset) => asset.id) ?? [],
    usd.data?.id,
  )
  const shareTokens = usePoolShareTokens(
    pools.data?.map((p) => p.address) ?? [],
  )
  const totalIssuances = useTotalIssuances(
    shareTokens.map((q) => q.data?.token),
  )
  const { account } = useAccountStore()
  const balances = useTokensBalances(
    shareTokens.map((st) => st.data?.token).filter((x): x is u32 => !!x) ?? [],
    account?.address,
  )

  const queries = [
    pools,
    assets,
    usd,
    ...balances,
    ...spotPrices,
    ...shareTokens,
    ...totalIssuances,
  ]
  const isLoading = queries.some((q) => q.isInitialLoading)

  const data = useMemo(() => {
    if (
      !pools.data ||
      !assets.data ||
      !usd.data ||
      balances.some((q) => !q.data) ||
      spotPrices.some((q) => !q.data) ||
      shareTokens.some((q) => !q.data) ||
      totalIssuances.some((q) => !q.data)
    )
      return undefined

    const totals = pools.data.map((pool) => {
      const poolTotal = getPoolTotal(
        pool.tokens,
        spotPrices.map((q) => q.data),
      )

      const token = shareTokens.find(
        (st) => st.data?.poolId.toString() === pool.address,
      )?.data?.token
      const issuance = totalIssuances.find(
        (ti) => ti.data?.token.toString() === token?.toString(),
      )?.data?.total
      const balance = balances.find(
        (b) => token?.toString() === b.data?.assetId.toString(),
      )?.data?.balance

      if (!balance || balance.isZero() || !issuance || issuance.isZero())
        return { poolTotal, userTotal: BN_0 }

      const ratio = balance.div(issuance)
      const userTotal = poolTotal.times(ratio)

      return { poolTotal, userTotal }
    })

    const sum = totals.reduce(
      (acc, curr) => ({
        poolTotal: acc.poolTotal.plus(curr.poolTotal),
        userTotal: acc.userTotal.plus(curr.userTotal),
      }),
      {
        poolTotal: BN_0,
        userTotal: BN_0,
      },
    )

    return sum
  }, [
    pools.data,
    assets.data,
    usd.data,
    balances,
    spotPrices,
    shareTokens,
    totalIssuances,
  ])

  return { data, isLoading }
}

export const getPoolTotal = (
  tokens: PoolToken[],
  spotPrices: (SpotPrice | undefined)[],
) => {
  const total = tokens.reduce((acc, token) => {
    const amount = getFloatingPointAmount(new BN(token.balance), token.decimals)
    const spotPrice = spotPrices.find((sp) => sp?.tokenIn === token.id)
    const total = amount.times(spotPrice?.spotPrice ?? BN_0)

    return acc.plus(total)
  }, BN_0)

  return total
}

export const useTotalLocked = () => {
  const pools = usePools()
  const poolIds = pools.data?.map((pool) => pool.address) ?? []
  const poolsTotal = useTotalInPools(pools.data ?? [])
  const deposits = useAllDeposits(poolIds)
  const depositsTotal = useTotalInDeposits(
    deposits
      .map((deposit) => deposit.data)
      .filter(isNotNil)
      .flat() ?? [],
  )

  const queries = [pools, poolsTotal, ...deposits, depositsTotal]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (!poolsTotal.data || !depositsTotal.data) return BN_0
    return poolsTotal.data.total.plus(depositsTotal.data)
  }, [poolsTotal.data, depositsTotal.data])

  return { data, isLoading }
}

export const useUsersTotalLocked = () => {
  const { account } = useAccountStore()
  const pools = usePools()
  const poolIds = pools.data?.map((pool) => pool.address) ?? []
  const poolsTotals = useTotalInPools(pools.data ?? [])
  const userDepositsTotal = useTotalInUsersDeposits()
  const shareTokens = usePoolShareTokens(poolIds)
  const shareTokenIds =
    shareTokens.map((st) => st.data?.token.toString()).filter(isNotNil) ?? []
  const balances = useTokensBalances(shareTokenIds, account?.address)
  const totalIssuances = useTotalIssuances(shareTokenIds)

  const queries = [
    pools,
    poolsTotals,
    userDepositsTotal,
    ...shareTokens,
    ...balances,
    ...totalIssuances,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (
      !poolsTotals.data ||
      !userDepositsTotal.data ||
      shareTokens.some((q) => !q.data) ||
      balances.some((q) => !q.data) ||
      totalIssuances.some((q) => !q.data)
    )
      return undefined

    const totals = poolsTotals.data.totals.map(({ total, poolId }) => {
      const shareToken = shareTokens
        .find((st) => st.data?.poolId.toString() === poolId)
        ?.data?.token.toString()
      const balance = balances.find(
        (b) => b.data?.assetId.toString() === shareToken,
      )?.data?.balance
      const totalIssuance = totalIssuances.find(
        (ti) => ti.data?.token.toString() === shareToken,
      )?.data?.total

      if (!shareToken || !balance || !totalIssuance) return BN_0

      const ratio = balance.div(totalIssuance)

      return total.times(ratio)
    })

    const sum = totals.reduce((acc, curr) => acc.plus(curr), BN_0)
    const total = sum.plus(userDepositsTotal.data)

    return total
  }, [
    poolsTotals.data,
    userDepositsTotal.data,
    shareTokens,
    balances,
    totalIssuances,
  ])

  return { data, isLoading }
}
