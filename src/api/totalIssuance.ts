import { useApiPromise } from "utils/network"
import { ApiPromise } from "@polkadot/api"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "utils/queryKeys"
import BigNumber from "bignumber.js"
import { u32 } from "@polkadot/types"

export const getTotalIssuance = (api: ApiPromise, lpToken: u32) => async () => {
  const res = await api.query.tokens.totalIssuance(lpToken)
  return new BigNumber(res.toHex())
}

export const useTotalIssuance = (lpToken: u32) => {
  const api = useApiPromise()
  return useQuery(
    QUERY_KEYS.totalIssuance(lpToken),
    getTotalIssuance(api, lpToken),
  )
}
