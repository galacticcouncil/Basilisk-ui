import { ReactComponent as BasiliskIcon } from "assets/icons/BasiliskIcon.svg"
import { ReactComponent as BasiliskLogo } from "assets/icons/BasiliskLogo.svg"
import { ReactComponent as LinkIcon } from "assets/icons/LinkIcon.svg"
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
import { useMedia } from "react-use"
import { theme } from "theme"
import { useState } from "react"
import { FundWalletButton } from "../../FundWallet/FundWalletButton"
import { FundWalletModal } from "../../FundWallet/FundWalletModal"
import { WarningMessage } from "components/WarningMessage/WarningMessage"
import { useWarningsStore } from "components/WarningMessage/WarningMessage.utils"
import { Text } from "components/Typography/Text/Text"

export const Header = () => {
  const [isFundModalOpen, setIsFundModalOpen] = useState(false)
  const isDesktop = useMedia(theme.viewport.gte.sm)
  const { setSidebar, toasts } = useToast()
  const { t } = useTranslation()

  const warnings = useWarningsStore()

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
  const isWarningVisible = warnings.warnings.depeg.visible

  return (
    <div css={{ position: "sticky", top: 0, zIndex: 5 }}>
      {isWarningVisible && (
        <WarningMessage
          type="depeg"
          text={t("depeg.modal.desx")}
          modalContent={
            <div sx={{ flex: "column" }}>
              <Text sx={{ mt: 24 }}>{t("depeg.modal.desx")}</Text>
              <a
                href="https://tether.to/en/tether-makes-strategic-transition-to-meet-community-demands-and-foster-innovation/"
                target="_blank"
                rel="noreferrer noopener"
                sx={{
                  flex: "row",
                  align: "center",
                  gap: 4,
                  color: "neutralGray300",
                  mt: 20,
                }}
                css={{ textDecoration: "underline" }}
              >
                <Text fs={12} color="neutralGray300">
                  {t("depeg.modal.icon")}
                </Text>
                <Icon sx={{ color: "neutralGray300" }} icon={<LinkIcon />} />
              </a>
            </div>
          }
        />
      )}
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

            {isDesktop && (
              <>
                <FundWalletButton onClick={() => setIsFundModalOpen(true)} />
                <FundWalletModal
                  open={isFundModalOpen}
                  onClose={() => setIsFundModalOpen(false)}
                />
              </>
            )}

            <WalletConnectButton />
          </div>
        </div>
      </SHeader>
    </div>
  )
}
