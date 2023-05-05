import { Header } from "components/Layout/Header/Header"
import {
  SPage,
  SPageContent,
  SPageInner,
} from "components/Layout/Page/Page.styled"
import { ReactNode } from "react"
import { ProviderSelectButton } from "sections/provider/ProviderSelectModal"
import { MobileNavBar } from "../Header/MobileNavBar/MobileNavBar"
import { useApiPromise } from "utils/api"
import { isApiLoaded } from "utils/helpers"

export const Page = ({ children }: { children: ReactNode }) => {
  const api = useApiPromise()
  return (
    <SPage>
      <Header />
      <SPageContent>
        <SPageInner>{children}</SPageInner>
        {isApiLoaded(api) ? <ProviderSelectButton /> : null}
      </SPageContent>
      <MobileNavBar />
    </SPage>
  )
}
