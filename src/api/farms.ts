import { ApiPromise } from "@polkadot/api"
import { u32 } from "@polkadot/types-codec"
import { AccountId32 } from "@polkadot/types/interfaces/runtime"
import { useQueries, useQuery } from "@tanstack/react-query"
import { useApiPromise } from "utils/api"
import { isNotNil, useQueryReduce } from "utils/helpers"
import { QUERY_KEYS } from "utils/queryKeys"

export const useYieldFarms = (ids: FarmIds[]) => {
  const api = useApiPromise()
  return useQuery(QUERY_KEYS.yieldFarms(ids), getYieldFarms(api, ids))
}

export const useYieldFarm = (ids: {
  poolId: AccountId32 | string
  globalFarmId: u32 | string
  yieldFarmId: u32 | string
}) => {
  const api = useApiPromise()
  return useQuery(QUERY_KEYS.yieldFarm(ids), getYieldFarm(api, ids), {
    enabled: !!ids,
  })
}

export const useActiveYieldFarms = (poolIds: (AccountId32 | string)[]) => {
  const api = useApiPromise()
  return useQueries({
    queries: poolIds.map((poolId) => ({
      queryKey: QUERY_KEYS.activeYieldFarms(poolId),
      queryFn: getActiveYieldFarms(api, poolId),
    })),
  })
}

export const useGlobalFarms = (ids: u32[]) => {
  const api = useApiPromise()
  return useQuery(QUERY_KEYS.globalFarms(ids), getGlobalFarms(api, ids), {
    enabled: !!ids.length,
  })
}

export const useGlobalFarm = (id: u32) => {
  const api = useApiPromise()
  return useQuery(QUERY_KEYS.globalFarm(id), getGlobalFarm(api, id))
}

export const useFarms = (poolIds: Array<AccountId32 | string>) => {
  const activeYieldFarms = useActiveYieldFarms(poolIds)

  const data = activeYieldFarms.reduce(
    (acc, farm) => (farm.data ? [...acc, ...farm.data] : acc),
    [] as FarmIds[],
  )

  const globalFarms = useGlobalFarms(data.map((id) => id.globalFarmId))
  const yieldFarms = useYieldFarms(data)

  return useQueryReduce(
    [globalFarms, yieldFarms, ...activeYieldFarms] as const,
    (globalFarms, yieldFarms, ...activeYieldFarms) => {
      const farms =
        activeYieldFarms.flat(2).map((af) => {
          const globalFarm = globalFarms?.find((gf) =>
            af.globalFarmId.eq(gf.id),
          )
          const yieldFarm = yieldFarms?.find((yf) => af.yieldFarmId.eq(yf.id))
          if (!globalFarm || !yieldFarm) return undefined
          return { globalFarm, yieldFarm }
        }) ?? []
      return farms.filter(isNotNil)
    },
  )
}

export const getYieldFarms = (api: ApiPromise, ids: FarmIds[]) => async () => {
  const reqs = ids.map(({ poolId, globalFarmId, yieldFarmId }) =>
    api.query.xykWarehouseLM.yieldFarm(poolId, globalFarmId, yieldFarmId),
  )
  const res = await Promise.all(reqs)
  const farms = res.map((data) => data.unwrap())

  return farms
}

export const getYieldFarm =
  (
    api: ApiPromise,
    {
      yieldFarmId,
      globalFarmId,
      poolId,
    }: {
      poolId: AccountId32 | string
      globalFarmId: u32 | string
      yieldFarmId: u32 | string
    },
  ) =>
  async () => {
    const res = await api.query.xykWarehouseLM.yieldFarm(
      poolId,
      globalFarmId,
      yieldFarmId,
    )
    const farm = res.unwrap()

    return farm
  }

export const getActiveYieldFarms =
  (api: ApiPromise, poolId: AccountId32 | string) => async () => {
    const res = await api.query.xykWarehouseLM.activeYieldFarm.entries(poolId)

    const data = res.map(([storageKey, data]) => {
      const [poolId, globalFarmId] = storageKey.args
      const yieldFarmId = data.unwrap()

      return {
        poolId,
        globalFarmId,
        yieldFarmId,
      }
    })

    return data
  }

export const getGlobalFarms = (api: ApiPromise, ids: u32[]) => async () => {
  const reqs = ids.map((id) => api.query.xykWarehouseLM.globalFarm(id))
  const res = await Promise.all(reqs)
  const farms = res.map((data) => data.unwrap())

  return farms
}

export const getGlobalFarm = (api: ApiPromise, id: u32) => async () => {
  const res = await api.query.xykWarehouseLM.globalFarm(id)
  const farm = res.unwrap()

  return farm
}

export interface FarmIds {
  poolId: AccountId32
  globalFarmId: u32
  yieldFarmId: u32
}
