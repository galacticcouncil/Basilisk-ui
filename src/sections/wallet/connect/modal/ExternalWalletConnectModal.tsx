import { useNavigate } from "@tanstack/react-location"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { AddressInput } from "components/AddressInput/AddressInput"
import { Button } from "components/Button/Button"
import { ModalMeta } from "components/Modal/Modal"
import { Text } from "components/Typography/Text/Text"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { externalWallet, useAccountStore } from "state/store"
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
  const { t } = useTranslation()
  const { setAccount } = useAccountStore()
  const navigate = useNavigate()

  const form = useForm<{
    address: string
  }>({})

  const onSubmit = async (values: FormValues<typeof form>) => {
    setAccount({
      address: values.address,
      name: externalWallet.name,
      provider: externalWallet.provider,
      isExternalWalletConnected: true,
    })
    onClose()
    navigate({
      search: { account: values.address },
      fromCurrent: true,
    })
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
                  onChange={onChange}
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
        <Button
          disabled={!!form.formState.errors.address}
          variant="primary"
          type="submit"
        >
          {t("confirm")}
        </Button>
      </form>
    </>
  )
}
