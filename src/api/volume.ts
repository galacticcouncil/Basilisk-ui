import { u8aToHex } from "@polkadot/util"
import { decodeAddress } from "@polkadot/util-crypto"
import { useQuery } from "@tanstack/react-query"
import { addDays } from "date-fns"
import { gql, request } from "graphql-request"
import { Maybe, undefinedNoop } from "utils/helpers"
import { QUERY_KEYS } from "utils/queryKeys"

const getTradeVolume = (assetId: string) => async () => {
  const assetHex = u8aToHex(decodeAddress(assetId))
  const after = addDays(new Date(), -1).toISOString()

  // This is being typed manually, as GraphQL schema does not
  // describe the event arguments at all
  return await request<{
    events: Array<
      | {
          name: "Omnipool.SellExecuted"
          args: {
            who: string
            assetIn: number
            assetOut: number
            amount_in: string
            amount_out: string
          }
        }
      | {
          name: "Omnipool.BuyExecuted"
          args: {
            who: string
            assetIn: number
            assetOut: number
            amount_in: string
            amount_out: string
          }
        }
    >
  }>(
    import.meta.env.VITE_INDEXER_URL,
    gql`
      query TradeVolume($assetHex: String!, $after: DateTime!) {
        events(
          where: {
            args_jsonContains: { assetIn: $assetHex }
            block: { timestamp_gte: $after }
            AND: {
              name_eq: "Omnipool.SellExecuted"
              OR: { name_eq: "Omnipool.BuyExecuted" }
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
    { assetHex, after },
  )
}

export function useTradeVolume(assetId: Maybe<string>) {
  return useQuery(
    QUERY_KEYS.tradeVolume(assetId),
    assetId != null ? getTradeVolume(assetId) : undefinedNoop,
    { enabled: !!assetId },
  )
}
