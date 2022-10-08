import { BN_QUINTILL } from "utils/constants"
import { AprFarm } from "./apr"
import { PalletLiquidityMiningLoyaltyCurve } from "@polkadot/types/lookup"
import { Maybe } from "./types"

import type { worker as WorkerType } from "./loyalty.worker"
import Worker from "./loyalty.worker?worker"
import { wrap } from "comlink"
import { useQuery } from "@tanstack/react-query"
import { undefinedNoop } from "./helpers"
import { useApiPromise } from "./network"
import { Struct, u128 } from "@polkadot/types"

const worker = wrap<typeof WorkerType>(new Worker())

// TODO: remove in production, keep this for demo for now
export const useMockLoyaltyCurve = () => {
  const api = useApiPromise()
  const instance = new (Struct.with({
    initialRewardPercentage: u128,
    scaleCoef: u128,
  }))(api.registry, {
    initialRewardPercentage: "100000000000000000",
    scaleCoef: "50",
  })

  // @ts-expect-error Struct.with will add new getters to Struct, their TS is wrong
  return instance as PalletLiquidityMiningLoyaltyCurve
}

export const useLoyaltyRates = (
  farm: AprFarm,
  loyaltyCurve: Maybe<PalletLiquidityMiningLoyaltyCurve>,
) => {
  return useQuery(
    ["loyaltyRewards"],
    loyaltyCurve != null
      ? async () => {
          const periods = farm.globalFarm.plannedYieldingPeriods.toNumber()
          const initialRewardPercentage = loyaltyCurve.initialRewardPercentage
            .toBigNumber()
            .div(BN_QUINTILL)
            .toNumber()
          const scaleCoef = loyaltyCurve.scaleCoef.toNumber()

          const result = await worker.getLoyaltyFactor(
            periods,
            initialRewardPercentage,
            scaleCoef,
          )

          return result.map((y, x) => ({ x, y }))
        }
      : undefinedNoop,
    { enabled: loyaltyCurve != null },
  )
}
