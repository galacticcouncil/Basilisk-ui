import { FC } from "react"
import { ReactNode } from "react"
import { Header } from "./Header/Header"
import { SPage, PageInner, PageContent } from "./Page.styled"

type PageProps = {
  children: ReactNode
}

export const Page: FC<PageProps> = ({ children }) => (
  <SPage>
    <Header />
    <PageContent>
      <PageInner>{children}</PageInner>
    </PageContent>
  </SPage>
)
