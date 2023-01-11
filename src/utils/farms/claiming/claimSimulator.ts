import { BN_0, BN_1, BN_QUINTILL } from "utils/constants"
import BN from "bignumber.js"
import { Option, u32 } from "@polkadot/types"
import { AccountId32 } from "@polkadot/types/interfaces"
import {
  PalletLiquidityMiningLoyaltyCurve,
  PalletLiquidityMiningYieldFarmEntry,
} from "@polkadot/types/lookup"

import {
  MutableGlobalFarm,
  MutableYieldFarm,
} from "utils/farms/claiming/mutableFarms"

import { MultiCurrencyContainer } from "utils/farms/claiming/multiCurrency"

// Pass liquidity mining as an argument due to issues with vitest and import
import type * as liquidityMining from "@galacticcouncil/math/build/liquidity-mining/nodejs"
type LiquidityMining = typeof liquidityMining

export class XYKLiquidityMiningClaimSim {
  protected get_account: (sub: u32 | number) => AccountId32
  protected multiCurrency: MultiCurrencyContainer

  constructor(
    addressResolver: (sub: u32 | number) => AccountId32,
    multiCurrency: MultiCurrencyContainer,
    protected liquidityMining: LiquidityMining,
    protected assetRegistry: Array<{
      id: string
      existentialDeposit: BN
    }>,
  ) {
    this.get_account = addressResolver
    this.multiCurrency = multiCurrency
  }

  update_global_farm(
    global_farm: MutableGlobalFarm,
    current_period: BN,
    reward_per_period: BN,
  ) {
    // Farm should be updated only once in the same period.
    if (global_farm.updatedAt.eq(current_period)) {
      return BN_0
    }

    // Nothing to update if there is no stake in the farm.
    if (global_farm.totalSharesZ.isZero()) {
      return BN_0
    }

    // Number of periods since last farm update.
    let periods_since_last_update = current_period.minus(global_farm.updatedAt)

    let global_farm_account = this.get_account(global_farm.id)

    let reward_currency_ed = this.assetRegistry.find(
      (i) => i.id === global_farm.rewardCurrency.toString(),
    )?.existentialDeposit
    if (reward_currency_ed == null)
      throw new Error("Missing reward currency asset list")

    let global_farm_balance = this.multiCurrency.free_balance(
      global_farm.rewardCurrency,
      global_farm_account,
    )
    // saturating sub
    let left_to_distribute = global_farm_balance.minus(
      BN.min(reward_currency_ed, global_farm_balance),
    )

    let reward = periods_since_last_update.multipliedBy(reward_per_period)
    if (left_to_distribute.lt(reward)) reward = left_to_distribute

    if (!reward.isZero()) {
      let pot = this.get_account(0)
      this.multiCurrency.transfer(
        global_farm.rewardCurrency,
        global_farm_account,
        pot,
        reward,
      )

      global_farm.accumulatedRpz = new BN(
        this.liquidityMining.calculate_accumulated_rps(
          global_farm.accumulatedRpz.toFixed(),
          global_farm.totalSharesZ.toFixed(),
          reward.toFixed(),
        )!,
      )

      global_farm.accumulatedRewards =
        global_farm.accumulatedRewards.plus(reward)
    }

    global_farm.updatedAt = current_period
    return reward
  }

  claim_from_global_farm(
    global_farm: MutableGlobalFarm,
    yield_farm: MutableYieldFarm,
    stake_in_global_farm: BN,
  ) {
    let reward = new BN(
      this.liquidityMining.calculate_reward(
        yield_farm.accumulatedRpz.toFixed(),
        global_farm.accumulatedRpz.toFixed(),
        stake_in_global_farm.toFixed(),
      )!,
    )

    yield_farm.accumulatedRpz = global_farm.accumulatedRpz

    global_farm.paidAccumulatedRewards =
      global_farm.paidAccumulatedRewards.plus(reward)

    global_farm.accumulatedRewards =
      global_farm.accumulatedRewards.minus(reward)

    return reward
  }

  update_yield_farm(
    yield_farm: MutableYieldFarm,
    yield_farm_rewards: BN,
    current_period: BN,
    global_farm_id: u32,
  ) {
    if (yield_farm.updatedAt.eq(current_period)) {
      return
    }

    if (yield_farm.totalValuedShares.isZero()) {
      return
    }

    yield_farm.accumulatedRpvs = new BN(
      this.liquidityMining.calculate_accumulated_rps(
        yield_farm.accumulatedRpvs.toFixed(),
        yield_farm.totalValuedShares.toFixed(),
        yield_farm_rewards.toFixed(),
      )!,
    )

    yield_farm.updatedAt = current_period

    yield_farm.leftToDistribute =
      yield_farm.leftToDistribute.plus(yield_farm_rewards)
  }

  maybe_update_farms(
    global_farm: MutableGlobalFarm,
    yield_farm: MutableYieldFarm,
    current_period: BN,
  ) {
    if (!yield_farm.state.isActive.valueOf()) return

    if (
      !yield_farm.totalShares.isZero() &&
      !yield_farm.updatedAt.eq(current_period)
    ) {
      if (
        !global_farm.totalSharesZ.isZero() &&
        !global_farm.updatedAt.eq(current_period)
      ) {
        let total_shares_z_adjusted = new BN(
          this.liquidityMining.calculate_adjusted_shares(
            global_farm.totalSharesZ.toFixed(),
            global_farm.priceAdjustment.toFixed(),
          )!,
        )

        let rewards = new BN(
          this.liquidityMining.calculate_global_farm_reward_per_period(
            global_farm.yieldPerPeriod
              .multipliedBy(BN_QUINTILL)
              .integerValue(BN.ROUND_FLOOR)
              .toFixed(),
            total_shares_z_adjusted.toFixed(),
            global_farm.maxRewardPerPeriod.toFixed(),
          )!,
        )

        this.update_global_farm(global_farm, current_period, rewards)
      }

      let stake_in_global_farm = new BN(
        this.liquidityMining.calculate_global_farm_shares(
          yield_farm.totalValuedShares.toFixed(),
          yield_farm.multiplier.toFixed(),
        ),
      )

      let rewards = this.claim_from_global_farm(
        global_farm,
        yield_farm,
        stake_in_global_farm,
      )

      this.update_yield_farm(
        yield_farm,
        rewards,
        current_period,
        global_farm.id,
      )
    }
  }

  get_loyalty_multiplier(
    periods: BN,
    loyaltyCurve: Option<PalletLiquidityMiningLoyaltyCurve>,
  ) {
    let loyaltyMultiplier = BN_1.toString()
    if (!loyaltyCurve.isNone) {
      const { initialRewardPercentage, scaleCoef } = loyaltyCurve.unwrap()

      loyaltyMultiplier = this.liquidityMining.calculate_loyalty_multiplier(
        periods.toFixed(),
        initialRewardPercentage.toBigNumber().toFixed(),
        scaleCoef.toBigNumber().toFixed(),
      )!
    }
    return loyaltyMultiplier
  }

  claim_rewards(
    globalFarm: MutableGlobalFarm,
    yieldFarm: MutableYieldFarm,
    farmEntry: PalletLiquidityMiningYieldFarmEntry,
    relaychainBlockNumber: BN,
  ) {
    // if yield farm is terminated, cannot claim
    if (yieldFarm.state.isTerminated.valueOf()) {
      return null
    }

    const currentPeriod = relaychainBlockNumber.dividedToIntegerBy(
      globalFarm.blocksPerPeriod,
    )

    // avoid double claiming, if possible
    if (farmEntry.updatedAt.toBigNumber().eq(currentPeriod)) {
      return null
    }

    let periods = currentPeriod.minus(farmEntry.enteredAt.toBigNumber())

    if (yieldFarm.state.isStopped.valueOf()) {
      periods = yieldFarm.updatedAt.minus(farmEntry.enteredAt.toBigNumber())
    } else {
      // calculate possible values for entry farms
      this.maybe_update_farms(globalFarm, yieldFarm, currentPeriod)
    }

    // calculate loyalty multiplier
    let loyaltyMultiplier = this.get_loyalty_multiplier(
      periods,
      yieldFarm.loyaltyCurve,
    )

    const reward = new BN(
      this.liquidityMining.calculate_user_reward(
        farmEntry.accumulatedRpvs.toBigNumber().toFixed(),
        farmEntry.valuedShares.toBigNumber().toFixed(),
        farmEntry.accumulatedClaimedRewards.toBigNumber().toFixed(),
        yieldFarm.accumulatedRpvs.toFixed(),
        loyaltyMultiplier,
      ),
    )

    if (!reward.isZero()) {
      yieldFarm.leftToDistribute = yieldFarm.leftToDistribute.minus(reward)
    }

    return { value: reward, assetId: globalFarm.rewardCurrency.toString() }
  }
}
