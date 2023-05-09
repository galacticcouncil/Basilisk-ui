import { PoolBase } from "@galacticcouncil/sdk"
import { useTokenBalance } from "api/balances"
import { useFarms } from "api/farms"
import { usePoolShareToken } from "api/pools"
import { useAccountStore } from "state/store"
import { useUserDeposits } from "utils/farms/deposits"
import { useCurrentSharesValue } from "../shares/value/PoolSharesValue.utils"

export const usePoolActionsConditions = (pool: PoolBase) => {
  const { account } = useAccountStore()

  const farms = useFarms([pool.address])
  const deposits = useUserDeposits(pool.address)

  const shareToken = usePoolShareToken(pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

  const { dollarValue } = useCurrentSharesValue({
    shareToken: shareToken.data?.token,
    shareTokenBalance: balance.data?.balance,
    pool,
  })

  const disabledRemove = balance.data?.balance.isZero()
  const disabledJoin = !farms.data?.length
  const disabledMyPositions =
    !account ||
    (!deposits.data?.length && (!dollarValue || dollarValue.isZero()))
  const arePositions = !!deposits.data?.length

  return { disabledRemove, disabledJoin, disabledMyPositions, arePositions }
}
