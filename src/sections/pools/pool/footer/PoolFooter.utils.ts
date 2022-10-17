import { PoolBase } from "@galacticcouncil/sdk"
import { useAccountStore, useStore } from "state/store"
import { useCurrentSharesValue } from "sections/pools/pool/shares/value/PoolSharesValue.utils"
import { usePoolShareToken } from "api/pools"
import { useTokenBalance } from "api/balances"
import { useApiPromise } from "utils/network"
import { useMutation } from "@tanstack/react-query"
import { useClaimableAmount } from "utils/totals"
import { useUserDeposits } from "utils/deposits"

export const usePoolFooterValues = (pool: PoolBase) => {
  const { account } = useAccountStore()
  const shareToken = usePoolShareToken(pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

  const deposits = useUserDeposits(pool.address)
  const claimable = useClaimableAmount(pool)
  const shares = useCurrentSharesValue({
    shareToken: shareToken.data?.token,
    shareTokenBalance: balance.data?.balance,
    pool,
  })

  const queries = [deposits, claimable, shares]
  const isLoading = queries.some((q) => q.isLoading)

  const api = useApiPromise()
  const { createTransaction } = useStore()

  const claim = useMutation(async () => {
    const txs =
      deposits.data
        ?.map((i) =>
          i.deposit.yieldFarmEntries.map((entry) => {
            return api.tx.liquidityMining.claimRewards(i.id, entry.yieldFarmId)
          }),
        )
        .flat(2) ?? []

    if (txs.length) {
      return await createTransaction({
        tx: api.tx.utility.batch(txs),
      })
    }
  })

  return {
    locked: shares.dollarValue,
    claimable: claimable.data?.ausd,
    claim,
    isLoading,
  }
}
