import { Link, useSearch } from "@tanstack/react-location"
import { SItem, SList } from "components/Layout/Header/menu/HeaderMenu.styled"
import { useTranslation } from "react-i18next"
import { MENU_ITEMS } from "utils/navigation"

export const HeaderMenu = () => {
  const { t } = useTranslation()
  const { account } = useSearch()

  return (
    <SList>
      {MENU_ITEMS.map((item, i) => {
        if (!item.enabled) {
          return null
        }
        if (item.external) {
          return (
            <a href={item.href} key={i}>
              <SItem>{t(item.translationKey)}</SItem>
            </a>
          )
        }

        return (
          <Link
            key={i}
            to={item.href}
            search={account ? { account } : undefined}
          >
            {({ isActive }) => (
              <SItem isActive={isActive}>{t(item.translationKey)}</SItem>
            )}
          </Link>
        )
      })}
    </SList>
  )
}
