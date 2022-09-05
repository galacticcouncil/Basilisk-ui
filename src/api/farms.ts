import { ApiPromise } from "@polkadot/api"
import { useQuery } from "@tanstack/react-query"
import { useApiPromise } from "utils/network"

const getGlobalFarmList = (api: ApiPromise) => async () => {
  const res = await api.query.warehouseLM.globalFarm.entries()
  return res.map(([_, data]) => data.value)
}

export const useGlobalFarmList = () => {
  const api = useApiPromise()
  return useQuery(["globalFarmList"], getGlobalFarmList(api))
}

export const useActiveYieldFarm = (ammId: string) => {
  const api = useApiPromise()

  return useQuery(["activeYieldFarm", ammId], async () => {
    const yieldFarms = await api.query.warehouseLM.activeYieldFarm.entries(
      ammId,
    )
    return yieldFarms.map(([key, data]) => {
      return {
        globalFarmId: key.args[1].toHuman(),
        yieldFarmId: data.value.toHuman(),
      }
    })
  })
}

export const useYieldFarm = (
  ammId: string,
  globalFarmId: string,
  yieldFarmId: string,
) => {
  const api = useApiPromise()
  return useQuery(["yieldFarm", ammId, globalFarmId, yieldFarmId], async () => {
    const res = await api.query.warehouseLM.yieldFarm(
      ammId,
      globalFarmId,
      yieldFarmId,
    )
    return res.value
  })
}
