import { Modal } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import { FC, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { POLKADOT_APP_NAME } from "utils/api"
import { WalletConnectConfirmPending } from "sections/wallet/connect/confirmPending/WalletConnectConfirmPending"
import { WalletConnectProviderSelect } from "sections/wallet/connect/providerSelect/WalletConnectProviderSelect"
import { WalletConnectAccountSelect } from "sections/wallet/connect/accountSelect/WalletConnectAccountSelect"
import { externalWallet, useAccountStore } from "state/store"
import { WalletConnectActiveFooter } from "./WalletConnectActiveFooter"
import { Wallet } from "@talismn/connect-wallets"
import { useNavigate } from "@tanstack/react-location"

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const WalletConnectModal: FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("translation")
  const navigate = useNavigate()
  const [userSelectedProvider, setUserSelectedProvider] = useState<
    string | null
  >(null)

  const mutate = useMutation(
    ["web3Enable", userSelectedProvider],
    async (wallet: Wallet) => wallet.enable(POLKADOT_APP_NAME),
    { onError: () => setUserSelectedProvider(null) },
  )

  const { account, setAccount } = useAccountStore()
  const activeProvider = userSelectedProvider ?? account?.provider

  const modalProps = userSelectedProvider
    ? mutate.isLoading
      ? { title: "" }
      : { title: t("walletConnect.accountSelect.title") }
    : { title: t("walletConnect.provider.title") }

  return (
    <Modal
      width={460}
      open={isOpen}
      onClose={() => {
        setUserSelectedProvider(null)
        onClose()
      }}
      {...modalProps}
    >
      {activeProvider ? (
        activeProvider !== externalWallet.provider && mutate.isLoading ? (
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
            />
            <WalletConnectActiveFooter
              account={account}
              provider={activeProvider}
              onLogout={() => {
                setUserSelectedProvider(null)
                setAccount(undefined)
                onClose()
                navigate({
                  search: undefined,
                  fromCurrent: true,
                })
              }}
              onSwitch={() => {
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
            mutate.mutate(wallet)
          }}
          onClose={onClose}
        />
      )}
    </Modal>
  )
}
