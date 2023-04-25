import "interfaces/augment-bignumber"

import { test, expect } from "vitest"
import {
  TypeRegistry,
  U32,
  U64,
  U128,
  UInt,
  Text,
  Option,
  Struct,
  Enum,
  GenericAccountId,
  GenericAccountId32,
} from "@polkadot/types"

import { XYKLiquidityMiningClaimSim } from "utils/farms/claiming/claimSimulator"
import { getAccountResolver } from "utils/farms/claiming/accountResolver"
import { MultiCurrencyContainer } from "utils/farms/claiming/multiCurrency"
import { createMutableFarmEntries } from "./mutableFarms"
import { createEnum, createStruct } from "utils/test/createTestApi"
import {
  PalletLiquidityMiningFarmState,
  PalletLiquidityMiningGlobalFarmData,
  PalletLiquidityMiningLoyaltyCurve,
  PalletLiquidityMiningYieldFarmData,
  PalletLiquidityMiningYieldFarmEntry,
} from "@polkadot/types/lookup"
import { decodeAddress } from "@polkadot/util-crypto"
import BigNumber from "bignumber.js"
import BN from "bn.js"

const registry = new TypeRegistry()

test("create mock type registry", () => {
  const accountResolver = getAccountResolver(registry)

  const multiCurrency = new MultiCurrencyContainer(
    [
      [
        new GenericAccountId32(
          registry,
          decodeAddress("5EYCAe5diR59yJu1zi5jdbXWTzCk5nbR65wdmsWerp64Meis"),
        ),
        new U32(registry, "0"),
      ],
      [
        new GenericAccountId32(
          registry,
          decodeAddress("5EYCAe5diR59yJu1zi8T3ryPavxifKcASoLjHJP1V4qM3zvk"),
        ),
        new U32(registry, "0"),
      ],
      [
        new GenericAccountId32(
          registry,
          decodeAddress("5EYCAe5diR59yJu1zi5jdbXWTzCk5nbR65wdmsWerp64Meis"),
        ),
        new U32(registry, "4"),
      ],
      [
        new GenericAccountId32(
          registry,
          decodeAddress("5EYCAe5diR59yJu1zi8zXv4ZovK7aRouv9DkPBkgQiaob13o"),
        ),
        new U32(registry, "4"),
      ],
    ],
    [
      {
        free: new BN("45648785307383066"),
        reserved: new BN("0"),
        frozen: new BN("0"),
      },
      {
        free: new BN("114952291739703942493"),
        reserved: new BN("0"),
        frozen: new BN("0"),
      },
      {
        free: new BN("15539959710296"),
        reserved: new BN("0"),
        frozen: new BN("0"),
      },
      {
        free: new BN("8984460040289704"),
        reserved: new BN("0"),
        frozen: new BN("0"),
      },
    ],
  )

  const entries = createMutableFarmEntries([
    {
      globalFarm: createStruct<PalletLiquidityMiningGlobalFarmData>(registry, {
        id: [U32, new U32(registry, "10")],
        owner: [
          GenericAccountId,
          decodeAddress("bXhmisFH9dL7obCbbNLXqZbsGvANArBQWeFSrJ2ZMQ3uK3tXg"),
        ],
        updatedAt: [U32, new U32(registry, "1560649")],
        totalSharesZ: [
          U128,
          new U128(registry, "0x0000000000000015bfc66805b7497cb0"),
        ],
        accumulatedRpz: [
          U128,
          new U128(registry, "0x0000000000000000001e209208975110"),
        ],
        rewardCurrency: [U32, new U32(registry, "0")],
        pendingRewards: [U128, new U128(registry, "3075389218210")],
        accumulatedPaidRewards: [
          U128,
          new U128(registry, "0x000000000000000000a97b9ce8510501"),
        ],
        yieldPerPeriod: [UInt, new UInt(registry, "304414003044")],
        plannedYieldingPeriods: [U32, new U32(registry, "151200")],
        blocksPerPeriod: [U32, new U32(registry, "2")],
        incentivizedAsset: [U32, new U32(registry, "0")],
        maxRewardPerPeriod: [U128, new U128(registry, "760582010582010")],
        minDeposit: [U128, new U128(registry, "1000")],
        liveYieldFarmsCount: [U32, new U32(registry, "2")],
        totalYieldFarmsCount: [U32, new U32(registry, "2")],
        priceAdjustment: [
          U128,
          new U128(registry, "0x00000000000000000de0b6b3a7640000"),
        ],
        state: [
          Enum,
          createEnum<PalletLiquidityMiningFarmState>(registry, {
            Active: [Text, new Text(registry, "Active")],
            Stopped: [Text],
            Terminated: [Text],
          }),
        ],
      }),

      yieldFarm: createStruct<PalletLiquidityMiningYieldFarmData>(registry, {
        id: [U32, new U32(registry, "14")],
        updatedAt: [U32, new U32(registry, "1560633")],
        totalShares: [
          U128,
          new U128(registry, "0x000000000000000006de55f7818e8cc1"),
        ],
        totalValuedShares: [
          U128,
          new U128(registry, "0x000000000000000008c33d5e7e6228fd"),
        ],
        accumulatedRpvs: [
          U128,
          new U128(registry, "0x0000000000000000001e1c2400c65aa8"),
        ],
        accumulatedRpz: [
          U128,
          new U128(registry, "0x0000000000000000001e1c2400c65ad1"),
        ],
        loyaltyCurve: [
          Option,
          new Option(
            registry,
            Struct,
            createStruct<PalletLiquidityMiningLoyaltyCurve>(registry, {
              initialRewardPercentage: [
                U128,
                new U128(registry, "0x000000000000000006f05b59d3b20000"),
              ],
              scaleCoef: [U32, new U32(registry, "50000")],
            }),
          ),
        ],
        multiplier: [
          U128,
          new U128(registry, "0x00000000000000000de0b6b3a7640000"),
        ],
        entriesCount: [U64, new U64(registry, "3")],
        totalStopped: [U32, new U32(registry, "0")],
        leftToDistribute: [U128, new U128(registry, "360825852820805")],
        state: [
          Enum,
          createEnum<PalletLiquidityMiningFarmState>(registry, {
            Active: [Text, new Text(registry, "Active")],
            Stopped: [Text],
            Terminated: [Text],
          }),
        ],
      }),
    },

    {
      globalFarm: createStruct<PalletLiquidityMiningGlobalFarmData>(registry, {
        id: [U32, new U32(registry, "12")],
        owner: [
          GenericAccountId,
          decodeAddress("bXhmisFH9dL7obCbbNLXqZbsGvANArBQWeFSrJ2ZMQ3uK3tXg"),
        ],
        updatedAt: [U32, new U32(registry, "1560635")],
        totalSharesZ: [U128, new U128(registry, "2134366411045150")],
        accumulatedRpz: [
          U128,
          new U128(registry, "0x00000000000000000019f61f44eb77c9"),
        ],
        rewardCurrency: [U32, new U32(registry, "4")],
        pendingRewards: [U128, new U128(registry, "15533733441408")],
        accumulatedPaidRewards: [U128, new U128(registry, "6226268888")],
        yieldPerPeriod: [UInt, new UInt(registry, "262557077625")],
        plannedYieldingPeriods: [U32, new U32(registry, "151200")],
        blocksPerPeriod: [U32, new U32(registry, "2")],
        incentivizedAsset: [U32, new U32(registry, "4")],
        maxRewardPerPeriod: [U128, new U128(registry, "59523809523")],
        minDeposit: [U128, new U128(registry, "1000")],
        liveYieldFarmsCount: [U32, new U32(registry, "2")],
        totalYieldFarmsCount: [U32, new U32(registry, "2")],
        priceAdjustment: [
          U128,
          new U128(registry, "0x00000000000000000de0b6b3a7640000"),
        ],
        state: [
          Enum,
          createEnum<PalletLiquidityMiningFarmState>(registry, {
            Active: [Text, new Text(registry, "Active")],
            Stopped: [Text],
            Terminated: [Text],
          }),
        ],
      }),

      yieldFarm: createStruct<PalletLiquidityMiningYieldFarmData>(registry, {
        id: [U32, new U32(registry, "15")],
        updatedAt: [U32, new U32(registry, "1560635")],
        totalShares: [
          U128,
          new U128(registry, "0x000000000000000006dac878dcc80cc1"),
        ],
        totalValuedShares: [U128, new U128(registry, "8638361715185")],
        accumulatedRpvs: [
          U128,
          new U128(registry, "0x00000000000000000019f61f44df5fe7"),
        ],
        accumulatedRpz: [
          U128,
          new U128(registry, "0x00000000000000000019f61f44eb77c9"),
        ],
        loyaltyCurve: [
          Option,
          new Option(
            registry,
            Struct,
            createStruct<PalletLiquidityMiningLoyaltyCurve>(registry, {
              initialRewardPercentage: [
                U128,
                new U128(registry, "0x000000000000000006f05b59d3b20000"),
              ],
              scaleCoef: [U32, new U32(registry, "50000")],
            }),
          ),
        ],
        multiplier: [
          U128,
          new U128(registry, "0x00000000000000000de0b6b3a7640000"),
        ],
        entriesCount: [U64, new U64(registry, "2")],
        totalStopped: [U32, new U32(registry, "0")],
        leftToDistribute: [U128, new U128(registry, "6226268888")],
        state: [
          Enum,
          createEnum<PalletLiquidityMiningFarmState>(registry, {
            Active: [Text, new Text(registry, "Active")],
            Stopped: [Text],
            Terminated: [Text],
          }),
        ],
      }),
    },
  ])

  const simulator = new XYKLiquidityMiningClaimSim(
    accountResolver,
    multiCurrency,
    [
      {
        id: "0",
        existentialDeposit: new BigNumber("0"),
      },
      {
        id: "4",
        existentialDeposit: new BigNumber("10000000000"),
      },
    ],
  )

  const result = simulator.claim_rewards(
    entries.globalFarms["10"],
    entries.yieldFarms["14"],
    createStruct<PalletLiquidityMiningYieldFarmEntry>(registry, {
      globalFarmId: [U32, new U32(registry, "10")],
      yieldFarmId: [U32, new U32(registry, "14")],
      valuedShares: [
        U128,
        new U128(registry, "0x000000000000000000944bf43bacbc41"),
      ],
      stoppedAtCreation: [U32, new U32(registry, "0")],
      accumulatedRpvs: [U128, new U128(registry, "0")],
      accumulatedClaimedRewards: [U128, new U128(registry, "0")],
      enteredAt: [U32, new U32(registry, "1532800")],
      updatedAt: [U32, new U32(registry, "1532800")],
    }),
    new BigNumber("3381894"),
  )

  expect(result?.value.toString()).toEqual(
    "1,768,269,562,563,345".replaceAll(",", ""),
  )
  expect(result?.assetId.toString()).toEqual("0")
})
