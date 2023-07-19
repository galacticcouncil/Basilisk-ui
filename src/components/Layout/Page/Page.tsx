import { Header } from "components/Layout/Header/Header"
import {
  SPage,
  SPageContent,
  SPageInner,
} from "components/Layout/Page/Page.styled"
import { ReactNode } from "react"
import { MobileNavBar } from "../Header/MobileNavBar/MobileNavBar"

import { ProviderSelectButton } from "sections/provider/components/ProviderSelectButton/ProviderSelectButton"

export const Page = ({ children }: { children: ReactNode }) => {
  return (
    <SPage>
      <Header />
      <SPageContent>
        <SPageInner>{children}</SPageInner>
        <ProviderSelectButton />
      </SPageContent>
      <MobileNavBar />
    </SPage>
  )
}
