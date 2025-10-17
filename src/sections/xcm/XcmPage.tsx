import { Page } from "components/Layout/Page/Page"
import { SContainer } from "./XcmPage.styled"

import * as React from "react"
import * as Apps from "@galacticcouncil/apps"
import { Ecosystem } from "@galacticcouncil/apps"
import { createComponent } from "@lit-labs/react"
import { useAccountStore } from "state/store"
import { useProviderRpcUrlStore } from "api/provider"
import { GcTransactionCenter } from "./TransactionCenter"

export const XcmApp = createComponent({
  tagName: "gc-xcm",
  elementClass: Apps.XcmApp,
  react: React,
})

export function XcmPage() {
  const { account } = useAccountStore()

  const ref = React.useRef<Apps.XcmApp>(null)
  const preference = useProviderRpcUrlStore()
  const rpcUrl = preference.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL
  const usdAssetId = import.meta.env.VITE_USD_PEGGED_ASSET_ID

  return (
    <GcTransactionCenter>
      <Page>
        <SContainer>
          <XcmApp
            ref={ref}
            ecosystem={Ecosystem.Kusama}
            srcChain="karura"
            destChain="basilisk"
            asset={"KSM"}
            accountName={account?.name}
            accountProvider={account?.provider}
            accountAddress={account?.address}
            apiAddress={rpcUrl}
            blacklist="robonomics,kusama"
            stableCoinAssetId={usdAssetId}
          />
        </SContainer>
      </Page>
    </GcTransactionCenter>
  )
}
