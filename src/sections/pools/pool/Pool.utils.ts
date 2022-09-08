import { useAssetMeta } from "api/assetMeta"
import { useAssetDetails } from "api/assetDetails"
import { useMemo } from "react"
import { BN_0, BN_1, BN_10, DOLLAR_RATES } from "utils/constants"
import { useTotalLiquidity } from "api/totalLiquidity"
import { useExchangeFee } from "api/exchangeFee"
import { AccountId32 } from "@polkadot/types/interfaces/runtime"
import { useTokenBalance } from "api/balances"
import BN from "bignumber.js"

type Props = {
  id: AccountId32
  assetA: string
  assetB: string
}

export const usePoolData = ({ id, assetA, assetB }: Props) => {
  const assetAMeta = useAssetMeta(assetA)
  const assetBMeta = useAssetMeta(assetB)

  const assetADetails = useAssetDetails(assetA)
  const assetBDetails = useAssetDetails(assetB)

  const assetABalance = useTokenBalance(assetA, id.toHuman())
  const assetBBalance = useTokenBalance(assetB, id.toHuman())

  const exchangeFee = useExchangeFee()

  const total = useTotalLiquidity(id)

  const queries = [
    assetAMeta,
    assetBMeta,
    assetADetails,
    assetBDetails,
    assetABalance,
    assetBBalance,
    exchangeFee,
    total,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (isLoading) return undefined

    const assetA = {
      meta: assetAMeta.data,
      details: assetADetails.data,
      balance: assetABalance.data,
    }
    const assetB = {
      meta: assetBMeta.data,
      details: assetBDetails.data,
      balance: assetBBalance.data,
    }

    const balanceA = assetABalance.data?.div(
      BN_10.pow(new BN(assetAMeta.data?.decimals ?? 12)),
    )
    const balanceB = assetBBalance.data?.div(
      BN_10.pow(new BN(assetBMeta.data?.decimals ?? 12)),
    )

    const rateA = DOLLAR_RATES.get(assetA.details?.name ?? "")
    const rateB = DOLLAR_RATES.get(assetB.details?.name ?? "")

    const totalA = balanceA?.times(rateA ?? BN_1)
    const totalB = balanceB?.times(rateB ?? BN_1)

    const totalValue = totalA?.plus(totalB ?? BN_0)

    // console.table([
    //   [`${assetA.details?.name} amount`, balanceA?.toFixed()],
    //   [`${assetB.details?.name} amount`, balanceB?.toFixed()],
    //   [`${assetA.details?.name} rate`, rateA?.toFixed()],
    //   [`${assetB.details?.name} rate`, rateB?.toFixed()],
    //   [`${assetA.details?.name} dollars`, totalA?.toFixed()],
    //   [`${assetB.details?.name} dollars`, totalB?.toFixed()],
    //   [`total`, totalLiquidity?.toFixed()],
    // ])

    const tradingFee = exchangeFee.data

    return { assetA, assetB, tradingFee, totalValue }
  }, [isLoading])

  return { data, isLoading }
}
