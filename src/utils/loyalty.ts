import { BN_QUINTILL } from "utils/constants"
import { useQuery } from "@tanstack/react-query"
import { wrap } from "comlink"
import { LoyaltyWorker } from "./loyalty.worker"
import { AprFarm } from "./apr"
import { PalletLiquidityMiningLoyaltyCurve } from "@polkadot/types/lookup"
import { Maybe } from "./types"
import { undefinedNoop } from "./helpers"

const worker = wrap<LoyaltyWorker>(
  new Worker(new URL("./loyalty.worker.ts", import.meta.url), {
    type: "module",
  }),
)

async function getLoyaltyRates(
  farm: AprFarm,
  loyaltyCurve: PalletLiquidityMiningLoyaltyCurve,
) {
  const initialRewardPercentage = loyaltyCurve.initialRewardPercentage
    .toBigNumber()
    .div(BN_QUINTILL)
  const scaleCoef = loyaltyCurve.scaleCoef.toBigNumber()

  const result = await worker.getLoyaltyFactor(
    farm.globalFarm.plannedYieldingPeriods.toNumber(),
    initialRewardPercentage.toString(),
    scaleCoef.toString(),
  )

  return result.map((y, x) => ({ x, y }))
}

export const useLoyaltyRates = (
  farm: AprFarm,
  loyaltyCurve: Maybe<PalletLiquidityMiningLoyaltyCurve>,
) => {
  return useQuery(
    ["loyaltyWorker", loyaltyCurve, farm.yieldFarm.loyaltyCurve],
    loyaltyCurve != null
      ? () => getLoyaltyRates(farm, loyaltyCurve)
      : undefinedNoop,
    { enabled: loyaltyCurve != null },
  )
}
