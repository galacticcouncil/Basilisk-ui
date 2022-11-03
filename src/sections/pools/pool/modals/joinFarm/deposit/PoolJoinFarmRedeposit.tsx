import { useTranslation } from "react-i18next"
import { PoolBase } from "@galacticcouncil/sdk"
import { Button } from "components/Button/Button"
import { useAccountStore, useStore } from "state/store"
import { useApiPromise } from "utils/api"
import { useForm } from "react-hook-form"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { DepositNftType } from "api/deposits"
import { AprFarm } from "utils/farms/apr"

type Props = {
  pool: PoolBase
  availableYieldFarms: AprFarm[]
  depositNfts: DepositNftType[]
}

export const PoolJoinFarmRedeposit = (props: Props) => {
  const { t } = useTranslation()
  const { createTransaction } = useStore()
  const api = useApiPromise()

  const [assetIn, assetOut] = props.pool.tokens
  const { account } = useAccountStore()

  const form = useForm<{ value: string }>({})

  async function handleSubmit() {
    if (!account) throw new Error("No account found")
    if (!props.availableYieldFarms.length)
      throw new Error("No available farms to redeposit into")

    const txs = props.depositNfts
      .map((record) => {
        return props.availableYieldFarms.map((farm) => {
          return api.tx.xykLiquidityMining.redepositShares(
            farm.globalFarm.id,
            farm.yieldFarm.id,
            {
              assetIn: assetIn.id,
              assetOut: assetOut.id,
            },
            record.id,
          )
        })
      })
      .flat(2)

    if (txs.length > 1) {
      return await createTransaction({ tx: api.tx.utility.batchAll(txs) })
    } else {
      return await createTransaction({ tx: txs[0] })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {account ? (
        <Button
          type="submit"
          variant="primary"
          disabled={form.formState.isSubmitting}
          sx={{ width: "100%" }}
        >
          {t("farms.redeposit.submit")}
        </Button>
      ) : (
        <WalletConnectButton />
      )}
    </form>
  )
}
