import { Button } from "components/Button/Button"
import { ModalMeta } from "components/Modal/Modal"
import { Separator } from "components/Separator/Separator"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { Controller, useForm } from "react-hook-form"
import { FormValues } from "utils/helpers"
import { useAccountStore, useStore } from "state/store"
import { BASILISK_ADDRESS_PREFIX, useApiPromise } from "utils/api"
import BigNumber from "bignumber.js"
import { Trans, useTranslation } from "react-i18next"
import { WalletTransferAccountInput } from "sections/wallet/transfer/WalletTransferAccountInput"
import { safeConvertAddressSS58, shortenAccountAddress } from "utils/formatting"
import { LiquidityPositionInput } from "components/AssetSelect/LiquidityPositionInput"
import { AccountId32 } from "@polkadot/types/interfaces"
import { getFixedPointAmount } from "utils/balance"
import { usePoolsWithShareTokens } from "api/pools"

export function WalletTransferSectionLiquidityPositions(props: {
  poolAddress: string | AccountId32
  onClose: () => void
}) {
  const { t } = useTranslation()

  const pools = usePoolsWithShareTokens()
  const pool = pools.data?.find(
    (i) => i.address.toString() === props.poolAddress.toString(),
  )

  const api = useApiPromise()
  const { createTransaction } = useStore()
  const { account } = useAccountStore()

  const form = useForm<{
    dest: string
    amount: string
  }>({})

  const onSubmit = async (values: FormValues<typeof form>) => {
    if (!pool?.shareToken?.token) throw new Error("Missing share token")
    const amount = getFixedPointAmount(values.amount, 12)

    return await createTransaction(
      {
        tx: api.tx.tokens.transferKeepAlive(
          values.dest,
          pool.shareToken?.token,
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
                symbol: t("shares"),
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
                symbol: t("shares"),
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
                symbol: t("shares"),
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
      <ModalMeta title={t("wallet.assets.transfer.liquidityPosition.title")} />

      <Spacer size={[13, 26]} />

      <form onSubmit={form.handleSubmit(onSubmit)} sx={{ flex: "column" }}>
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

          <div sx={{ flex: "column", gap: 8, p: 20 }}>
            <Text fw={500}>{t("wallet.assets.transfer.dest.label")}</Text>

            <Controller
              name="dest"
              control={form.control}
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

        {pool != null && (
          <div sx={{ flex: "column", gap: 10 }}>
            <Controller
              name="amount"
              control={form.control}
              render={({
                field: { name, value, onChange },
                fieldState: { error },
              }) => (
                <LiquidityPositionInput
                  title={t("wallet.assets.transfer.liquidityPosition.label")}
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                  pool={pool}
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
          </div>
        )}

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
