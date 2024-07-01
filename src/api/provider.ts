import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "utils/queryKeys"
import { WsProvider } from "@polkadot/api"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { SubstrateApis } from "@galacticcouncil/xcm-core"
import { PoolService, PoolType, TradeRouter } from "@galacticcouncil/sdk"

const fetchApi = async (url: string) => {
  const provider = new WsProvider(url)

  const apiPool = SubstrateApis.getInstance()
  const api = await apiPool.api(provider.endpoint)

  const poolService = new PoolService(api)
  const tradeRouter = new TradeRouter(poolService, {
    includeOnly: [PoolType.XYK],
  })

  return { api, tradeRouter }
}

export const useProvider = (rpcUrl?: string) => {
  return useQuery(
    QUERY_KEYS.provider(rpcUrl ?? import.meta.env.VITE_PROVIDER_URL),
    ({ queryKey: [_, api] }) => fetchApi(api),
    { staleTime: Infinity },
  )
}

export const useProviderRpcUrlStore = create(
  persist<{
    rpcUrl?: string
    setRpcUrl: (rpcUrl: string | undefined) => void
    _hasHydrated: boolean
    _setHasHydrated: (value: boolean) => void
  }>(
    (set) => ({
      setRpcUrl: (rpcUrl) => set({ rpcUrl }),
      _hasHydrated: false,
      _setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "rpcUrl",
      getStorage: () => ({
        async getItem(name: string) {
          return window.localStorage.getItem(name)
        },
        setItem(name, value) {
          window.localStorage.setItem(name, value)
        },
        removeItem(name) {
          window.localStorage.removeItem(name)
        },
      }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true)
      },
    },
  ),
)

export const PROVIDERS = [
  {
    name: "Mainnet via Galactic Council",
    url: "wss://rpc.basilisk.cloud",
    indexerUrl: "https://basilisk-explorer.play.hydration.cloud/graphql",
    env: "production",
  },
  {
    name: "Mainnet via Dwellir",
    url: "wss://basilisk-rpc.dwellir.com",
    indexerUrl: "https://basilisk-explorer.play.hydration.cloud/graphql",
    env: "production",
  },
  {
    name: "Rococo via Galactic Council",
    url: "wss://basilisk-rococo-rpc.play.hydration.cloud",
    indexerUrl: "https://basilisk-rococo-explorer.play.hydration.cloud/graphql",
    env: "rococo",
  },
]
