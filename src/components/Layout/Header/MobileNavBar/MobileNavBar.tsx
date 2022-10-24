import { useTranslation } from "react-i18next"
import { Icon } from "components/Icon/Icon"
import { Link } from "@tanstack/react-location"
import { ReactComponent as PoolsAndFarmsIcon } from "assets/icons/PoolsAndFarms.svg"
import { ReactComponent as TradeIcon } from "assets/icons/Trade.svg"
import { ReactComponent as WalletIcon } from "assets/icons/Wallet.svg"
import { ReactComponent as LBPIcon } from "assets/icons/LBPIcon.svg"
import { ReactComponent as BridgeIcon } from "assets/icons/BridgeIcon.svg"
import { MENU_ITEMS, TabKeys } from "utils/tabs"
import {
  SMobileNavBar,
  SNavBarItem,
  SNavBarItemHidden,
} from "./MobileNavBar.styled"
import { MoreButton } from "./MoreButton"

export const MobileNavBar = () => {
  const { t } = useTranslation()

  const getIcon = (name: TabKeys) => {
    if (name === "trade") return <TradeIcon />
    if (name === "pools") return <PoolsAndFarmsIcon />
    if (name === "wallet") return <WalletIcon />
    if (name === "lbp") return <LBPIcon />
    if (name === "bridge") return <BridgeIcon />

    return null
  }

  const visibleTabs = MENU_ITEMS.slice(0, 3)
  const hiddenTabs = MENU_ITEMS.slice(3).map((hiddenTab, index) => (
    <SNavBarItemHidden href={hiddenTab.href} key={index}>
      <Icon size={20} icon={getIcon(hiddenTab.key)} />
      {t(hiddenTab.translationKey)}
    </SNavBarItemHidden>
  ))

  return (
    <SMobileNavBar>
      {visibleTabs.map((item, index) => {
        if (item.external) {
          return (
            <a href={item.href} key={index}>
              <SNavBarItem key={index}>
                <Icon size={20} icon={getIcon(item.key)} />
                {t(item.translationKey)}
              </SNavBarItem>
            </a>
          )
        }

        return (
          <Link to={item.href} key={index}>
            {({ isActive }) => (
              <SNavBarItem key={index} active={isActive}>
                <Icon size={20} icon={getIcon(item.key)} />
                {t(item.translationKey)}
              </SNavBarItem>
            )}
          </Link>
        )
      })}
      <MoreButton tabs={hiddenTabs} />
    </SMobileNavBar>
  )
}
