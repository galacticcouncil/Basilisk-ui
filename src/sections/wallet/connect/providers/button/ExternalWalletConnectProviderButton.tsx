import { Icon } from "components/Icon/Icon"
import { SWalletButton } from "../WalletConnectProviders.styled"
import { ReactComponent as ExternalWalletIcon } from "assets/icons/ExternalWalletIcon.svg"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { theme } from "theme"

export const ExternalWalletConnectProviderButton = ({
  onClick,
}: {
  onClick: () => void
}) => {
  const { t } = useTranslation()
  return (
    <SWalletButton variant="external" onClick={onClick} css={{ width: "100%" }}>
      <Icon icon={<ExternalWalletIcon />} />
      <Text fs={18} css={{ flexGrow: 1 }}>
        {t("walletConnect.externalWallet")}
      </Text>
      <Icon
        css={{ color: theme.colors.neutralGray300 }}
        icon={<ChevronRight />}
      />
    </SWalletButton>
  )
}
