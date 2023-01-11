import { FC } from "react"
import { SWalletButton } from "sections/wallet/connect/providers/WalletConnectProviders.styled"
import { Text } from "components/Typography/Text/Text"
import { css } from "@emotion/react"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { ReactComponent as DownloadIcon } from "assets/icons/DownloadIcon.svg"
import { useTranslation } from "react-i18next"
import { Wallet } from "@talismn/connect-wallets"

type Props = {
  wallet: Wallet
  onClick: () => void
  isInjected: boolean
}

export const WalletConnectProvidersButton: FC<Props> = ({
  wallet,
  onClick,
  isInjected,
}) => {
  const { t } = useTranslation()

  let walletMeta = {
    title: wallet.title,
    variant: wallet.extensionName,

    logo: {
      src: wallet.logo.src,
      alt: wallet.logo.alt,
    },
  } as const

  // Nova Wallet acts as polkadot-js wallet
  // But uses the same extension name, thus we need to just
  // override the label
  if (
    wallet.extensionName === "polkadot-js" &&
    window.walletExtension?.isNovaWallet
  ) {
    walletMeta = {
      ...walletMeta,
      variant: "nova-wallet",
      logo: {
        src: `data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='16' fill='url(%23paint0_linear_108_351)'/%3E%3Cpath d='M15.6222 6.5634C15.5937 6.43205 15.4063 6.43205 15.3778 6.5634L14.0382 12.742C13.789 13.8913 12.8913 14.789 11.742 15.0382L5.5634 16.3778C5.43205 16.4063 5.43205 16.5937 5.5634 16.6222L11.742 17.9618C12.8913 18.211 13.789 19.1087 14.0382 20.258L15.3778 26.4366C15.4063 26.5679 15.5937 26.5679 15.6222 26.4366L16.9618 20.258C17.211 19.1087 18.1087 18.211 19.258 17.9618L25.4366 16.6222C25.5679 16.5937 25.5679 16.4063 25.4366 16.3778L19.258 15.0382C18.1087 14.789 17.211 13.8913 16.9618 12.742L15.6222 6.5634Z' fill='white'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_108_351' x1='7' y1='32' x2='24' y2='-8.12113e-07' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%237CBAE5'/%3E%3Cstop offset='0.416667' stop-color='%233A56D1'/%3E%3Cstop offset='0.703125' stop-color='%23461764'/%3E%3Cstop offset='0.911458' stop-color='%23171523'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A`,
        alt: "Nova Wallet",
      },
      title: "Nova Wallet",
    }
  }

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
