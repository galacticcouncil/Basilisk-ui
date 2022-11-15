import { Page } from "components/Layout/Page/Page"

import * as React from "react"
import { createComponent } from "@lit-labs/react"
import { App as LitTradeApp } from "trade-app"
import { useAccountStore } from "state/store"

export const TradeApp = createComponent({
  tagName: "gc-trade-app",
  elementClass: LitTradeApp,
  react: React,
})

export function TradePage() {
  const { account } = useAccountStore()

  return (
    <Page>
      <TradeApp
        account={account}
        apiAddress={import.meta.env.VITE_PROVIDER_URL}
      />
    </Page>
  )
}
