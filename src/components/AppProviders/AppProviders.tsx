import { InvalidateOnBlock } from "components/InvalidateOnBlock"
import { ApiPromiseContext, TApiPromiseCustom } from "utils/api"
import { FC, PropsWithChildren } from "react"
import { useProvider, useProviderRpcUrlStore } from "api/provider"
import { ToastProvider } from "components/Toast/ToastProvider"
import { Transactions } from "sections/transaction/Transactions"
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip"
import { SkeletonTheme } from "react-loading-skeleton"
import { theme } from "theme"
import { WalletConnectProvider } from "components/WalletConnectProvider/WalletConnectProvider"
import * as React from "react"
import * as Apps from "@galacticcouncil/apps"
import { createComponent } from "@lit-labs/react"

const AppsContextProvider = createComponent({
  tagName: "gc-context-provider",
  elementClass: Apps.ContextProvider,
  react: React,
})

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  const preference = useProviderRpcUrlStore()
  const { data, isError } = useProvider(preference.rpcUrl)

  return (
    <TooltipProvider>
      <ApiPromiseContext.Provider
        value={
          data && preference._hasHydrated
            ? { ...data, isLoaded: true }
            : ({ isError } as TApiPromiseCustom)
        }
      >
        <WalletConnectProvider>
          <InvalidateOnBlock>
            <ToastProvider>
              <SkeletonTheme
                baseColor={`rgba(${theme.rgbColors.white}, 0.12)`}
                highlightColor={`rgba(${theme.rgbColors.white}, 0.24)`}
                borderRadius={9999}
              >
                <AppsContextProvider>{children}</AppsContextProvider>
                <Transactions />
              </SkeletonTheme>
            </ToastProvider>
          </InvalidateOnBlock>
        </WalletConnectProvider>
      </ApiPromiseContext.Provider>
    </TooltipProvider>
  )
}
