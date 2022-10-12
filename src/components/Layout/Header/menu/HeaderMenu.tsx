import { SItem, SList } from "components/Layout/Header/menu/HeaderMenu.styled"
import { useTranslation } from "react-i18next"
import { EXTERNAL_LINKS, LINKS } from "utils/links"
import { Link } from "@tanstack/react-location"
import { MENU_ITEMS } from "utils/tabs"

export const HeaderMenu = () => {
  const { t } = useTranslation("translation")

  const items = [
    { text: t("header.lbp"), href: EXTERNAL_LINKS.lbp },
    { text: t("header.trade"), href: EXTERNAL_LINKS.swap },
    { text: t("header.wallet"), to: LINKS.wallet },
    { text: t("header.pools"), to: LINKS.pools_and_farms },
    { text: t("header.bridge"), href: EXTERNAL_LINKS.bridge },
  ]

  return (
    <SList>
      {items.map((item, i) => {
        if (item.href) {
          return (
            <a href={item.href} key={i}>
              <SItem>{item.text}</SItem>
            </a>
          )
        }

        return (
          <Link to={item.to} key={i}>
            {({ isActive }) => <SItem isActive={isActive}>{item.text}</SItem>}
          </Link>
        )
      })}
      {MENU_ITEMS.map((item, i) => (
        <SItem key={i} isActive={item.active} href={item.href}>
          {t(item.translationKey)}
        </SItem>
      ))}
    </SList>
  )
}
