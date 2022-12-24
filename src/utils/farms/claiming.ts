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
import { XYKLiquidityMiningClaimSim } from "utils/farms/claiming/claimSimulator"
import { getAccountResolver } from "utils/farms/claiming/accountResolver"
import { MultiCurrencyContainer } from "utils/farms/claiming/multiCurrency"
import { createMutableFarmEntries } from "utils/farms/claiming/mutableFarms"
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
        ({ globalFarm }) =>
          [
            [accountResolver(0), globalFarm.rewardCurrency],
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

  const { globalFarms, yieldFarms } = createMutableFarmEntries(farms.data ?? [])

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
            globalFarms[aprEntry.globalFarm.id.toString()],
            yieldFarms[aprEntry.yieldFarm.id.toString()],
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
