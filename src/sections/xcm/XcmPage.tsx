import { Page } from "components/Layout/Page/Page"
import { SContainer } from "./XcmPage.styled"

import * as React from "react"
import * as Apps from "@galacticcouncil/apps"
import { createComponent } from "@lit-labs/react"
import { useAccountStore } from "state/store"
import { GcTransactionCenter } from "./TransactionCenter"
import { Navigate } from "@tanstack/react-location"

export const XcmApp = createComponent({
  tagName: "gc-xcm-app",
  elementClass: Apps.XcmApp,
  react: React,
})
const disabled = true

export function XcmPage() {
  const { account } = useAccountStore()

  const ref = React.useRef<Apps.XcmApp>(null)

  if (disabled) return <Navigate to="/trade" search />

  return (
    <GcTransactionCenter>
      <Page>
        <SContainer>
          <XcmApp
            ref={ref}
            srcChain="kusama"
            dstChain="basilisk"
            chains="basilisk,karura,kusama,tinkernet,statemine,robonomics"
            accountName={account?.name}
            accountProvider={account?.provider}
            accountAddress={account?.address}
          />
        </SContainer>
      </Page>
    </GcTransactionCenter>
  )
}
