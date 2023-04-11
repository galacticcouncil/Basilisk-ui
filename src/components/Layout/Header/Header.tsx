import { ReactComponent as BasiliskIcon } from "assets/icons/BasiliskIcon.svg"
import { ReactComponent as BasiliskLogo } from "assets/icons/BasiliskLogo.svg"
import { Icon } from "components/Icon/Icon"
import { HeaderMenu } from "components/Layout/Header/menu/HeaderMenu"
import {
  SHeader,
  SIconButton,
  STooltip,
} from "components/Layout/Header/Header.styled"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { ReactComponent as BellIcon } from "assets/icons/BellIcon.svg"
import { useToast } from "state/toasts"
import { useTranslation } from "react-i18next"
import { Spinner } from "components/Spinner/Spinner.styled"
import * as Tooltip from "@radix-ui/react-tooltip"

export const Header = () => {
  const { setSidebar, toasts } = useToast()
  const { t } = useTranslation()

  const loadingToasts = toasts.filter((toast) => toast.variant === "progress")

  const isLoadingToast = !!loadingToasts.length

  const bellIcon = (
    <SIconButton
      icon={<BellIcon />}
      name={t("toast.sidebar.title")}
      onClick={() => setSidebar(true)}
      isLoading={isLoadingToast}
    />
  )
  return (
    <SHeader>
      <div sx={{ flex: "row", justify: "space-between", align: "center" }}>
        <div sx={{ flex: "row", align: "center" }}>
          <Icon size={32} icon={<BasiliskIcon />} sx={{ mr: 11 }} />
          <Icon sx={{ mr: 60, display: ["none", "inherit"] }}>
            <BasiliskLogo />
          </Icon>
          <HeaderMenu />
        </div>

        <div sx={{ flex: "row", align: "center", gap: [12, 24] }}>
          {isLoadingToast ? (
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div css={{ position: "relative" }}>
                  {isLoadingToast && <Spinner width={40} height={40} />}
                  {bellIcon}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <STooltip>
                  {t("toast.sidebar.pendingAmount", {
                    amount: loadingToasts.length,
                  })}
                </STooltip>
                <Tooltip.Arrow css={{ "& > polygon": { fill: "#ABE67E" } }} />
              </Tooltip.Content>
            </Tooltip.Root>
          ) : (
            bellIcon
          )}

          <WalletConnectButton />
        </div>
      </div>
    </SHeader>
  )
}
