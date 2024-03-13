import { ApiPromise } from "@polkadot/api"
import { createContext, useContext } from "react"
import { TradeRouter } from "@galacticcouncil/sdk"

export const BASILISK_ADDRESS_PREFIX = 10041
export const NATIVE_ASSET_ID = "0"
export const DEPOSIT_CLASS_ID = "1" // TODO: replace with constant from api
export const POLKADOT_APP_NAME = "Basilisk Web App"

export type TApiPromiseCustom = {
  api: ApiPromise
  tradeRouter: TradeRouter
  isLoaded: boolean
} & { isError?: boolean }

export const ApiPromiseContext = createContext<TApiPromiseCustom>({
  isLoaded: false,
} as TApiPromiseCustom)
export const useApiPromise = () => useContext(ApiPromiseContext)
