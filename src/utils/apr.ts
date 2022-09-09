import BN from "bignumber.js"
import { useActiveYieldFarms, useGlobalFarms, useYieldFarms } from "api/farms"
import { useMemo } from "react"
import { AccountId32 } from "@polkadot/types/interfaces/runtime"
import { BLOCK_TIME_IN_SECONDS, BN_QUINTILL } from "utils/constants"
import { secondsInYear } from "date-fns"
import { useApiPromise } from "./network"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./queryKeys"

export type AprFarm = NonNullable<ReturnType<typeof useAPR>["data"][number]>

export const useBestNumber = () => {
  const api = useApiPromise()
  return useQuery(QUERY_KEYS.bestNumber, () => {
    return api.derive.chain.bestNumber()
  })
}

export const useAPR = (poolId: AccountId32) => {
  const bestNumber = useBestNumber()
  const activeYieldFarms = useActiveYieldFarms(poolId)
  const globalFarms = useGlobalFarms(
    activeYieldFarms.data?.map((f) => f.globalFarmId) ?? [],
  )
  const yieldFarms = useYieldFarms(activeYieldFarms.data ?? [])

  const queries = [bestNumber, activeYieldFarms, globalFarms, yieldFarms]
  const isLoading = queries.some((q) => q.isLoading)

  const data = useMemo(() => {
    if (
      !globalFarms.data ||
      !activeYieldFarms.data ||
      !yieldFarms.data ||
      !bestNumber.data
    )
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
      const currentPeriod = new BN(bestNumber.data.toHex()).dividedToIntegerBy(
        blocksPerPeriod,
      )

      const blockTime = BLOCK_TIME_IN_SECONDS
      const multiplier = new BN(yFarm.multiplier.toHex()).div(BN_QUINTILL)

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
      const leftToDistribute = maxRewards.minus(distributedRewards)

      // estimate, when the farm will most likely distribute all the rewards
      const updatedAtPeriod = new BN(gFarm.updatedAt.toHex())
      const periodsLeft = leftToDistribute.div(maxRewardPerPeriod)

      // if there are no deposits, the farm is not running and distributing rewards
      const estimatedEndPeriod = totalSharesZ.gte(0)
        ? updatedAtPeriod.plus(periodsLeft)
        : currentPeriod.plus(periodsLeft)

      const estimatedEndBlock = estimatedEndPeriod.times(blocksPerPeriod)

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
        estimatedEndBlock: estimatedEndBlock,
        assetId: gFarm.rewardCurrency,
        globalFarm: gFarm,
        yieldFarm: yFarm,
        ...farm,
      }
    })

    return data
  }, [
    bestNumber.data,
    globalFarms.data,
    activeYieldFarms.data,
    yieldFarms.data,
  ])

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
  const blocksPerYear = new BN(secondsInYear).div(blockTime)
  const periodsPerYear = blocksPerYear.div(blocksPerPeriod)

  return poolYieldPerPeriod.times(periodsPerYear)
}
