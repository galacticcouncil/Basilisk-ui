import { SItem, SList } from "components/Layout/Header/menu/HeaderMenu.styled"
import { useTranslation } from "react-i18next"
import { menuItems } from "utils/tabs"

export const HeaderMenu = () => {
  const { t } = useTranslation("translation")

  return (
    <SList>
      {menuItems.map((item, i) => (
        <SItem key={i} isActive={item.active} href={item.href}>
          {t(item.translationKey)}
        </SItem>
      ))}
    </SList>
  )
}
