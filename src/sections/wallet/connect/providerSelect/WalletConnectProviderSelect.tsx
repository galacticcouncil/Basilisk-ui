import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { WalletConnectProviders } from "sections/wallet/connect/providers/WalletConnectProviders"
import { FC } from "react"
import { Wallet } from "@talismn/connect-wallets"

type Props = {
  onWalletSelect: (wallet: Wallet) => void
}

export const WalletConnectProviderSelect: FC<Props> = ({ onWalletSelect }) => {
  const { t } = useTranslation("translation")

  return (
    <>
      <Text fw={400} color="neutralGray200" sx={{ mt: 6, mb: 24 }}>
        {t("walletConnect.provider.description")}
      </Text>

      <WalletConnectProviders
        onConnect={onWalletSelect}
        onDownload={(wallet) => window.open(wallet.installUrl, "_blank")}
      />
    </>
  )
}
