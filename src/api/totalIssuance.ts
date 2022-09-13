import { useApiPromise } from "utils/network"
import { ApiPromise } from "@polkadot/api"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "utils/queryKeys"
import BigNumber from "bignumber.js"
import { u32 } from "@polkadot/types"
import { Maybe } from "utils/types"

const getTotalIssuance = (api: ApiPromise, lpToken: Maybe<u32>) => async () => {
  if (lpToken == null) throw new Error("Missing LP token")

  const res = await api.query.tokens.totalIssuance(lpToken)
  return new BigNumber(res.toHex())
}

export const useTotalIssuance = (lpToken: Maybe<u32>) => {
  const api = useApiPromise()
  return useQuery(
    QUERY_KEYS.totalIssuance(lpToken),
    getTotalIssuance(api, lpToken),
    { enabled: !!lpToken },
  )
}
