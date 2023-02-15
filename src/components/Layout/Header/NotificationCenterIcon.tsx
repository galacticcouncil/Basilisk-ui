import * as Tooltip from "@radix-ui/react-tooltip"
import {
  RESET_TOAST_TIMING,
  useToastStorage,
} from "components/AppProviders/ToastContext"
import { Spinner } from "components/Spinner/Spinner.styled"
import { SIconButton, STooltip } from "./Header.styled"
import { useTranslation } from "react-i18next"
import { ReactComponent as BellIcon } from "assets/icons/BellIcon.svg"
import { useEffect } from "react"

export const NotificationCenterIcon = () => {
  const { t } = useTranslation()
  const { setSidebar, toasts, unknown } = useToastStorage()
  const loadingToasts = toasts.filter((toast) => toast.variant === "progress")

  const isLoadingToast = !!loadingToasts.length

  useEffect(() => {
    if (isLoadingToast) {
      setTimeout(() => {
        unknown(loadingToasts[0].id)
      }, RESET_TOAST_TIMING)
    }
  }, [isLoadingToast, loadingToasts, unknown])

  const bellIcon = (
    <SIconButton
      icon={<BellIcon />}
      name={t("toast.sidebar.title")}
      onClick={() => setSidebar(true)}
      isLoading={isLoadingToast}
    />
  )

  return isLoadingToast ? (
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
  )
}
