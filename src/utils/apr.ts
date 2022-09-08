import BN from "bignumber.js"
import { secondsInYear } from "date-fns/constants"
import { useActiveYieldFarms, useGlobalFarms, useYieldFarms } from "api/farms"
import { useMemo } from "react"
import { AccountId32 } from "@polkadot/types/interfaces/runtime"
import { BN_QUINTILL } from "utils/constants"

export type AprFarm = NonNullable<ReturnType<typeof useAPR>["data"][number]>

export const useAPR = (poolId: AccountId32) => {
  const activeYieldFarms = useActiveYieldFarms(poolId)
  const globalFarms = useGlobalFarms(
    activeYieldFarms.data?.map((f) => f.globalFarmId) ?? [],
  )
  const yieldFarms = useYieldFarms(activeYieldFarms.data ?? [])

  const queries = [activeYieldFarms, globalFarms, yieldFarms]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (!globalFarms.data || !activeYieldFarms.data || !yieldFarms.data)
      return []

    let aFarms = activeYieldFarms.data
    const gFarms = globalFarms.data.filter((gf) =>
      aFarms.some((af) => af.globalFarmId.eq(gf.id)),
    )
    const yFarms = yieldFarms.data.filter((yf) =>
      aFarms.some((af) => af.yieldFarmId.eq(yf.id)),
    )

    const farms = aFarms
      .map((farm) => {
        const gFarm = gFarms.find((gf) => gf.id.eq(farm.globalFarmId))
        const yFarm = yFarms.find((yf) => yf.id.eq(farm.yieldFarmId))
        if (!gFarm || !yFarm) return undefined
        return { gFarm, yFarm, farm }
      })
      .filter(
        (
          x,
        ): x is {
          gFarm: typeof gFarms[number]
          yFarm: typeof yFarms[number]
          farm: typeof aFarms[number]
        } => x != null,
      )

    const data = farms.map(({ farm, gFarm, yFarm }) => {
      const totalSharesZ = new BN(gFarm.totalSharesZ.toHex())
      const plannedYieldingPeriods = new BN(
        gFarm.plannedYieldingPeriods.toHex(),
      )
      const yieldPerPeriod = new BN(gFarm.yieldPerPeriod.toHex()).div(
        BN_QUINTILL,
      )
      const maxRewardPerPeriod = new BN(gFarm.maxRewardPerPeriod.toHex())
      const blocksPerPeriod = new BN(gFarm.blocksPerPeriod.toHex())
      const blockTime = new BN(6)
      const multiplier = new BN(yFarm.multiplier.toHex())

      const globalRewardPerPeriod = getGlobalRewardPerPeriod(
        totalSharesZ,
        yieldPerPeriod,
        maxRewardPerPeriod,
      )
      const poolYieldPerPeriod = getPoolYieldPerPeriod(
        globalRewardPerPeriod,
        multiplier,
        totalSharesZ,
      )

      const apr = getAPR(poolYieldPerPeriod, blockTime, blocksPerPeriod)

      // max distribution of rewards
      // https://www.notion.so/Screen-elements-mapping-Farms-baee6acc456542ca8d2cccd1cc1548ae?p=4a2f16a9f2454095945dbd9ce0eb1b6b&pm=s
      const distributedRewards = new BN(gFarm.accumulatedRewards.toHex()).plus(
        gFarm.paidAccumulatedRewards.toHex(),
      )
      const maxRewards = maxRewardPerPeriod.times(plannedYieldingPeriods)

      const updatedAt = new BN(gFarm.updatedAt.toHex())
      const expectedBlocksToEnd = blocksPerPeriod.times(
        plannedYieldingPeriods.minus(updatedAt),
      )

      const expectedSecondsToEnd = expectedBlocksToEnd.times(blockTime)

      // fullness of the farm
      // interpreted as how close are we to the cap of yield per period
      // https://www.notion.so/FAQ-59697ce6fd2e46e1b8f9093ba4606e88#446ee616be484c5e86e5eb82d3a29455
      const fullness = totalSharesZ
        .times(yieldPerPeriod)
        .div(maxRewardPerPeriod)

      return {
        apr,
        distributedRewards,
        maxRewards,
        fullness,
        expectedSecondsToEnd,
        assetId: gFarm.rewardCurrency,
        globalFarm: gFarm,
        yieldFarm: yFarm,
        ...farm,
      }
    })

    return data
  }, [globalFarms.data, activeYieldFarms.data, yieldFarms.data])

  return { data, isLoading }
}

export const getGlobalRewardPerPeriod = (
  totalSharesZ: BN,
  yieldPerPeriod: BN,
  maxRewardPerPeriod: BN,
) => {
  const globalRewardPerPeriod = totalSharesZ.times(yieldPerPeriod)
  const isFarmFull = globalRewardPerPeriod.gte(maxRewardPerPeriod)

  return isFarmFull ? maxRewardPerPeriod : globalRewardPerPeriod
}

export const getPoolYieldPerPeriod = (
  globalRewardPerPeriod: BN,
  multiplier: BN,
  totalSharesZ: BN,
) => {
  return globalRewardPerPeriod.times(multiplier).div(totalSharesZ)
}

export const getAPR = (
  poolYieldPerPeriod: BN,
  blockTime: BN,
  blocksPerPeriod: BN,
) => {
  const secondsPerYear = new BN(secondsInYear)
  const periodsPerYear = secondsPerYear.div(blockTime.times(blocksPerPeriod))

  return poolYieldPerPeriod.times(periodsPerYear)
}
