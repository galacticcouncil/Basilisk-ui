import { useApiPromise } from "utils/network"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "utils/queryKeys"
import { ApiPromise } from "@polkadot/api"
import { u32 } from "@polkadot/types"
import { Maybe } from "utils/types"

export const useAssetMeta = (id: Maybe<u32>) => {
  const api = useApiPromise()
  return useQuery(QUERY_KEYS.assetMeta(id), getAssetMeta(api, id))
}

export const getAssetMeta = (api: ApiPromise, id: Maybe<u32>) => async () => {
  if (id == null) throw new Error("Missing ID for asset metadata")

  const res = await api.query.assetRegistry.assetMetadataMap(id)
  const data = res.unwrap()

  return { id, data }
}
