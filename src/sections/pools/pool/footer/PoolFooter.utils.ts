import { PoolBase } from "@galacticcouncil/sdk"
import { ToastMessage, useAccountStore } from "state/store"
import { useCurrentSharesValue } from "sections/pools/pool/shares/value/PoolSharesValue.utils"
import { usePoolShareToken } from "api/pools"
import { useTokenBalance } from "api/balances"
import { useClaimAllMutation } from "utils/farms/claiming"
import { useUserDeposits } from "utils/farms/deposits"
import { BN_0 } from "utils/constants"

export const usePoolFooterValues = (pool: PoolBase, toast: ToastMessage) => {
  const { account } = useAccountStore()
  const shareToken = usePoolShareToken(pool.address)
  const availableSharesCount = useTokenBalance(
    shareToken.data?.token,
    account?.address,
  )

  const deposits = useUserDeposits(pool.address)
  const farmingSharesCount = deposits.data?.reduce(
    (memo, i) => memo.plus(i.deposit.shares.toBigNumber()),
    BN_0,
  )

  const lockedSharesCount =
    farmingSharesCount != null
      ? availableSharesCount.data?.balance.plus(farmingSharesCount)
      : undefined

  const lockedShares = useCurrentSharesValue({
    shareToken: shareToken.data?.token,
    shareTokenBalance: lockedSharesCount,
    pool,
  })

  const availableShares = useCurrentSharesValue({
    shareToken: shareToken.data?.token,
    shareTokenBalance: availableSharesCount.data?.balance,
    pool,
  })

  const claimAll = useClaimAllMutation(pool.address, undefined, toast)

  const queries = [deposits, lockedShares, availableShares, claimAll]
  const isLoading = queries.some((q) => q.isLoading)

  return {
    locked: lockedShares.dollarValue,
    available: availableShares.dollarValue,
    claimAll: claimAll.mutation,
    isLoading,
  }
}
