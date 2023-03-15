import {
  DepositNftType,
  useAccountDepositIds,
  useAllDeposits,
  useDeposits,
} from "api/deposits"
import { usePools } from "api/pools"
import { useMemo } from "react"
import { useAccountStore } from "state/store"
import { useQueryReduce } from "utils/helpers"

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
