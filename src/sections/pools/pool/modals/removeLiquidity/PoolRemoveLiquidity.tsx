import { PoolBase } from "@galacticcouncil/sdk"
import { useTokenBalance } from "api/balances"
import { usePoolShareToken } from "api/pools"
import { useSpotPrice } from "api/spotPrice"
import { useTotalLiquidity } from "api/totalLiquidity"
import { usePaymentInfo } from "api/transaction"
import BN from "bignumber.js"
import { BoxSwitch } from "components/BoxSwitch/BoxSwitch"
import { Button } from "components/Button/Button"
import { Input } from "components/Input/Input"
import { Modal } from "components/Modal/Modal"
import { Separator } from "components/Separator/Separator"
import { Slider } from "components/Slider/Slider"
import { Heading } from "components/Typography/Heading/Heading"
import { Text } from "components/Typography/Text/Text"
import { FC, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import {
  SSlippage,
  STradingPairContainer,
} from "sections/pools/pool/modals/removeLiquidity/PoolRemoveLiquidity.styled"
import { PoolRemoveLiquidityReward } from "sections/pools/pool/modals/removeLiquidity/reward/PoolRemoveLiquidityReward"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { useAccountStore, useStore } from "state/store"
import { useApiPromise } from "utils/api"
import { BN_0, BN_1, DEFAULT_DECIMALS } from "utils/constants"
import { FormValues } from "utils/helpers"
import { useAssetMeta } from "../../../../../api/assetMeta"
import { useAccountCurrency } from "../../../../../api/payments"
import { NATIVE_ASSET_ID } from "../../../../../utils/api"

const options = [
  { label: "25%", value: 25 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "MAX", value: 100 },
]

type Props = {
  isOpen: boolean
  onClose: () => void
  pool: PoolBase
}

const PoolRemoveLiquidityInput = (props: {
  value: number
  onChange: (value: number | string) => void
  error?: string
}) => {
  const [input, setInput] = useState("")

  const onChange = (value: string) => {
    setInput(value)
    props.onChange(value)
  }

  const onSelect = (value: number) => {
    setInput("")
    props.onChange(value)
  }

  return (
    <>
      <Slider
        value={[props.value]}
        onChange={([val]) => onSelect(val)}
        min={0}
        max={100}
        step={1}
      />

      <SSlippage>
        <BoxSwitch
          options={options}
          selected={props.value}
          onSelect={onSelect}
        />
        <Input
          value={input}
          onChange={onChange}
          name="custom"
          label="Custom"
          placeholder="Custom"
          error={props.error}
        />
      </SSlippage>
    </>
  )
}

export const PoolRemoveLiquidity: FC<Props> = ({ isOpen, onClose, pool }) => {
  const { t } = useTranslation()
  const form = useForm<{ value: number }>({
    mode: "onChange",
    defaultValues: { value: 25 },
  })
  const { createTransaction } = useStore()
  const { account } = useAccountStore()
  const accountCurrency = useAccountCurrency(account?.address)
  const feeMeta = useAssetMeta(accountCurrency.data)
  const feeSpotPrice = useSpotPrice(NATIVE_ASSET_ID, feeMeta.data?.id)

  const { api } = useApiPromise()

  const shareToken = usePoolShareToken(pool.address)
  const shareTokenBalance = useTokenBalance(
    shareToken.data?.token,
    account?.address,
  )
  const { data: shareTokenMeta } = useAssetMeta(shareToken.data?.token)
  const totalLiquidity = useTotalLiquidity(pool.address)

  const value = form.watch("value")
  const amount = shareTokenBalance.data?.balance
    ?.multipliedBy(value)
    .dividedToIntegerBy(100)

  const removeAmount = pool.tokens.map(({ balance }) => {
    return amount && totalLiquidity.data && !totalLiquidity.data.isZero()
      ? amount.multipliedBy(balance).dividedBy(totalLiquidity.data)
      : BN_0
  })

  const paymentInfoEstimate = usePaymentInfo(
    api.tx.xyk.removeLiquidity(pool.tokens[0].id, pool.tokens[1].id, "0"),
  )

  const spotPrice = useSpotPrice(pool.tokens[0].id, pool.tokens[1].id)

  async function handleSubmit(data: FormValues<typeof form>) {
    if (!account) throw new Error("Missing account")
    if (!shareTokenBalance.data?.balance)
      throw new Error("No share token balance")

    const tokenAmount = shareTokenBalance.data?.balance
      .multipliedBy(data.value)
      .dividedToIntegerBy(100)

    return await createTransaction(
      {
        tx: api.tx.xyk.removeLiquidity(
          pool.tokens[0].id,
          pool.tokens[1].id,
          tokenAmount.toFixed(),
        ),
      },
      {
        onBack: () => {},
        onClose,
        toast: {
          onLoading: (
            <Trans
              t={t}
              i18nKey="liquidity.remove.modal.toast.onLoading"
              tOptions={{
                value: tokenAmount.toFixed(),
                fixedPointScale:
                  shareTokenMeta?.decimals || DEFAULT_DECIMALS.toNumber(),
              }}
            >
              <span />
              <span className="highlight" />
            </Trans>
          ),
          onSuccess: (
            <Trans
              t={t}
              i18nKey="liquidity.remove.modal.toast.onSuccess"
              tOptions={{
                value: tokenAmount.toFixed(),
                fixedPointScale:
                  shareTokenMeta?.decimals || DEFAULT_DECIMALS.toNumber(),
              }}
            >
              <span />
              <span className="highlight" />
            </Trans>
          ),
          onError: (
            <Trans
              t={t}
              i18nKey="liquidity.remove.modal.toast.onLoading"
              tOptions={{
                value: tokenAmount.toFixed(),
                fixedPointScale:
                  shareTokenMeta?.decimals || DEFAULT_DECIMALS.toNumber(),
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
    <Modal
      title={t("pools.removeLiquidity.modal.title")}
      open={isOpen}
      onClose={onClose}
      withoutCloseOutside
    >
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        sx={{
          flex: "column",
          justify: "space-between",
          height: "calc(100% - var(--modal-header-title-height))",
        }}
      >
        <div>
          <Heading fs={[32, 42]} lh={52} sx={{ my: 16 }}>
            {t("value.percentage", { value })}
          </Heading>

          <Controller
            name="value"
            control={form.control}
            rules={{
              validate: {
                validNumber: (value) => {
                  try {
                    if (!new BN(value).isNaN()) return true
                  } catch {}
                  return t("error.validNumber")
                },
                positive: (value) => new BN(value).gt(0) || t("error.positive"),
                maxlimit: (value) =>
                  !BN(value).gt(100) || t("error.maxPercentage"),
              },
            }}
            render={({ field, fieldState }) => (
              <PoolRemoveLiquidityInput
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <STradingPairContainer>
            <Text color="neutralGray400">
              {t("pools.removeLiquidity.modal.receive")}
            </Text>

            <PoolRemoveLiquidityReward
              id={pool.tokens[0].id}
              amount={t("value", {
                value: removeAmount[0],
                fixedPointScale: pool.tokens[0].decimals,
                type: "token",
              })}
            />
            <PoolRemoveLiquidityReward
              id={pool.tokens[1].id}
              amount={t("value", {
                value: removeAmount[1],
                fixedPointScale: pool.tokens[1].decimals,
                type: "token",
              })}
            />
          </STradingPairContainer>

          <div sx={{ mt: 16, mb: 32 }}>
            <div
              sx={{ flex: "row", align: "center", justify: "space-between" }}
            >
              <Text color="neutralGray500" fs={15}>
                {t("pools.removeLiquidity.modal.cost")}
              </Text>
              <div sx={{ flex: "row", align: "center", gap: 4 }}>
                <Text fs={14}>
                  {t("pools.removeLiquidity.modal.row.transactionCostValue", {
                    amount: paymentInfoEstimate.data?.partialFee
                      .toBigNumber()
                      .multipliedBy(feeSpotPrice.data?.spotPrice ?? BN_1),
                    symbol: feeMeta.data?.symbol,
                    fixedPointScale: feeMeta.data?.decimals.toString() ?? 12,
                    type: "token",
                  })}
                </Text>
              </div>
            </div>
            <Separator sx={{ my: 8 }} size={2} />
            <div
              sx={{ flex: "row", align: "center", justify: "space-between" }}
            >
              <Text fs={15} color="neutralGray500">
                {t("pools.removeLiquidity.modal.price")}
              </Text>
              <Text fs={14}>
                <Trans
                  t={t}
                  i18nKey="pools.removeLiquidity.modal.row.spotPrice"
                  tOptions={{
                    firstAmount: BN_1,
                    secondAmount: spotPrice.data?.spotPrice,
                    firstCurrency: pool.tokens[0].symbol,
                    secondCurrency: pool.tokens[1].symbol,
                    type: "token",
                  }}
                />
              </Text>
            </div>
          </div>
        </div>
        {account ? (
          <Button type="submit" variant="primary" fullWidth>
            {t("pools.removeLiquidity.modal.confirm")}
          </Button>
        ) : (
          <WalletConnectButton css={{ marginTop: 20, width: "100%" }} />
        )}
      </form>
    </Modal>
  )
}
