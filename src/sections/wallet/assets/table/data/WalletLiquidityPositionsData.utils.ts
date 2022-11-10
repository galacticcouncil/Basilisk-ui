import { useAccountStore } from "../../../../../state/store"
import { useAccountBalances } from "../../../../../api/accountBalances"
import { NATIVE_ASSET_ID } from "../../../../../utils/api"
import {
  useAssetDetails,
  useAssetDetailsList,
} from "../../../../../api/assetDetails"
import { useMemo } from "react"
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

  const data = useMemo(() => {
    return assets.data?.map((asset) => ({
      id: asset.id,
    }))
  }, [assets.data])

  console.log(data)

  return { data, isLoading: assets.isLoading }
}

export interface WalletLiquidityPositionsData {
  id: string
  symbol: string
  name: string
  transferable: BN
  transferableUSD: BN
  total: BN
  totalUSD: BN
  locked: BN
  lockedUSD: BN
  origin: string
}
