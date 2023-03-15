import { u8aToHex } from "@polkadot/util"
import { decodeAddress } from "@polkadot/util-crypto"
import { useQueries } from "@tanstack/react-query"
import { addDays } from "date-fns"
import { request, gql } from "graphql-request"
import { Maybe, normalizeId, undefinedNoop } from "utils/helpers"
import { QUERY_KEYS } from "utils/queryKeys"
import BN from "bignumber.js"
import { BN_0 } from "../utils/constants"
import { PROVIDERS, useProviderRpcUrlStore } from "./provider"

const getTradeVolume =
  (indexerUrl: string, poolAddress: string) => async () => {
    const poolHex = u8aToHex(decodeAddress(poolAddress))
    const after = addDays(new Date(), -1).toISOString()

    // This is being typed manually, as GraphQL schema does not
    // describe the event arguments at all
    return {
      assetId: normalizeId(poolAddress),
      ...(await request<{
        events: Array<
          | {
              name: "XYK.SellExecuted"
              args: {
                who: string
                assetOut: number
                assetIn: number
                amount: string
                salePrice: string
                feeAsset: number
                feeAmount: string
                pool: string
              }
            }
          | {
              name: "XYK.BuyExecuted"
              args: {
                who: string
                assetOut: number
                assetIn: number
                amount: string
                buyPrice: string
                feeAsset: number
                feeAmount: string
                pool: string
              }
            }
        >
      }>(
        indexerUrl,
        gql`
          query TradeVolume($poolHex: String!, $after: DateTime!) {
            events(
              where: {
                args_jsonContains: { pool: $poolHex }
                block: { timestamp_gte: $after }
                AND: {
                  name_eq: "XYK.SellExecuted"
                  OR: { name_eq: "XYK.BuyExecuted" }
                }
              }
            ) {
              name
              args
              block {
                timestamp
              }
            }
          }
        `,
        { poolHex, after },
      )),
    }
  }

export function useTradeVolumes(poolAddresses: Maybe<string>[]) {
  const preference = useProviderRpcUrlStore()
  const rpcUrl = preference.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL
  const selectedProvider = PROVIDERS.find((provider) => provider.url === rpcUrl)

  const indexerUrl =
    selectedProvider?.indexerUrl ?? import.meta.env.VITE_INDEXER_URL

  return useQueries({
    queries: poolAddresses.map((poolAddress) => ({
      queryKey: QUERY_KEYS.tradeVolume(poolAddress),
      queryFn:
        poolAddress != null
          ? getTradeVolume(indexerUrl, poolAddress)
          : undefinedNoop,
      enabled: !!poolAddress,
    })),
  })
}

export function getVolumeAssetTotalValue(
  volume?: Awaited<ReturnType<ReturnType<typeof getTradeVolume>>>,
) {
  if (!volume) return
  // Assuming trade volume is the aggregate amount being
  // sent between user account and pair account
  return (
    volume.events.reduce<Record<string, BN>>((memo, item) => {
      const assetIn = item.args.assetIn.toString()
      const assetOut = item.args.assetOut.toString()

      if (memo[assetIn] == null) memo[assetIn] = BN_0
      if (memo[assetOut] == null) memo[assetOut] = BN_0

      if (item.name === "XYK.BuyExecuted") {
        memo[assetIn] = memo[assetIn].plus(item.args.buyPrice)
        memo[assetOut] = memo[assetOut].plus(item.args.amount)
      }

      if (item.name === "XYK.SellExecuted") {
        memo[assetIn] = memo[assetIn].plus(item.args.amount)
        memo[assetOut] = memo[assetOut].plus(item.args.salePrice)
      }

      return memo
    }, {}) ?? {}
  )
}
