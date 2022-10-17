import { useMemo } from "react"
import { BN_0, BN_1 } from "utils/constants"
import BN from "bignumber.js"
import { useBestNumber } from "api/chain"
import { useAPR } from "utils/apr"
import { useMath } from "utils/math"
import { useAUSD } from "api/asset"
import { useSpotPrices } from "api/spotPrice"
import { PoolBase } from "@galacticcouncil/sdk"
import { useUserDeposits } from "utils/deposits"
import { NATIVE_ASSET_ID } from "utils/network"

export const useClaimableAmount = (pool: PoolBase) => {
  const bestNumber = useBestNumber()
  const deposits = useUserDeposits(pool.address)
  const apr = useAPR(pool.address)
  const math = useMath()
  const aUSD = useAUSD()
  const currencies = [
    ...new Set(apr.data.map((i) => i.globalFarm.rewardCurrency.toString())),
  ]
  const bsxSpotPrices = useSpotPrices(currencies, NATIVE_ASSET_ID)
  const ausdSpotPrices = useSpotPrices(currencies, aUSD.data?.id)

  const queries = [deposits, bestNumber, apr, math, aUSD, ...ausdSpotPrices]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (bestNumber.data == null) return null

    return deposits.data
      ?.map((record) => {
        return record.deposit.yieldFarmEntries.map((entry) => {
          const aprEntry = apr.data.find(
            (i) =>
              i.globalFarm.id.eq(entry.globalFarmId) &&
              i.yieldFarm.id.eq(entry.yieldFarmId),
          )

          const bsx = bsxSpotPrices.find((a) =>
            aprEntry?.globalFarm.rewardCurrency.eq(a.data?.tokenIn),
          )?.data

          const ausd = ausdSpotPrices.find((a) =>
            aprEntry?.globalFarm.rewardCurrency.eq(a.data?.tokenIn),
          )?.data

          if (
            aprEntry == null ||
            bsx == null ||
            ausd == null ||
            math.liquidityMining == null
          )
            return null

          const currentPeriod = bestNumber.data.relaychainBlockNumber
            .toBigNumber()
            .dividedToIntegerBy(
              aprEntry.globalFarm.blocksPerPeriod.toBigNumber(),
            )
          const periods = currentPeriod.minus(entry.enteredAt.toBigNumber())

          let loyaltyMultiplier = BN_1.toString()

          if (!aprEntry.yieldFarm.loyaltyCurve.isNone) {
            const { initialRewardPercentage, scaleCoef } =
              aprEntry.yieldFarm.loyaltyCurve.unwrap()

            loyaltyMultiplier =
              math.liquidityMining.calculate_loyalty_multiplier(
                periods.toFixed(),
                initialRewardPercentage.toBigNumber().toFixed(),
                scaleCoef.toBigNumber().toFixed(),
              )
          }

          const reward = new BN(
            math.liquidityMining.calculate_user_reward(
              entry.accumulatedRpvs.toBigNumber().toFixed(),
              entry.valuedShares.toBigNumber().toFixed(),
              entry.accumulatedClaimedRewards.toBigNumber().toFixed(),
              aprEntry.yieldFarm.accumulatedRpvs.toBigNumber().toFixed(),
              loyaltyMultiplier,
            ),
          )

          // bsx reward
          const bsxReward = reward.multipliedBy(bsx.spotPrice)
          const ausdReward = reward.multipliedBy(ausd.spotPrice)

          return { ausd: ausdReward, bsx: bsxReward }
        })
      })
      .flat(2)
      .reduce<{ bsx: BN; ausd: BN }>(
        (memo, item) => ({
          ausd: memo.ausd.plus(item?.ausd ?? BN_0),
          bsx: memo.bsx.plus(item?.bsx ?? BN_0),
        }),
        { bsx: BN_0, ausd: BN_0 },
      )
  }, [
    apr.data,
    deposits.data,
    ausdSpotPrices,
    bestNumber.data,
    bsxSpotPrices,
    math.liquidityMining,
  ])

  return { data, isLoading }
}
