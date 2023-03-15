import { LoadingPage } from "sections/loading/LoadingPage"
import { InvalidateOnBlock } from "components/InvalidateOnBlock"
import { ApiPromiseContext } from "utils/api"
import { FC, PropsWithChildren } from "react"
import { useProvider, useProviderRpcUrlStore } from "api/provider"
import { ToastProvider } from "components/Toast/ToastProvider"
import { Transactions } from "sections/transaction/Transactions"
import { Provider as TooltipProvider } from "@radix-ui/react-tooltip"
import { SkeletonTheme } from "react-loading-skeleton"
import { theme } from "theme"
import { GcTransactionCenter } from "sections/gcapps/TransactionCenter"

export const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  const preference = useProviderRpcUrlStore()
  const api = useProvider(preference.rpcUrl)

  if (!preference._hasHydrated || !api.data) return <LoadingPage />

  return (
    <TooltipProvider>
      <ApiPromiseContext.Provider value={api.data}>
        <InvalidateOnBlock>
          <ToastProvider>
            <SkeletonTheme
              baseColor={`rgba(${theme.rgbColors.white}, 0.12)`}
              highlightColor={`rgba(${theme.rgbColors.white}, 0.24)`}
              borderRadius={9999}
            >
              <GcTransactionCenter>{children}</GcTransactionCenter>
              <Transactions />
            </SkeletonTheme>
          </ToastProvider>
        </InvalidateOnBlock>
      </ApiPromiseContext.Provider>
    </TooltipProvider>
  )
}
