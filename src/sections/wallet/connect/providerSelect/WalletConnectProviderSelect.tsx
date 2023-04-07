import { Wallet } from "@talismn/connect-wallets"
import { Text } from "components/Typography/Text/Text"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { WalletConnectProviders } from "sections/wallet/connect/providers/WalletConnectProviders"
import { ExternalWalletConnectProviderButton } from "../providers/button/ExternalWalletConnectProviderButton"
import { ExternalWalletConnectModal } from "../modal/ExternalWalletConnectModal"

type Props = {
  onWalletSelect: (wallet: Wallet) => void
  onClose: () => void
}

export const WalletConnectProviderSelect = ({
  onWalletSelect,
  onClose,
}: Props) => {
  const { t } = useTranslation("translation")
  const [isAddExternalWallet, setAddExternalWallet] = useState(false)

  return (
    <>
      {!isAddExternalWallet ? (
        <>
          <Text fw={400} color="neutralGray200" sx={{ mt: 6, mb: 36 }}>
            {t("walletConnect.provider.description")}
          </Text>

          <WalletConnectProviders
            onConnect={onWalletSelect}
            onDownload={(wallet) => window.open(wallet.installUrl, "_blank")}
          />

          <Text sx={{ py: 8 }} fs={14} color="neutralGray400" tAlign="center">
            {t("or")}
          </Text>

          <ExternalWalletConnectProviderButton
            onClick={() => setAddExternalWallet(true)}
          />
        </>
      ) : (
        <ExternalWalletConnectModal
          onBack={() => setAddExternalWallet(false)}
          onClose={onClose}
        />
      )}
    </>
  )
}
