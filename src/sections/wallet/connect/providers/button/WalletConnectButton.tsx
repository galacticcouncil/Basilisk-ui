import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { ReactComponent as WalletConnect } from "assets/icons/WalletConnect.svg"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { SWalletButton } from "../WalletConnectProviders.styled"
import { Icon } from "components/Icon/Icon"
import { theme } from "theme"

type Props = { onClick: () => void }

export const WalletConnectWCButton = ({ onClick }: Props) => {
  const { t } = useTranslation()

  return (
    <SWalletButton onClick={onClick} variant="external">
      <Icon size={40} icon={<WalletConnect />} />

      <Text fs={18} css={{ flexGrow: 1 }}>
        {t("walletConnect.wc")}
      </Text>

      <Text
        fs={14}
        tAlign="right"
        sx={{ flex: "row", align: "center", gap: 4 }}
      >
        {t("walletConnect.provider.continue")}
        <Icon
          css={{ color: theme.colors.neutralGray300 }}
          icon={<ChevronRight />}
        />
      </Text>
    </SWalletButton>
  )
}
