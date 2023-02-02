import { Trans, useTranslation } from "react-i18next"
import { PoolBase } from "@galacticcouncil/sdk"
import { Button } from "components/Button/Button"
import { useAccountStore, useStore } from "state/store"
import { useApiPromise } from "utils/api"
import { useForm, Controller } from "react-hook-form"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { useActiveYieldFarms, useGlobalFarms } from "api/farms"
import { BN_0, BN_BILL, DEFAULT_DECIMALS } from "utils/constants"
import { AprFarm } from "utils/farms/apr"
import { FormValues } from "utils/helpers"
import { getFloatingPointAmount } from "utils/balance"
import { LiquidityPositionInput } from "components/AssetSelect/LiquidityPositionInput"
import BN from "bignumber.js"

type PoolJoinFarmDepositProps = {
  pool: PoolBase
  farm?: AprFarm
  isDrawer?: boolean
}

export const PoolFarmDeposit = (props: PoolJoinFarmDepositProps) => {
  const activeYieldFarms = useActiveYieldFarms(props.pool.address)
  const globalFarms = useGlobalFarms(
    activeYieldFarms.data?.map((f) => f.globalFarmId) ?? [],
  )

  const minDeposit =
    globalFarms.data?.reduce<BN>((memo, i) => {
      const value = i.minDeposit.toBigNumber()
      if (value.isGreaterThan(memo)) return value
      return memo
    }, BN_0) ?? BN_0

  const { t } = useTranslation()
  const { createTransaction } = useStore()
  const api = useApiPromise()

  const [assetIn, assetOut] = props.pool.tokens
  const { account } = useAccountStore()

  const form = useForm<{ value: string }>({})

  async function handleSubmit(data: FormValues<typeof form>) {
    const value = new BN(data.value)
      .multipliedBy(BN_BILL)
      .toFormat({ decimalSeparator: "" })

    if (!account) throw new Error("No account found")

    const toast = {
      onLoading: (
        <Trans
          t={t}
          i18nKey="farms.deposit.toast.onLoading"
          tOptions={{
            amount: value,
            fixedPointScale: DEFAULT_DECIMALS.toNumber(),
          }}
        >
          <span />
          <span className="highlight" />
        </Trans>
      ),
      onSuccess: (
        <Trans
          t={t}
          i18nKey="farms.deposit.toast.onSuccess"
          tOptions={{
            amount: value,
            fixedPointScale: DEFAULT_DECIMALS.toNumber(),
          }}
        >
          <span />
          <span className="highlight" />
        </Trans>
      ),
      onError: (
        <Trans
          t={t}
          i18nKey="farms.deposit.toast.onLoading"
          tOptions={{
            amount: value,
            fixedPointScale: DEFAULT_DECIMALS.toNumber(),
          }}
        >
          <span />
          <span className="highlight" />
        </Trans>
      ),
    }

    if (props.farm) {
      return await createTransaction(
        {
          tx: api.tx.xykLiquidityMining.depositShares(
            props.farm.globalFarm.id,
            props.farm.yieldFarm.id,
            {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
            },
            value.toString(),
          ),
        },
        {
          toast,
        },
      )
    }

    if (!activeYieldFarms.data)
      throw new Error("Missing active yield farms data")

    const [firstActive, ...restActive] = activeYieldFarms.data

    const firstDeposit = await createTransaction(
      {
        tx: api.tx.xykLiquidityMining.depositShares(
          firstActive.globalFarmId,
          firstActive.yieldFarmId,
          {
            assetIn: assetIn.id,
            assetOut: assetOut.id,
          },
          value.toString(),
        ),
      },
      {
        toast,
      },
    )

    for (const record of firstDeposit.events) {
      if (api.events.xykLiquidityMining.SharesDeposited.is(record.event)) {
        const depositId = record.event.data.depositId

        const txs = restActive.map((item) =>
          api.tx.xykLiquidityMining.redepositShares(
            item.globalFarmId,
            item.yieldFarmId,
            { assetIn: assetIn.id, assetOut: assetOut.id },
            depositId,
          ),
        )

        if (txs.length > 1) {
          await createTransaction({ tx: api.tx.utility.batchAll(txs) })
        } else if (txs.length === 1) {
          await createTransaction({ tx: txs[0] })
        }
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="value"
        control={form.control}
        rules={{
          validate: {
            minDeposit: (value) => {
              return !getFloatingPointAmount(minDeposit, 12).lte(value)
                ? t("farms.deposit.error.minDeposit", { minDeposit })
                : undefined
            },
          },
        }}
        render={({
          field: { value, onChange, name },
          formState: { errors },
        }) => (
          <LiquidityPositionInput
            title={t("farms.deposit.title")}
            name={name}
            value={value}
            onChange={onChange}
            error={errors.value?.message}
            pool={props.pool}
          />
        )}
      />

      <div
        sx={{
          flex: "row",
          mt: 20,
          justify: "flex-end",
          width: ["100%", "auto"],
        }}
      >
        {account ? (
          <Button type="submit" variant="primary" sx={{ width: "100%" }}>
            {props.isDrawer ? t("confirm") : t("farms.deposit.submit")}
          </Button>
        ) : (
          <WalletConnectButton />
        )}
      </div>
    </form>
  )
}
