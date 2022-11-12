import { useAccountStore } from "state/store"
import { useAccountBalances } from "api/accountBalances"
import { NATIVE_ASSET_ID } from "utils/api"
import { useAssetDetailsList } from "api/assetDetails"
import { useMemo } from "react"
import { usePoolsWithShareTokens } from "api/pools"
import BN from "bignumber.js"

export const useLiquidityPositionsTableData = () => {
  const { account } = useAccountStore()
  const accountBalances = useAccountBalances(account?.address)

  const tokenIds = accountBalances.data?.balances
    ? [NATIVE_ASSET_ID, ...accountBalances.data.balances.map((b) => b.id)]
    : []

  const assets = useAssetDetailsList(tokenIds, {
    assetType: ["PoolShare"],
  })

  const poolsWithShareTokens = usePoolsWithShareTokens()

  const queries = [accountBalances, assets, poolsWithShareTokens]
  const isLoading = queries.some((query) => query.isLoading)

  const participatedLiquidityPools = useMemo(() => {
    if (assets.data && poolsWithShareTokens.data) {
      const shareAssetsIds = assets.data.map((asset) => asset.id)
      return poolsWithShareTokens.data
        .filter((pool) => {
          if (pool.shareToken) {
            return shareAssetsIds.includes(pool.shareToken.token.toString())
          }
          return false
        })
        .map((pool) => {
          const shareTokenId = pool.shareToken?.token.toString()
          const name = assets.data.find(
            (shareToken) => shareToken.id === shareTokenId,
          )?.name

          return {
            name,
            symbolA: pool.tokens[0].symbol,
            symbolB: pool.tokens[1].symbol,
            transferable: new BN(0), // TODO: Transferable balance
            transferableUSD: new BN(0), // TODO: Transferable USD
          }
        })
    }
    return []
  }, [poolsWithShareTokens.data, assets.data])

  return { data: participatedLiquidityPools, isLoading }
}
