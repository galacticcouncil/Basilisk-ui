import { BasiliskIcon } from "assets/icons/tokens/BasiliskIcon"
import { BasiliskLogo } from "assets/icons/BasiliskLogo"
import { Box } from "components/Box/Box"
import { Icon } from "components/Icon/Icon"
import { MenuList } from "./MenuList/MenuList"
import { StyledLoginButton, StyledHeader } from "./Header.styled"
import { useState } from "react"
import { Spinner } from "components/Spinner/Spinner"

import { WalletConnectModal } from "pages/WalletConnectModal/WalletConnectModal"

const menuItems = [
  {
    text: "Trade",
    active: false,
  },
  { text: "Pools & Farms", active: true },
  { text: "Wallet", active: false },
]

export const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <StyledHeader>
      <Box flex spread acenter>
        <Box flex acenter>
          <Icon size={32} mr={11} icon={<BasiliskIcon />} />
          <Icon height={21} mr={60}>
            <BasiliskLogo />
          </Icon>
          <MenuList items={menuItems} />
        </Box>

        <Box>
          <StyledLoginButton onClick={() => setOpen(true)}>
            <Spinner />
            Connect wallet
          </StyledLoginButton>

          <WalletConnectModal isOpen={open} onClose={() => setOpen(false)} />
        </Box>
      </Box>
    </StyledHeader>
  )
}
