import "interfaces/augment-bignumber"

import { describe, expect, test } from "vitest"
import { Struct, TypeRegistry, U128, U32 } from "@polkadot/types"
import { Codec, CodecClass, Registry } from "@polkadot/types/types"
import { OrmlTokensAccountData } from "@polkadot/types/lookup"

// We need to import nodejs due to issues with vitest and the inability to resolve imports
import * as liquidityMining from "@galacticcouncil/math/build/liquidity-mining/nodejs"
import BN from "bignumber.js"

import {
  getAccountResolver,
  MultiCurrencyContainer,
  XYKLiquidityMiningClaimSim,
} from "./claiming.utils"

const registry = new TypeRegistry()

const createStruct = <T>(
  registry: Registry,
  pairs: Record<string, [string | CodecClass<Codec>, unknown]>,
) => {
  return new (Struct.with(
    Object.fromEntries(
      Object.entries(pairs).map(([key, [_class]]) => [key, _class]),
    ),
  ))(
    registry,
    Object.fromEntries(
      Object.entries(pairs).map(([key, [_, instance]]) => [key, instance]),
    ),
  ) as unknown as T
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
