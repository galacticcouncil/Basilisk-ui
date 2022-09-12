import { SubmittableExtrinsic } from "@polkadot/api/promise/types"
import { useStore } from "../state/store"
import { AccountId32 } from "@polkadot/types/interfaces"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "../utils/queryKeys"

const getPaymentInfo =
  (tx: SubmittableExtrinsic, account: AccountId32 | string) => async () => {
    const paymentInfo = await tx.paymentInfo(account)
    return paymentInfo
  }

export function usePaymentInfo(
  tx: SubmittableExtrinsic,
  address?: AccountId32 | string,
) {
  const { account } = useStore()
  const finalAccount = address ?? account?.address

  return useQuery(
    QUERY_KEYS.paymentInfo(tx.hash, finalAccount),
    getPaymentInfo(tx, finalAccount ?? ""),
  )
}
