import { useAccountStore } from "state/store"
import { usePools } from "api/pools"
import { useAccountDepositIds, useAllDeposits } from "api/deposits"
import { useMemo } from "react"
import { useSpotPrices } from "api/spotPrice"
import { useUsdPeggedAsset } from "api/asset"
import { getFloatingPointAmount } from "utils/balance"
import BN from "bignumber.js"
import { BN_1 } from "utils/constants"
import { PoolToken } from "@galacticcouncil/sdk"

export type PoolsPageFilter = { showMyPositions: boolean }

export const useFilteredPools = ({ showMyPositions }: PoolsPageFilter) => {
  const { account } = useAccountStore()
  const pools = usePools()
  const accountDeposits = useAccountDepositIds(account?.address)
  const allDeposits = useAllDeposits(pools.data?.map((pool) => pool.address))

  const usd = useUsdPeggedAsset()

  const poolAssetsId = pools.data?.reduce((acc, pool) => {
    pool.tokens.forEach((token) => {
      if (!acc.includes(token.id)) acc.push(token.id)
    })

    return acc
  }, [] as string[])

  const spotPrices = useSpotPrices(poolAssetsId ?? [], usd.data?.id)

  const queries = [pools, accountDeposits, usd, ...allDeposits, ...spotPrices]

  // https://github.com/TanStack/query/issues/3584
  const isLoading = queries.some((q) => q.isLoading && q.fetchStatus !== "idle")

  const data = useMemo(() => {
    if (isLoading) return []

    const spotPricesMap = spotPrices.map((spotPrice) => ({
      id: spotPrice.data?.tokenIn,
      spotPrice: spotPrice.data?.spotPrice,
    }))

    const getTotalUSDValue = (tokens: PoolToken[]) => {
      const [tokenA, tokenB] = tokens
      const balanceA = getFloatingPointAmount(
        new BN(tokenA.balance),
        tokenA.decimals,
      )
      const balanceB = getFloatingPointAmount(
        new BN(tokenB.balance),
        tokenB.decimals,
      )

      const AtoAUSD =
        spotPricesMap.find((spotPrice) => spotPrice.id === tokenA.id)
          ?.spotPrice ?? BN_1
      const BtoAUSD =
        spotPricesMap.find((spotPrice) => spotPrice.id === tokenB.id)
          ?.spotPrice ?? BN_1

      const totalA = balanceA.times(AtoAUSD)
      const totalB = balanceB.times(BtoAUSD)

      return totalA.plus(totalB)
    }

    const sortedPools = pools.data?.sort((a, b) => {
      const totalA = getTotalUSDValue(a.tokens)
      const totalB = getTotalUSDValue(b.tokens)

      return totalB.minus(totalA).toNumber()
    })

    if (!account?.address) return sortedPools

    if (
      !pools.data ||
      !accountDeposits.data ||
      allDeposits.some((q) => !q.data)
    )
      return undefined

    if (!showMyPositions) return sortedPools

    const depositData = allDeposits
      .map((deposits) => deposits.data ?? [])
      .reduce((acc, deposits) => [...acc, ...deposits], [])

    const usersDeposits = depositData.filter((deposit) =>
      accountDeposits.data?.some((ad) => ad.instanceId.eq(deposit.id)),
    )

    const relevantPools = sortedPools?.filter((pool) =>
      usersDeposits.some(({ deposit }) => deposit.ammPoolId.eq(pool.address)),
    )

    return relevantPools
  }, [
    isLoading,
    spotPrices,
    pools.data,
    account?.address,
    accountDeposits.data,
    allDeposits,
    showMyPositions,
  ])

  return { data, isLoading }
}
