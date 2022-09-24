import { useTotalIssuance } from "api/totalIssuance"
import { useTotalInPool } from "sections/pools/pool/Pool.utils"
import { useMemo } from "react"
import { u32 } from "@polkadot/types"
import { Maybe } from "utils/types"
import { PoolBase } from "@galacticcouncil/sdk"
import BN from "bignumber.js"

export const useCurrentSharesValue = ({
  token,
  pool,
  balance,
}: {
  token: Maybe<u32>
  pool: PoolBase
  balance: BN
}) => {
  const totalIssuance = useTotalIssuance(token)
  const totalInPool = useTotalInPool({ pool })

  const isLoading = totalIssuance.isLoading || totalInPool.isLoading

  const dollarValue = useMemo(() => {
    if (!totalIssuance.data || !totalInPool.data) return undefined

    const issuance = totalIssuance.data.total
    const liquidity = totalInPool.data
    const ratio = balance.div(issuance)
    const result = liquidity.times(ratio)

    return result
  }, [totalIssuance.data, totalInPool.data, balance])

  return { dollarValue, isLoading }
}
