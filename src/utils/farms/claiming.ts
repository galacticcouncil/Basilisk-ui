import { BN_0 } from "utils/constants"
import BN from "bignumber.js"
import { useBestNumber } from "api/chain"
import { useUsdPeggedAsset } from "api/asset"
import { usePoolFarms } from "utils/farms/apr"
import { PoolBase } from "@galacticcouncil/sdk"
import { useUserDeposits } from "utils/farms/deposits"
import { useApiPromise } from "utils/api"
import { useStore } from "state/store"
import { useMutation } from "@tanstack/react-query"
import { u32 } from "@polkadot/types"
import { AccountId32 } from "@polkadot/types/interfaces"
import { decodeAddress } from "@polkadot/util-crypto"
import { u8aToHex } from "@polkadot/util"
import { useTokenAccountBalancesList } from "api/accountBalances"
import {
  getAccountResolver,
  MultiCurrencyContainer,
  XYKLiquidityMiningClaimSim,
  MutableYieldFarm,
  MutableGlobalFarm,
} from "./claiming.utils"
import { useAssetDetailsList } from "api/assetDetails"
import * as liquidityMining from "@galacticcouncil/math/build/liquidity-mining/bundler"

export const useClaimableAmount = (pool: PoolBase) => {
  const bestNumberQuery = useBestNumber()
  const deposits = useUserDeposits(pool.address)
  const farms = usePoolFarms(pool.address)
  const usd = useUsdPeggedAsset()
  const queries = [deposits, bestNumberQuery, farms, usd]
  const isLoading = queries.some((q) => q.isLoading)

  const api = useApiPromise()
  const accountResolver = getAccountResolver(api.registry)

  const accountAddresses =
    farms.data
      ?.map(
        ({ yieldFarm, globalFarm }) =>
          [
            [accountResolver(0), globalFarm.rewardCurrency],
            [accountResolver(yieldFarm.id), globalFarm.rewardCurrency],
            [accountResolver(globalFarm.id), globalFarm.rewardCurrency],
          ] as [AccountId32, u32][],
      )
      .flat(1) ?? []

  const accountBalances = useTokenAccountBalancesList(accountAddresses)

  const assetList = useAssetDetailsList(
    farms.data?.map(({ globalFarm }) => globalFarm.rewardCurrency),
  )

  if (bestNumberQuery.data == null || accountBalances.data == null)
    return { data: null, isLoading }

  const bestNumber = bestNumberQuery.data

  const multiCurrency = new MultiCurrencyContainer(
    accountAddresses,
    accountBalances.data,
  )
  const sim = new XYKLiquidityMiningClaimSim(
    getAccountResolver(api.registry),
    multiCurrency,
    liquidityMining,
    assetList.data ?? [],
  )

  const mutableYieldFarms: Record<string, MutableYieldFarm> = {}
  const mutableGlobalFarms: Record<string, MutableGlobalFarm> = {}

  farms.data?.forEach(({ globalFarm, yieldFarm }) => {
    mutableGlobalFarms[globalFarm.id.toString()] = {
      id: globalFarm.id,
      incentivizedAsset: globalFarm.incentivizedAsset,
      owner: globalFarm.owner,
      rewardCurrency: globalFarm.rewardCurrency,
      // PeriodOf<T>
      updatedAt: globalFarm.updatedAt.toBigNumber(),
      // Balance
      totalSharesZ: globalFarm.totalSharesZ.toBigNumber(),
      // FixedU128
      accumulatedRpz: globalFarm.accumulatedRpz.toBigNumber(),
      // Balance
      accumulatedRewards: globalFarm.accumulatedRewards.toBigNumber(),
      // Balance
      paidAccumulatedRewards: globalFarm.paidAccumulatedRewards.toBigNumber(),
      // Perquintill
      yieldPerPeriod: globalFarm.yieldPerPeriod.toBigNumber(),
      // PeriodOf<T>
      plannedYieldingPeriods: globalFarm.plannedYieldingPeriods.toBigNumber(),
      // BlockNumberFor<T>
      blocksPerPeriod: globalFarm.blocksPerPeriod.toBigNumber(),
      // Balance
      maxRewardPerPeriod: globalFarm.maxRewardPerPeriod.toBigNumber(),
      // Balance
      minDeposit: globalFarm.minDeposit.toBigNumber(),
      // u32
      liveYieldFarmsCount: globalFarm.liveYieldFarmsCount.toBigNumber(),
      // u32
      totalYieldFarmsCount: globalFarm.totalYieldFarmsCount.toBigNumber(),
      // FixedU128
      priceAdjustment: globalFarm.priceAdjustment.toBigNumber(),
    }

    mutableYieldFarms[yieldFarm.id.toString()] = {
      id: yieldFarm.id,
      // PeriodOf<T>
      updatedAt: yieldFarm.updatedAt.toBigNumber(),
      // Balance
      totalShares: yieldFarm.totalShares.toBigNumber(),
      // Balance
      totalValuedShares: yieldFarm.totalValuedShares.toBigNumber(),
      // FixedU128
      accumulatedRpvs: yieldFarm.accumulatedRpvs.toBigNumber(),
      // FixedU128
      accumulatedRpz: yieldFarm.accumulatedRpz.toBigNumber(),
      // FarmMultiplier
      multiplier: yieldFarm.multiplier.toBigNumber(),
      // u64
      entriesCount: yieldFarm.entriesCount.toBigNumber(),
      // Balance
      leftToDistribute: yieldFarm.leftToDistribute.toBigNumber(),
      loyaltyCurve: yieldFarm.loyaltyCurve,
      state: yieldFarm.state,
    }
  })

  const data = deposits.data
    ?.map((record) => {
      return record.deposit.yieldFarmEntries.map((farmEntry) => {
        try {
          const aprEntry = farms.data?.find(
            (i) =>
              i.globalFarm.id.eq(farmEntry.globalFarmId) &&
              i.yieldFarm.id.eq(farmEntry.yieldFarmId),
          )

          if (!aprEntry) return null
          return sim.claim_rewards(
            mutableGlobalFarms[aprEntry.globalFarm.id.toString()],
            mutableYieldFarms[aprEntry.yieldFarm.id.toString()],
            farmEntry,
            bestNumber.relaychainBlockNumber.toBigNumber(),
          )
        } catch (err) {
          console.error(err)
          return null
        }
      })
    })
    .flat(2)
    .reduce<BN>((memo, item) => memo.plus(item ?? BN_0), BN_0)

  return { data, isLoading }
}

export const useClaimAllMutation = (poolId: string) => {
  const api = useApiPromise()
  const { createTransaction } = useStore()
  const deposits = useUserDeposits(poolId)

  const claim = useMutation(async () => {
    const txs =
      deposits.data
        ?.map((i) =>
          i.deposit.yieldFarmEntries.map((entry) => {
            return api.tx.xykLiquidityMining.claimRewards(
              i.id,
              entry.yieldFarmId,
            )
          }),
        )
        .flat(2) ?? []

    if (txs.length) {
      return await createTransaction({
        tx: api.tx.utility.batch(txs),
      })
    }
  })

  return { mutation: claim, isLoading: deposits.isLoading }
}

// @ts-expect-error
window.decodeAddressToBytes = (bsx: string) => u8aToHex(decodeAddress(bsx))
