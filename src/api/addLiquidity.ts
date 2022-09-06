import { useApiPromise } from "../utils/network"
import { useStore } from "../state/store"
import { useCallback, useState } from "react"
import { useTransaction } from "../sections/transaction/transaction.utils"
import BigNumber from "bignumber.js"

interface AddLiquidityAsset {
  id: string
  amount: BigNumber
}

export function useAddLiquidity() {
  const api = useApiPromise()
  const { account } = useStore()
  const [pendingTx, setPendingTx] = useState(false)

  const { create } = useTransaction()

  const handleAddLiquidity = useCallback(
    async ([assetA, assetB]: [AddLiquidityAsset, AddLiquidityAsset]) => {
      if (account) {
        try {
          setPendingTx(true)

          const tx = api.tx.xyk.addLiquidity(
            assetA.id,
            assetB.id,
            assetA.amount.toFixed(),
            assetB.amount.toFixed(),
          )

          create({
            hash: tx.hash.toString(),
            tx,
          })

          setPendingTx(false)
        } catch (err) {
          console.log(err)
          setPendingTx(false)
        }
      }
    },
    [create, account, api],
  )

  return {
    handleAddLiquidity,
    pendingTx,
  }
}
