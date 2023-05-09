import { PoolBase } from "@galacticcouncil/sdk"
import { useTokenBalance } from "api/balances"
import { FarmIds, useActiveYieldFarms, useGlobalFarms } from "api/farms"
import { usePoolShareToken } from "api/pools"
import BN from "bignumber.js"
import { LiquidityPositionInput } from "components/AssetSelect/LiquidityPositionInput"
import { Button } from "components/Button/Button"
import { Controller, useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { useAccountStore, useStore } from "state/store"
import { useApiPromise } from "utils/api"
import { getFloatingPointAmount } from "utils/balance"
import { BN_0, BN_10, BN_BILL, DEFAULT_DECIMALS } from "utils/constants"
import { AprFarm } from "utils/farms/apr"
import { FormValues } from "utils/helpers"

type Props = { pool: PoolBase; farm?: AprFarm; isDrawer?: boolean }

export const PoolFarmDeposit = (props: Props) => {
  const { t } = useTranslation()

  const activeYieldFarmsQuery = useActiveYieldFarms([props.pool.address])
  const activeYieldFarms = activeYieldFarmsQuery.reduce(
    (acc, curr) => (curr.data ? [...curr.data, ...acc] : acc),
    [] as FarmIds[],
  )
  const globalFarms = useGlobalFarms(
    activeYieldFarms.map((f) => f.globalFarmId),
  )

  const minDeposit =
    globalFarms.data?.reduce((memo, i) => {
      const value = i.minDeposit.toBigNumber()
      if (value.isGreaterThan(memo)) return value
      return memo
    }, BN_0) ?? BN_0

  const { createTransaction } = useStore()
  const api = useApiPromise()

  const [assetIn, assetOut] = props.pool.tokens
  const { account } = useAccountStore()

  const shareToken = usePoolShareToken(props.pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

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

    if (activeYieldFarmsQuery.some((q) => !q.data))
      throw new Error("Missing active yield farms data")

    const [firstActive, ...restActive] = activeYieldFarms

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

  if (!balance.data) return null

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="value"
        control={form.control}
        rules={{
          validate: {
            maxBalance: (value) => {
              try {
                if (
                  balance?.data?.balance.gte(
                    BN(value).multipliedBy(BN_10.pow(12)),
                  )
                )
                  return true
              } catch {}
              return t("liquidity.add.modal.validation.notEnoughBalance")
            },
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
          <Button
            type="submit"
            variant="primary"
            sx={{ width: "100%" }}
            disabled={account.isExternalWalletConnected}
          >
            {props.isDrawer ? t("confirm") : t("farms.deposit.submit")}
          </Button>
        ) : (
          <WalletConnectButton />
        )}
      </div>
    </form>
  )
}
