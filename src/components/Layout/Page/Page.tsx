import { Header } from "components/Layout/Header/Header"
import {
  SPage,
  SPageContent,
  SPageInner,
} from "components/Layout/Page/Page.styled"
import { ReactNode } from "react"
import { ProviderSelectButton } from "sections/provider/ProviderSelectModal"
import { MobileNavBar } from "../Header/MobileNavBar/MobileNavBar"

export const Page = ({ children }: { children: ReactNode }) => (
  <SPage>
    <Header />
    <SPageContent>
      <SPageInner>{children}</SPageInner>
      <ProviderSelectButton />
    </SPageContent>
    <MobileNavBar />
  </SPage>
)
