import { BN_0 } from "utils/constants"
import BN from "bignumber.js"
import { useBestNumber } from "api/chain"
import { useUsdPeggedAsset } from "api/asset"
import { usePoolFarms } from "utils/farms/apr"
import { PoolBase } from "@galacticcouncil/sdk"
import { useUserDeposits } from "utils/farms/deposits"
import { useApiPromise } from "utils/api"
import { ToastMessage, useStore } from "state/store"
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
import { useSpotPrices } from "api/spotPrice"
import { DepositNftType } from "api/deposits"

export const useClaimableAmount = (
  pool: PoolBase,
  depositNft?: DepositNftType,
) => {
  const bestNumberQuery = useBestNumber()
  const userDeposits = useUserDeposits(pool.address)
  const farms = usePoolFarms(pool.address)
  const usd = useUsdPeggedAsset()

  const api = useApiPromise()
  const accountResolver = getAccountResolver(api.registry)

  const assetIds = [
    ...new Set(farms.data?.map((i) => i.globalFarm.rewardCurrency.toString())),
  ]

  const assetList = useAssetDetailsList(assetIds)

  const usdSpotPrices = useSpotPrices(assetIds, usd.data?.id)

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

  const queries = [
    bestNumberQuery,
    userDeposits,
    farms,
    usd,
    assetList,
    accountBalances,
  ]
  const isLoading = queries.some((q) => q.isLoading)

  if (bestNumberQuery.data == null || accountBalances.data == null)
    return { data: null, isLoading }

  const deposits = depositNft != null ? [depositNft] : userDeposits.data ?? []
  const bestNumber = bestNumberQuery.data

  const multiCurrency = new MultiCurrencyContainer(
    accountAddresses,
    accountBalances.data,
  )
  const sim = new XYKLiquidityMiningClaimSim(
    getAccountResolver(api.registry),
    multiCurrency,
    assetList.data ?? [],
  )

  const { globalFarms, yieldFarms } = createMutableFarmEntries(farms.data ?? [])

  const rewardSum = deposits
    ?.map((record) =>
      record.deposit.yieldFarmEntries.map((farmEntry) => {
        const aprEntry = farms.data?.find(
          (i) =>
            i.globalFarm.id.eq(farmEntry.globalFarmId) &&
            i.yieldFarm.id.eq(farmEntry.yieldFarmId),
        )
        if (!aprEntry) return null

        const reward = sim.claim_rewards(
          globalFarms[aprEntry.globalFarm.id.toString()],
          yieldFarms[aprEntry.yieldFarm.id.toString()],
          farmEntry,
          bestNumber.relaychainBlockNumber.toBigNumber(),
        )

        const usd = usdSpotPrices.find(
          (spot) => spot.data?.tokenIn === reward?.assetId,
        )?.data

        if (!reward || !usd) return null

        return {
          usd: reward.value.multipliedBy(usd.spotPrice),
          asset: { id: reward?.assetId, value: reward.value },
        }
      }),
    )
    .flat(2)
    .reduce<{
      usd: BN
      assets: Record<string, BN>
    }>(
      (memo, item) => {
        if (item == null) return memo

        const { id, value } = item.asset

        memo.usd = memo.usd.plus(item.usd)

        !memo.assets[id]
          ? (memo.assets[id] = value)
          : (memo.assets[id] = memo.assets[id].plus(value))

        return memo
      },
      { usd: BN_0, assets: {} },
    )

  return { data: rewardSum, isLoading }
}

export const useClaimAllMutation = (
  poolId: string,
  depositNft?: DepositNftType,
  toast?: ToastMessage,
) => {
  const api = useApiPromise()
  const { createTransaction } = useStore()
  const userDeposits = useUserDeposits(poolId)

  const deposits = depositNft ? [depositNft] : userDeposits.data

  const claim = useMutation(async () => {
    const txs =
      deposits
        ?.map((i) =>
          i.deposit.yieldFarmEntries.map((entry) => {
            return api.tx.xykLiquidityMining.claimRewards(
              i.id,
              entry.yieldFarmId,
            )
          }),
        )
        .flat(2) ?? []

    if (txs.length > 1) {
      return await createTransaction(
        {
          tx: api.tx.utility.batch(txs),
        },
        { toast },
      )
    } else if (txs.length > 0) {
      return await createTransaction(
        {
          tx: txs[0],
        },
        { toast },
      )
    }
  })

  return { mutation: claim, isLoading: userDeposits.isLoading }
}

// @ts-expect-error
window.decodeAddressToBytes = (bsx: string) => u8aToHex(decodeAddress(bsx))
