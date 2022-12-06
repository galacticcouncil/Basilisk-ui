import { Page } from "components/Layout/Page/Page"

import * as React from "react"
import * as Apps from "@galacticcouncil/apps"
import { createComponent, EventName } from "@lit-labs/react"
import { useAccountStore } from "state/store"
import { MakeGenerics, useSearch } from "@tanstack/react-location"
import { z } from "zod"

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
})

const TradeAppSearch = z.object({
  type: z.union([z.literal("assetIn"), z.literal("assetOut")]),
  id: z.number().transform((value) => String(value)),
})

type SearchGenerics = MakeGenerics<{
  Search: z.infer<typeof TradeAppSearch>
}>

export function TradePage() {
  const { account } = useAccountStore()

  const search = useSearch<SearchGenerics>()
  const ref = React.useRef<Apps.TradeApp>(null)

  return (
    <Page>
      <div>
        <NotificationCenter>
          <TransactionCenter>
            <TradeApp
              ref={ref}
              accountName={account?.name}
              accountProvider={account?.provider}
              accountAddress={account?.address}
              apiAddress={import.meta.env.VITE_PROVIDER_URL}
              pools="XYK"
            />
          </TransactionCenter>
        </NotificationCenter>
      </div>
    </Page>
  )
}
