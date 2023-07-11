import { Modal } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import { FC, useState } from "react"

import { WalletConnectConfirmPending } from "sections/wallet/connect/confirmPending/WalletConnectConfirmPending"
import { WalletConnectProviderSelect } from "sections/wallet/connect/providerSelect/WalletConnectProviderSelect"
import { WalletConnectAccountSelect } from "sections/wallet/connect/accountSelect/WalletConnectAccountSelect"
import { externalWallet, useAccountStore } from "state/store"
import { WalletConnectActiveFooter } from "./WalletConnectActiveFooter"
import { useNavigate } from "@tanstack/react-location"
import { useEnableWallet } from "./WalletConnectModal.utils"
import { useWalletConnect } from "components/WalletConnectProvider/WalletConnectProvider"
import { FundWalletModal } from 'components/FundWallet/FundWalletModal'
import { useMedia } from 'react-use'
import { theme } from 'theme'
import { FundWalletMobileButton } from 'components/FundWallet/FundWalletMobileButton'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const WalletConnectModal: FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()

  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const isMobile = useMedia(theme.viewport.lt.sm)

  const navigate = useNavigate()
  const [userSelectedProvider, setUserSelectedProvider] = useState<
    string | null
  >(null)

  const enableWallet = useEnableWallet({
    provider: userSelectedProvider,
    onError: () => setUserSelectedProvider(null),
  })

  const { account, setAccount } = useAccountStore()
  const activeProvider = userSelectedProvider ?? account?.provider

  const { wallet } = useWalletConnect()

  const [isWCConnecting, setIsWCConnecting] = useState(false)

  const onWalletConnect = async () => {
    setIsWCConnecting(true)

    try {
      await wallet?.connect()

      setUserSelectedProvider("WalletConnect")
    } catch (e) {}

    setIsWCConnecting(false)
  }

  const isConnecting = enableWallet.isLoading || isWCConnecting

  const modalProps = userSelectedProvider
    ? isConnecting
      ? { title: "" }
      : { title: t("walletConnect.accountSelect.title") }
    : { title: t("walletConnect.provider.title") }

  return (
    <Modal
      width={460}
      open={isOpen}
      withoutCloseOutside
      onClose={() => {
        setUserSelectedProvider(null)
        onClose()
      }}
      {...modalProps}
    >
      {activeProvider ? (
        activeProvider !== externalWallet.provider && isConnecting ? (
          <WalletConnectConfirmPending provider={activeProvider} />
        ) : (
          <>
            <WalletConnectAccountSelect
              currentAddress={account?.address.toString()}
              provider={activeProvider}
              onSelect={(account) => {
                setUserSelectedProvider(null)
                setAccount(account)
                onClose()
              }}
              onClose={onClose}
            />

            {isMobile && (
              <>
                <FundWalletMobileButton onClick={() => setIsFundModalOpen(true)} />
                <FundWalletModal open={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} />
              </>
            )}

            <WalletConnectActiveFooter
              account={account}
              provider={activeProvider}
              onLogout={() => {
                setUserSelectedProvider(null)
                setAccount(undefined)
                wallet?.disconnect()
                onClose()
                navigate({
                  search: undefined,
                  fromCurrent: true,
                })
              }}
              onSwitch={() => {
                wallet?.disconnect()
                setUserSelectedProvider(null)
                setAccount(undefined)
                navigate({
                  search: undefined,
                  fromCurrent: true,
                })
              }}
            />
          </>
        )
      ) : (
        <WalletConnectProviderSelect
          onWalletSelect={(wallet) => {
            setUserSelectedProvider(wallet.extensionName)
            enableWallet.mutate(wallet)
          }}
          onClose={onClose}
          onWalletConnect={onWalletConnect}
        />
      )}
    </Modal>
  )
}
