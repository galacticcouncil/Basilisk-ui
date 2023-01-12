import { FC } from "react"
import { SWalletButton } from "sections/wallet/connect/providers/WalletConnectProviders.styled"
import { Text } from "components/Typography/Text/Text"
import { css } from "@emotion/react"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { ReactComponent as DownloadIcon } from "assets/icons/DownloadIcon.svg"
import { useTranslation } from "react-i18next"
import { Wallet } from "@talismn/connect-wallets"
import { getWalletMeta } from "sections/wallet/connect/modal/WalletConnectModal.utils"

type Props = {
  wallet: Wallet
  onClick: () => void
  isInjected: boolean
  isNovaWallet: boolean
}

export const WalletConnectProvidersButton: FC<Props> = ({
  wallet,
  onClick,
  isInjected,
  isNovaWallet,
}) => {
  const { t } = useTranslation()
  const walletMeta = getWalletMeta(wallet, isNovaWallet)

  if (!walletMeta) return null
  return (
    <SWalletButton onClick={onClick} variant={walletMeta.variant}>
      <img
        src={walletMeta.logo.src}
        alt={walletMeta.logo.alt}
        width={40}
        height={40}
      />
      <Text fs={18} css={{ flexGrow: 1 }}>
        {walletMeta.title}
      </Text>

      <Text
        color="neutralGray300"
        fs={14}
        tAlign="right"
        css={css`
          display: flex;
          align-items: center;
          gap: 4px;
        `}
      >
        {isInjected ? (
          <>
            {t("walletConnect.provider.continue")}
            <ChevronRight />
          </>
        ) : (
          <>
            {t("walletConnect.provider.download")}
            <DownloadIcon />
          </>
        )}
      </Text>
    </SWalletButton>
  )
}
