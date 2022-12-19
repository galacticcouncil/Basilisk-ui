import { BN_0, BN_1 } from "utils/constants"
import BN from "bignumber.js"
import { GenericAccountId32, Option, u32 } from "@polkadot/types"
import { AccountId32 } from "@polkadot/types/interfaces"
import {
  OrmlTokensAccountData,
  PalletLiquidityMiningFarmState,
  PalletLiquidityMiningLoyaltyCurve,
  PalletLiquidityMiningYieldFarmEntry,
} from "@polkadot/types/lookup"
import { u8aConcat } from "@polkadot/util"
import { ApiPromise } from "@polkadot/api"
import * as liquidityMining from "@galacticcouncil/math/build/liquidity-mining/bundler"
import { padEndU8a } from "utils/helpers"

export class MultiCurrencyContainer {
  result = new Map<string, BN>()

  getKey(asset: u32, accountId: AccountId32): string {
    return [accountId.toString(), asset.toString()].join(",")
  }

  constructor(keys: [AccountId32, u32][], values: OrmlTokensAccountData[]) {
    for (let i = 0; i < keys.length; ++i) {
      const [accountId, asset] = keys[i]
      this.result.set(
        this.getKey(asset, accountId),
        values[i].free.toBigNumber(),
      )
    }
  }

  free_balance(asset: u32, accountId: AccountId32): BN {
    const result = this.result.get(this.getKey(asset, accountId)) ?? BN_0
    return result
  }

  transfer(
    asset: u32,
    sourceAccount: AccountId32,
    targetAccount: AccountId32,
    amount: BN,
  ) {
    const sourceKey = this.getKey(asset, sourceAccount)
    const targetKey = this.getKey(asset, targetAccount)

    const sourceValue = this.result.get(sourceKey) ?? BN_0
    const targetValue = this.result.get(targetKey) ?? BN_0

    if (sourceValue.lt(amount))
      throw new Error("Attempting to transfer more than is present")

    this.result.set(sourceKey, sourceValue.minus(amount))
    this.result.set(targetKey, targetValue.plus(amount))
  }
}

export interface MutableYieldFarm {
  readonly id: u32
  readonly loyaltyCurve: Option<PalletLiquidityMiningLoyaltyCurve>
  readonly state: PalletLiquidityMiningFarmState
  updatedAt: BN
  totalShares: BN
  totalValuedShares: BN
  accumulatedRpvs: BN
  accumulatedRpz: BN
  multiplier: BN
  entriesCount: BN
  leftToDistribute: BN
}

export interface MutableGlobalFarm {
  readonly id: u32
  readonly incentivizedAsset: u32
  readonly owner: AccountId32
  readonly rewardCurrency: u32
  updatedAt: BN
  totalSharesZ: BN
  accumulatedRpz: BN
  accumulatedRewards: BN
  paidAccumulatedRewards: BN
  yieldPerPeriod: BN
  plannedYieldingPeriods: BN
  blocksPerPeriod: BN
  maxRewardPerPeriod: BN
  minDeposit: BN
  liveYieldFarmsCount: BN
  totalYieldFarmsCount: BN
  priceAdjustment: BN
}

export const getAccountResolver =
  (api: ApiPromise) =>
  (sub: u32 | number): AccountId32 => {
    // TYPE_ID based on Substrate
    const TYPE_ID = "modl"

    // TODO: obtain the pallet ID from api.consts.xykWarehouseLM.palletId
    const PALLET_ID = "0x57686f7573654c6d"

    return new GenericAccountId32(
      api.registry,
      padEndU8a(
        u8aConcat(
          TYPE_ID,
          PALLET_ID,
          typeof sub !== "number" ? sub.toU8a() : [sub],
        ),
        32,
      ),
    )
  }

export class XYKLiquidityMiningClaimSim {
  protected get_account: (sub: u32 | number) => AccountId32
  protected multiCurrency: MultiCurrencyContainer

  constructor(
    addressResolver: (sub: u32 | number) => AccountId32,
    multiCurrency: MultiCurrencyContainer,
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

    let left_to_distribute = this.multiCurrency
      .free_balance(global_farm.rewardCurrency, global_farm_account)
      .minus(reward_currency_ed)

    let reward = reward_per_period.multipliedBy(periods_since_last_update)
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
        liquidityMining.calculate_accumulated_rps(
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
      liquidityMining.calculate_reward(
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
      liquidityMining.calculate_accumulated_rps(
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
          liquidityMining.calculate_adjusted_shares(
            global_farm.totalSharesZ.toFixed(),
            global_farm.priceAdjustment.toFixed(),
          )!,
        )

        let rewards = new BN(
          liquidityMining.calculate_global_farm_reward_per_period(
            global_farm.yieldPerPeriod.toFixed(),
            total_shares_z_adjusted.toFixed(),
            global_farm.maxRewardPerPeriod.toFixed(),
          )!,
        )

        this.update_global_farm(global_farm, current_period, rewards)
      }

      let stake_in_global_farm = new BN(
        liquidityMining.calculate_global_farm_shares(
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

      loyaltyMultiplier = liquidityMining.calculate_loyalty_multiplier(
        periods.toFixed(),
        initialRewardPercentage.toBigNumber().toFixed(),
        scaleCoef.toBigNumber().toFixed(),
      )!
    }
    return loyaltyMultiplier
  }

  claim_rewards(
    mutableGlobalFarm: MutableGlobalFarm,
    mutableYieldFarm: MutableYieldFarm,
    farmEntry: PalletLiquidityMiningYieldFarmEntry,
    relaychainBlockNumber: BN,
  ) {
    // if yield farm is terminated, cannot claim
    if (mutableYieldFarm.state.isTerminated.valueOf()) {
      return null
    }

    const currentPeriod = relaychainBlockNumber.dividedToIntegerBy(
      mutableGlobalFarm.blocksPerPeriod,
    )

    // avoid double claiming, if possible
    if (farmEntry.updatedAt.toBigNumber().eq(currentPeriod)) {
      return null
    }

    let periods = currentPeriod.minus(farmEntry.enteredAt.toBigNumber())

    if (mutableYieldFarm.state.isStopped.valueOf()) {
      periods = mutableYieldFarm.updatedAt.minus(
        farmEntry.enteredAt.toBigNumber(),
      )
    } else {
      // calculate possible values for entry farms
      this.maybe_update_farms(
        mutableGlobalFarm,
        mutableYieldFarm,
        currentPeriod,
      )
    }

    // calculate loyalty multiplier
    let loyaltyMultiplier = this.get_loyalty_multiplier(
      periods,
      mutableYieldFarm.loyaltyCurve,
    )

    // calculate rewards
    // TODO: shouldn't we also get the unclaimable rewards?
    const reward = new BN(
      liquidityMining.calculate_user_reward(
        farmEntry.accumulatedRpvs.toBigNumber().toFixed(),
        farmEntry.valuedShares.toBigNumber().toFixed(),
        farmEntry.accumulatedClaimedRewards.toBigNumber().toFixed(),
        mutableYieldFarm.accumulatedRpvs.toFixed(),
        loyaltyMultiplier,
      ),
    )

    if (!reward.isZero()) {
      mutableYieldFarm.leftToDistribute =
        mutableYieldFarm.leftToDistribute.minus(reward)

      // TODO: update farm entries, but it seems
      // like we're not going to claim same
      // farm entry multiple times
    }

    return reward
  }
}
