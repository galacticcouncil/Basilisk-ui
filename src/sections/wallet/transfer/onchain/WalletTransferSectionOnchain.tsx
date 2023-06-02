import { u32 } from "@polkadot/types"
import { useAssetMeta } from "api/assetMeta"
import { ReactComponent as IconWallet } from "assets/icons/Wallet.svg"
import BigNumber from "bignumber.js"
import { Alert } from "components/Alert/Alert"
import { Button } from "components/Button/Button"
import { ModalMeta } from "components/Modal/Modal"
import { Separator } from "components/Separator/Separator"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { useState } from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { WalletTransferAccountInput } from "sections/wallet/transfer/WalletTransferAccountInput"
import { WalletTransferAssetSelect } from "sections/wallet/transfer/WalletTransferAssetSelect"
import { useAccountStore, useStore } from "state/store"
import {
  BASILISK_ADDRESS_PREFIX,
  NATIVE_ASSET_ID,
  useApiPromise,
} from "utils/api"
import { BN_10 } from "utils/constants"
import { safeConvertAddressSS58, shortenAccountAddress } from "utils/formatting"
import { FormValues } from "utils/helpers"
import { SAddressBookButton } from "./WalletTransferSectionOnchain.styled"

type Props = {
  initialAsset: u32 | string
  onClose: () => void
  form: UseFormReturn<{ dest: string; amount: string }>
  openAddressBook: () => void
}

export const WalletTransferSectionOnchain = (props: Props) => {
  const { t } = useTranslation()
  const [asset, setAsset] = useState(props.initialAsset)

  const api = useApiPromise()
  const { createTransaction } = useStore()
  const { account } = useAccountStore()

  const assetMeta = useAssetMeta(asset)

  const onSubmit = async (values: FormValues<typeof props.form>) => {
    if (assetMeta.data?.decimals == null) throw new Error("Missing asset meta")

    const amount = new BigNumber(values.amount).multipliedBy(
      BN_10.pow(assetMeta.data?.decimals?.toString()),
    )

    return await createTransaction(
      {
        tx:
          asset === NATIVE_ASSET_ID
            ? api.tx.balances.transferKeepAlive(values.dest, amount.toFixed())
            : api.tx.tokens.transferKeepAlive(
                values.dest,
                asset,
                amount.toFixed(),
              ),
      },
      {
        toast: {
          onLoading: (
            <Trans
              t={t}
              i18nKey="wallet.assets.transfer.toast.onLoading"
              tOptions={{
                value: values.amount,
                symbol: assetMeta.data?.symbol,
                address: shortenAccountAddress(values.dest, 12),
              }}
            >
              <span />
              <span className="highlight" />
            </Trans>
          ),
          onSuccess: (
            <Trans
              t={t}
              i18nKey="wallet.assets.transfer.toast.onSuccess"
              tOptions={{
                value: values.amount,
                symbol: assetMeta.data?.symbol,
                address: shortenAccountAddress(values.dest, 12),
              }}
            >
              <span />
              <span className="highlight" />
            </Trans>
          ),
          onError: (
            <Trans
              t={t}
              i18nKey="wallet.assets.transfer.toast.onError"
              tOptions={{
                value: values.amount,
                symbol: assetMeta.data?.symbol,
                address: shortenAccountAddress(values.dest, 12),
              }}
            >
              <span />
              <span className="highlight" />
            </Trans>
          ),
        },
      },
    )
  }

  return (
    <>
      <ModalMeta title={t("wallet.assets.transfer.title")} />

      <Spacer size={[13, 26]} />

      <form
        onSubmit={props.form.handleSubmit(onSubmit)}
        sx={{ flex: "column" }}
      >
        <div sx={{ bg: "backgroundGray1000" }} css={{ borderRadius: 12 }}>
          <div sx={{ flex: "column", gap: 8, p: 20 }}>
            <Text fw={500}>{t("wallet.assets.transfer.from.label")}</Text>

            <WalletTransferAccountInput
              name="from"
              value={safeConvertAddressSS58(
                account?.address?.toString(),
                BASILISK_ADDRESS_PREFIX,
              )}
            />
          </div>

          <Separator color="backgroundGray900" />

          <div
            sx={{ flex: "column", gap: 8, p: 20 }}
            css={{ position: "relative" }}
          >
            <Text fw={500}>{t("wallet.assets.transfer.dest.label")}</Text>

            {props.openAddressBook && (
              <SAddressBookButton type="button" onClick={props.openAddressBook}>
                <Text fs={12} lh={16} color="neutralGray400">
                  {t("wallet.assets.transfer.dest.addressBook")}
                </Text>
                <IconWallet width={12} height={12} />
              </SAddressBookButton>
            )}

            <Controller
              name="dest"
              control={props.form.control}
              render={({
                field: { name, onChange, value, onBlur },
                fieldState: { error },
              }) => (
                <WalletTransferAccountInput
                  name={name}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                />
              )}
              rules={{
                required: t("wallet.assets.transfer.error.required"),
                validate: {
                  validAddress: (value) =>
                    safeConvertAddressSS58(value, 0) != null ||
                    t("wallet.assets.transfer.error.validAddress"),
                  notSame: (value) => {
                    if (!account?.address) return true
                    const from = safeConvertAddressSS58(
                      account.address.toString(),
                      0,
                    )
                    const to = safeConvertAddressSS58(value, 0)
                    if (from != null && to != null && from === to) {
                      return t("wallet.assets.transfer.error.notSame")
                    }
                    return true
                  },
                },
              }}
            />
          </div>
        </div>

        <Spacer size={10} />

        <div sx={{ flex: "column", gap: 10 }}>
          <Controller
            name="amount"
            control={props.form.control}
            render={({
              field: { name, value, onChange },
              fieldState: { error },
            }) => (
              <WalletTransferAssetSelect
                title={t("wallet.assets.transfer.asset.label")}
                name={name}
                value={value}
                onChange={onChange}
                asset={asset}
                onAssetChange={setAsset}
                error={error?.message}
              />
            )}
            rules={{
              validate: {
                validNumber: (value) => {
                  try {
                    if (!new BigNumber(value).isNaN()) return true
                  } catch {}
                  return t("error.validNumber")
                },
                positive: (value) =>
                  new BigNumber(value).gt(0) || t("error.positive"),
              },
            }}
          />

          {asset !== NATIVE_ASSET_ID && (
            <Alert variant="warning">
              {t("wallet.assets.transfer.warning.nonNative")}
            </Alert>
          )}
        </div>

        <Spacer size={20} />

        <div sx={{ flex: "row", justify: "space-between" }}>
          <Button onClick={props.onClose}>
            {t("wallet.assets.transfer.cancel")}
          </Button>
          <Button type="submit" variant="primary">
            {t("wallet.assets.transfer.submit")}
          </Button>
        </div>
      </form>
    </>
  )
}
