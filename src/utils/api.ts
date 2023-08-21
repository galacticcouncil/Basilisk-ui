import { ApiPromise } from "@polkadot/api"
import { createContext, useContext, useMemo } from "react"
import { PoolService, PoolType, TradeRouter } from "@galacticcouncil/sdk"

export const BASILISK_ADDRESS_PREFIX = 10041
export const NATIVE_ASSET_ID = "0"
export const DEPOSIT_CLASS_ID = "1" // TODO: replace with constant from api
export const POLKADOT_APP_NAME = "Basilisk Web App"

export type TApiPromiseCustom = ApiPromise & { isError?: boolean }

export const ApiPromiseContext = createContext<TApiPromiseCustom>(
  {} as TApiPromiseCustom,
)
export const useApiPromise = () => useContext(ApiPromiseContext)

export const useTradeRouter = () => {
  const api = useApiPromise()

  const router = useMemo(() => {
    const poolService = new PoolService(api)
    const tradeRouter = new TradeRouter(poolService, {
      includeOnly: [PoolType.XYK],
    })

    return tradeRouter
  }, [api])

  return router
}
