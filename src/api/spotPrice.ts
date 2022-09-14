import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "utils/queryKeys"
import { u32 } from "@polkadot/types"
import { useTradeRouter } from "utils/sdk"
import { TradeRouter } from "@galacticcouncil/sdk"

export const useSpotPrice = (assetA: u32, assetB: u32) => {
  const tradeRouter = useTradeRouter()
  const tokenIn = assetA.toString()
  const tokenOut = assetB.toString()

  return useQuery(
    QUERY_KEYS.spotPrice(tokenIn, tokenOut),
    getSpotPrice(tradeRouter, tokenIn, tokenOut),
  )
}

export const getSpotPrice =
  (tradeRouter: TradeRouter, tokenIn: string, tokenOut: string) => async () => {
    return tradeRouter.getBestSpotPrice(tokenIn, tokenOut)
  }
