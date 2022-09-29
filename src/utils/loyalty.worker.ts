import { calculate_loyalty_multiplier } from "@galacticcouncil/math/build/liquidity-mining/bundler"
import { expose } from "comlink"

const EPS = 0.1

const worker = {
  getLoyaltyFactor(
    plannedYieldingPeriods: number,
    initialRewardPercentage: string,
    scaleCoef: string,
  ) {
    const result = []
    for (let i = 0; i < plannedYieldingPeriods; i += 1) {
      const value =
        Number.parseFloat(
          calculate_loyalty_multiplier(
            i.toString(),
            initialRewardPercentage,
            scaleCoef,
          ),
        ) * 100

      if (Math.abs(100 - value) < EPS) {
        break
      }

      result.push(value)
    }

    return result
  },
}

export type LoyaltyWorker = typeof worker

expose(worker)
