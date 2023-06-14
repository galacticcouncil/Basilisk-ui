import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"
import { getWalletBySource } from "@talismn/connect-wallets"
import { useNavigate } from "@tanstack/react-location"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { AddressInput } from "components/AddressInput/AddressInput"
import { Button } from "components/Button/Button"
import { ModalMeta } from "components/Modal/Modal"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import {
  PROXY_WALLET_PROVIDER,
  externalWallet,
  useAccountStore,
} from "state/store"
import {
  BASILISK_ADDRESS_PREFIX,
  POLKADOT_APP_NAME,
  useApiPromise,
} from "utils/api"
import { safeConvertAddressSS58 } from "utils/formatting"
import { FormValues } from "utils/helpers"

type ExternalWalletConnectModalProps = {
  onBack: () => void
  onClose: () => void
}

export const ExternalWalletConnectModal = ({
  onBack,
  onClose,
}: ExternalWalletConnectModalProps) => {
  const api = useApiPromise()
  const { t } = useTranslation()
  const { setAccount } = useAccountStore()
  const navigate = useNavigate()

  const form = useForm<{
    address: string
    delegates: boolean
  }>({})

  // means that a user already knows that he doesn't have delegates
  const isDelegatesError = form.formState.errors.delegates

  const onSubmit = async (values: FormValues<typeof form>) => {
    const [delegates] = await api.query.proxy.proxies(values.address)
    const delegateList = delegates?.map((delegate) => delegate)
    let isDelegate = false

    if (!!delegateList.length) {
      const wallet = getWalletBySource(PROXY_WALLET_PROVIDER)

      if (wallet?.installed) {
        await wallet?.enable(POLKADOT_APP_NAME)

        const accounts = await wallet?.getAccounts()

        isDelegate = accounts?.some((account) =>
          delegateList.find(
            (delegateObj) =>
              delegateObj.delegate.toString() ===
              encodeAddress(
                decodeAddress(account.address),
                BASILISK_ADDRESS_PREFIX,
              ),
          ),
        )
      }
    }

    if (!!delegateList.length && !isDelegate && !isDelegatesError) {
      form.setError("delegates", {})
      return
    }

    setAccount({
      address: values.address,
      name:
        delegateList.length && isDelegate
          ? externalWallet.proxyName
          : externalWallet.name,
      provider: externalWallet.provider,
      isExternalWalletConnected: true,
    })

    navigate({
      search: { account: values.address },
      fromCurrent: true,
    })

    if (!delegateList.length || (delegateList.length && isDelegatesError)) {
      onClose()
    }
  }
  return (
    <>
      <ModalMeta
        title={t("walletConnect.externalWallet.modal.title")}
        secondaryIcon={{
          icon: <ChevronRight css={{ transform: "rotate(180deg)" }} />,
          name: "Back",
          onClick: onBack,
        }}
      />
      <Text color="neutralGray100">
        {t("walletConnect.externalWallet.modal.desc")}
      </Text>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        sx={{ flex: "column", justify: "space-between", height: "100%" }}
      >
        <Controller
          name="address"
          control={form.control}
          rules={{
            required: t("wallet.assets.transfer.error.required"),
            validate: {
              validAddress: (value) =>
                safeConvertAddressSS58(value, 0) != null ||
                t("wallet.assets.transfer.error.validAddress"),
            },
          }}
          render={({
            field: { name, value, onChange },
            fieldState: { error },
          }) => {
            return (
              <div>
                <AddressInput
                  name={name}
                  onChange={(value) => {
                    onChange(value)
                    form.clearErrors("delegates")
                  }}
                  value={value}
                  placeholder={t(
                    "walletConnect.externalWallet.modal.input.placeholder",
                  )}
                  css={{ width: "100%", height: 35, padding: "0 10px" }}
                  error={error?.message}
                />
              </div>
            )
          }}
        />
        <Controller
          name="delegates"
          control={form.control}
          render={({ fieldState: { error } }) =>
            error ? (
              <>
                <Spacer size={15} />
                <Text color="red400" fs={12}>
                  {t("walletConnect.accountSelect.proxyAccount.error")}
                </Text>
                <Spacer size={6} />
                <Text fw={400} color="red400" fs={12}>
                  {t("walletConnect.accountSelect.proxyAccount.errorDesc")}
                </Text>
              </>
            ) : (
              <div />
            )
          }
        />
        <Spacer size={35} />
        <Button
          disabled={!!form.formState.errors.address}
          variant="primary"
          type="submit"
        >
          {form.formState.errors.delegates
            ? t("walletConnect.accountSelect.viewAsWallet")
            : t("confirm")}
        </Button>
      </form>
    </>
  )
}
