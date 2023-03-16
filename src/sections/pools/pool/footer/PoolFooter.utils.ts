import { PoolBase } from "@galacticcouncil/sdk"
import { useTokenBalance } from "api/balances"
import { usePoolShareToken } from "api/pools"
import { useTotalIssuance } from "api/totalIssuance"
import { useMemo } from "react"
import { useAccountStore } from "state/store"
import { useTotalInDeposits, useUserDeposits } from "utils/farms/deposits"
import { useTotalInPool } from "../Pool.utils"

export const usePoolFooterValues = (pool: PoolBase) => {
  const { account } = useAccountStore()

  const poolTotal = useTotalInPool(pool)
  const deposits = useUserDeposits(pool.address)
  const depositsTotal = useTotalInDeposits(deposits.data ?? [])

  const shareToken = usePoolShareToken(pool.address)
  const shareTokenBalance = useTokenBalance(
    shareToken.data?.token,
    account?.address,
  )
  const totalIssuance = useTotalIssuance(shareToken.data?.token)

  const queries = [
    poolTotal,
    deposits,
    depositsTotal,
    shareToken,
    shareTokenBalance,
    totalIssuance,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (
      !deposits.data ||
      !shareTokenBalance.data ||
      !totalIssuance.data ||
      !poolTotal.data ||
      !depositsTotal.data
    )
      return { locked: undefined, available: undefined }

    const ratio = shareTokenBalance.data.balance.div(totalIssuance.data.total)
    const locked = poolTotal.data.times(ratio).plus(depositsTotal.data)
    const available = locked.minus(depositsTotal.data)

    return { locked, available }
  }, [
    deposits.data,
    totalIssuance.data,
    poolTotal.data,
    depositsTotal.data,
    shareTokenBalance.data,
  ])

  return { ...data, isLoading }
}
