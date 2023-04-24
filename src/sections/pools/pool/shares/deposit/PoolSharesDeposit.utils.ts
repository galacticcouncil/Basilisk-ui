import { PoolBase } from "@galacticcouncil/sdk"
import { DepositNftType } from "api/deposits"
import { SpotPrice } from "api/spotPrice"
import BigNumber from "bignumber.js"
import { getPoolTotal } from "sections/pools/header/PoolsHeader.utils"
import { BN_10 } from "utils/constants"

export const getPositionValues = ({
  pool,
  depositNft,
  totalIssuance,
  spotPrices,
}: {
  pool: PoolBase
  depositNft: DepositNftType
  totalIssuance: BigNumber
  spotPrices: SpotPrice[]
}) => {
  const shares = depositNft.deposit.shares.toBigNumber()
  const ratio = shares.div(totalIssuance)
  const poolTotal = getPoolTotal(pool.tokens, spotPrices)

  const amountUSD = poolTotal.times(ratio)
  const [assetA, assetB] = pool.tokens.map((token) => {
    const balance = new BigNumber(token.balance)
    const amount = balance.times(ratio).div(BN_10.pow(token.decimals))
    return { id: token.id, symbol: token.symbol, amount }
  })

  return { assetA, assetB, amountUSD }
}

export type PositionValues = ReturnType<typeof getPositionValues>
