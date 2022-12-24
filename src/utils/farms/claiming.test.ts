import "interfaces/augment-bignumber"

import { describe, expect, test } from "vitest"
import {
  Struct,
  TypeRegistry,
  U128,
  U64,
  Bool,
  U32,
  UInt,
  Enum,
  Text,
  Option,
  GenericAccountId,
} from "@polkadot/types"
import { Codec, CodecClass, Registry } from "@polkadot/types/types"
import {
  OrmlTokensAccountData,
  PalletLiquidityMiningGlobalFarmData,
  PalletLiquidityMiningYieldFarmData,
  PalletLiquidityMiningFarmState,
} from "@polkadot/types/lookup"

// We need to import nodejs due to issues with vitest and the inability to resolve imports
import * as liquidityMining from "@galacticcouncil/math/build/liquidity-mining/nodejs"
import BN from "bignumber.js"

import {
  createMutableFarmEntries,
  getAccountResolver,
  MultiCurrencyContainer,
  XYKLiquidityMiningClaimSim,
} from "./claiming.utils"

const registry = new TypeRegistry()

type PairValueType = [string | CodecClass<Codec>, unknown]

const createStruct = <T extends Struct>(
  registry: Registry,
  pairs: Record<keyof Omit<T, keyof Struct>, PairValueType>,
) => {
  return new (Struct.with(
    Object.fromEntries(
      Object.entries<PairValueType>(pairs).map(([key, [_class]]) => [
        key,
        _class,
      ]),
    ),
  ))(
    registry,
    Object.fromEntries(
      Object.entries<PairValueType>(pairs).map(([key, [_, instance]]) => [
        key,
        instance,
      ]),
    ),
  ) as unknown as T
}

const createEnum = <T extends Enum>(
  registry: Registry,
  pairs: Record<keyof Omit<T, Exclude<keyof Enum, "type">>, PairValueType>,
) => {
  return new Enum(
    registry,
    Object.fromEntries(
      Object.entries<PairValueType>(pairs).map(([key, [_class]]) => [
        key,
        _class,
      ]),
    ),
    Object.fromEntries(
      Object.entries<PairValueType>(pairs).map(([key, [_, instance]]) => [
        key,
        instance,
      ]),
    ),
  ) as T
}

describe("multi currency container", () => {
  const asset = new U32(registry, 0)

  const accountResolver = getAccountResolver(registry)
  const walletA = accountResolver(0)
  const walletB = accountResolver(1)

  test("read multi currency container", () => {
    const multiCurrency = new MultiCurrencyContainer(
      [[walletA, asset]],
      [
        createStruct<OrmlTokensAccountData>(registry, {
          free: [U128, new U128(registry, 128)],
          reserved: [U128, new U128(registry, 256)],
          frozen: [U128, new U128(registry, 512)],
        }),
      ],
    )

    expect(multiCurrency.free_balance(asset, walletA).toFixed()).toEqual("128")
  })

  test("transfer multi currency container", () => {
    const multiCurrency = new MultiCurrencyContainer(
      [
        [walletA, asset],
        [walletB, asset],
      ],
      [
        createStruct<OrmlTokensAccountData>(registry, {
          free: [U128, new U128(registry, "128")],
          reserved: [U128, new U128(registry, "256")],
          frozen: [U128, new U128(registry, "512")],
        }),
        createStruct<OrmlTokensAccountData>(registry, {
          free: [U128, new U128(registry, 128)],
          reserved: [U128, new U128(registry, 256)],
          frozen: [U128, new U128(registry, 512)],
        }),
      ],
    )

    multiCurrency.transfer(asset, walletA, walletB, new BN(128))

    expect(multiCurrency.free_balance(asset, walletA).toFixed()).toEqual("0")
    expect(multiCurrency.free_balance(asset, walletB).toFixed()).toEqual("256")

    expect(() =>
      multiCurrency.transfer(asset, walletA, walletB, new BN(128)),
    ).toThrowError()
  })
})

describe("create mutable farms", () => {
  const accountResolver = getAccountResolver(registry)
  const owner = accountResolver(0)

  test("proper cloning", () => {
    const entries = createMutableFarmEntries([
      {
        globalFarm: createStruct<PalletLiquidityMiningGlobalFarmData>(
          registry,
          {
            id: [U32, new U32(registry, 0)],
            owner: [GenericAccountId, owner],
            updatedAt: [U32, new U32(registry, 0)],
            totalSharesZ: [U128, new U128(registry, 0)],
            accumulatedRpz: [U128, new U128(registry, 0)],
            rewardCurrency: [U32, new U32(registry, 0)],
            accumulatedRewards: [U128, new U128(registry, 0)],
            paidAccumulatedRewards: [U128, new U128(registry, 0)],
            yieldPerPeriod: [UInt, new UInt(registry, 0)],
            plannedYieldingPeriods: [U32, new U32(registry, 0)],
            blocksPerPeriod: [U32, new U32(registry, 0)],
            incentivizedAsset: [U32, new U32(registry, 0)],
            maxRewardPerPeriod: [U128, new U128(registry, 0)],
            minDeposit: [U128, new U128(registry, 0)],
            liveYieldFarmsCount: [U32, new U32(registry, 0)],
            totalYieldFarmsCount: [U32, new U32(registry, 0)],
            priceAdjustment: [U128, new U128(registry, 0)],
            state: [
              Enum,
              createEnum<PalletLiquidityMiningFarmState>(registry, {
                isActive: [Bool, false],
                isStopped: [Bool, false],
                isTerminated: [Bool, false],
                type: [Text, "Active"],
              }),
            ],
          },
        ),

        yieldFarm: createStruct<PalletLiquidityMiningYieldFarmData>(registry, {
          id: [U32, new U32(registry, 0)],
          updatedAt: [U32, new U32(registry, 0)],
          totalShares: [U128, new U128(registry, 0)],
          totalValuedShares: [U128, new U128(registry, 0)],
          accumulatedRpvs: [U128, new U128(registry, 0)],
          accumulatedRpz: [U128, new U128(registry, 0)],
          loyaltyCurve: [Option, new Option(registry, Struct, undefined)],
          multiplier: [U128, new U128(registry, 0)],
          entriesCount: [U64, new U64(registry, 0)],
          leftToDistribute: [U128, new U128(registry, 0)],
          state: [
            Enum,
            createEnum<PalletLiquidityMiningFarmState>(registry, {
              isActive: [Bool, false],
              isStopped: [Bool, false],
              isTerminated: [Bool, false],
              type: [Text, "Active"],
            }),
          ],
        }),
      },
    ])

    const globalFarm = entries.globalFarms["0"]

    expect(globalFarm.id.toString()).toEqual("0")
    expect(globalFarm.owner.toString()).toEqual(owner.toString())
    expect(globalFarm.updatedAt.toString()).toEqual("0")
    expect(globalFarm.rewardCurrency.toString()).toEqual("0")

    expect(globalFarm.updatedAt.toString()).toEqual("0")
    expect(globalFarm.totalSharesZ.toString()).toEqual("0")
    expect(globalFarm.accumulatedRpz.toString()).toEqual("0")
    expect(globalFarm.accumulatedRewards.toString()).toEqual("0")
    expect(globalFarm.paidAccumulatedRewards.toString()).toEqual("0")
    expect(globalFarm.yieldPerPeriod.toString()).toEqual("0")
    expect(globalFarm.plannedYieldingPeriods.toString()).toEqual("0")
    expect(globalFarm.blocksPerPeriod.toString()).toEqual("0")
    expect(globalFarm.maxRewardPerPeriod.toString()).toEqual("0")
    expect(globalFarm.minDeposit.toString()).toEqual("0")
    expect(globalFarm.liveYieldFarmsCount.toString()).toEqual("0")
    expect(globalFarm.totalYieldFarmsCount.toString()).toEqual("0")
    expect(globalFarm.priceAdjustment.toString()).toEqual("0")

    const yieldFarm = entries.yieldFarms["0"]

    expect(yieldFarm.id.toString()).toEqual("0")
    expect(yieldFarm.updatedAt.toString()).toEqual("0")
    expect(yieldFarm.totalShares.toString()).toEqual("0")
    expect(yieldFarm.totalValuedShares.toString()).toEqual("0")
    expect(yieldFarm.accumulatedRpvs.toString()).toEqual("0")
    expect(yieldFarm.accumulatedRpz.toString()).toEqual("0")
    expect(yieldFarm.loyaltyCurve.isEmpty).toEqual(true)
    expect(yieldFarm.multiplier.toString()).toEqual("0")
    expect(yieldFarm.entriesCount.toString()).toEqual("0")
    expect(yieldFarm.leftToDistribute.toString()).toEqual("0")
  })
})

test("create mock type registry", () => {
  const accountResolver = getAccountResolver(registry)
  const multiCurrency = new MultiCurrencyContainer([], [])

  const simulator = new XYKLiquidityMiningClaimSim(
    accountResolver,
    multiCurrency,
    liquidityMining,
    [],
  )
})
