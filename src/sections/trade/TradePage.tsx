import { Page } from "components/Layout/Page/Page"

import * as React from "react"
import * as Apps from "@galacticcouncil/apps"
import { createComponent, EventName } from "@lit-labs/react"
import { useAccountStore } from "state/store"
import { MakeGenerics, useSearch } from "@tanstack/react-location"
import { z } from "zod"
import { PoolType } from "@galacticcouncil/sdk"

const NotificationCenter = createComponent({
  tagName: "gc-notification-center",
  elementClass: Apps.NotificationCenter,
  react: React,
})

const TransactionCenter = createComponent({
  tagName: "gc-transaction-center",
  elementClass: Apps.TransactionCenter,
  react: React,
})

export const TradeApp = createComponent({
  tagName: "gc-trade-app",
  elementClass: Apps.TradeApp,
  react: React,
  events: {
    onInit: "gc:init" as EventName<CustomEvent>,
  },
})

const TradeAppSearch = z.object({
  assetIn: z
    .number()
    .transform((value) => String(value))
    .optional(),
  assetOut: z
    .number()
    .transform((value) => String(value))
    .optional(),
})

type SearchGenerics = MakeGenerics<{
  Search: z.infer<typeof TradeAppSearch>
}>

export function TradePage() {
  const { account } = useAccountStore()

  const ref = React.useRef<Apps.TradeApp>(null)
  const rawSearch = useSearch<SearchGenerics>()
  const search = TradeAppSearch.safeParse(rawSearch)

  return (
    <Page>
      <NotificationCenter>
        <TransactionCenter>
          <TradeApp
            ref={ref}
            accountName={account?.name}
            accountProvider={account?.provider}
            accountAddress={account?.address}
            apiAddress={import.meta.env.VITE_PROVIDER_URL}
            stableCoinAssetId="4"
            assetIn={search.success ? search.data.assetIn : undefined}
            assetOut={search.success ? search.data.assetOut : undefined}
            pools={PoolType.XYK}
          />
        </TransactionCenter>
      </NotificationCenter>
    </Page>
  )
}
