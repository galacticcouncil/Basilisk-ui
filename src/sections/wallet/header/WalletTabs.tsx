import { useSearch } from "@tanstack/react-location"
import { ReactComponent as AssetsIcon } from "assets/icons/AssetsIcon.svg"
import { ReactComponent as PositionsIcon } from "assets/icons/PositionsIcon.svg"
import { TabLink } from "components/Tabs/TabLink"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-use"
import { theme } from "theme"
import { LINKS } from "utils/navigation"

export const WalletTabs = () => {
  const { t } = useTranslation()
  const search = useSearch()
  const isDesktop = useMedia(theme.viewport.gte.sm)

  return (
    <div
      sx={{
        flex: "row",
        justify: ["space-between", "start"],
        mt: 18,
        gap: 10,
      }}
    >
      <TabLink
        fullWidth={!isDesktop}
        to={LINKS.walletAssets}
        icon={<AssetsIcon />}
        search={search}
      >
        {t("wallet.header.assets")}
      </TabLink>
      <TabLink
        fullWidth={!isDesktop}
        to={LINKS.walletVesting}
        icon={<PositionsIcon />}
        search={search}
      >
        {t("wallet.header.vesting")}
      </TabLink>
    </div>
  )
}
