import { useTranslation } from "react-i18next"
import { PoolBase } from "@galacticcouncil/sdk"
import { useAccountStore, useStore } from "state/store"
import { Button } from "components/Button/Button"
import { useMutation } from "@tanstack/react-query"
import { useApiPromise } from "utils/api"
import { useUserDeposits } from "utils/farms/deposits"
import { DepositNftType } from "api/deposits"

export function PoolFarmWithdraw(props: {
  pool: PoolBase
  depositNft?: DepositNftType
}) {
  const { account } = useAccountStore()
  const api = useApiPromise()
  const userDeposits = useUserDeposits(props.pool.address)
  const deposits = props.depositNft ? [props.depositNft] : userDeposits.data

  const { createTransaction } = useStore()
  const { t } = useTranslation()
  const [assetIn, assetOut] = props.pool.tokens

  const mutate = useMutation(async () => {
    const txs =
      deposits
        ?.map((record) => {
          return record.deposit.yieldFarmEntries.map((entry) => {
            return api.tx.xykLiquidityMining.withdrawShares(
              record.id,
              entry.yieldFarmId,
              { assetIn: assetIn.id, assetOut: assetOut.id },
            )
          })
        })
        .flat(2) ?? []

    if (txs.length > 1) {
      return await createTransaction({
        tx: api.tx.utility.batchAll(txs),
      })
    } else if (txs.length > 0) {
      return await createTransaction({
        tx: txs[0],
      })
    }
  })

  return (
    <Button
      variant="secondary"
      disabled={!deposits?.length || account?.isExternalWalletConnected}
      isLoading={mutate.isLoading}
      onClick={() => mutate.mutate()}
      sx={{ width: ["inherit", "auto"] }}
    >
      {t("pools.allFarms.modal.withdraw.submit")}
    </Button>
  )
}
