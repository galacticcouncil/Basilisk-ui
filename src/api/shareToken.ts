import { ApiPromise } from "@polkadot/api"
import { AccountId32 } from "@polkadot/types/interfaces/runtime"

export const getShareToken = async (
  api: ApiPromise,
  poolAddress: AccountId32,
) => {
  const res = await api.query.xyk.shareToken(poolAddress)
  return res
}
