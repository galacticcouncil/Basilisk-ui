import { z } from "zod"
import { BN } from "@polkadot/util"
import { BN_10 } from "./constants"
import { Maybe } from "./types"
import BigNumber from "bignumber.js"
import { getFormatSeparators } from "./formatting"

export const getFloatingPointAmount = (
  amount: BigNumber,
  decimals: string | number = 12,
) => {
  const parsedDecimals =
    typeof decimals === "string" ? parseInt(decimals, 10) : decimals
  return new BigNumber(amount).dividedBy(BN_10.pow(parsedDecimals))
}

export const getFixedPointAmount = (
  amount: BigNumber,
  decimals: string | number,
) => {
  const parsedDecimals =
    typeof decimals === "string" ? parseInt(decimals, 10) : decimals

  return new BigNumber(amount).times(BN_10.pow(parsedDecimals))
}

/** Handle BigNumber rendering */
const BigNumberLike = z.union([
  z.number(),
  z.string(),
  z.object({ toString: z.unknown() }).passthrough(),
])

type BigNumberLikeType = BN | BigNumber | number | string

function normalizeBigNumber(value: Maybe<BigNumberLikeType>): BigNumber | null {
  if (value == null) return null

  // BigNumber.js instance
  if (BigNumber.isBigNumber(value)) return value

  // BN.js instance returned from @polkadot-js/api
  if (BN.isBN(value)) return new BigNumber(value.toString())

  // string value, return NaN if not a number (parsing a string value)
  if (typeof value === "string") {
    const res = new BigNumber(value)
    if (res.isNaN()) return !res.isNaN() ? res : null
  }

  return new BigNumber(value)
}

export const BalanceFormatOptionsSchema = z
  .object({
    fixedPointScale: BigNumberLike.optional(),
    decimalPlaces: BigNumberLike.optional(),
    numberPrefix: z.string().optional(),
    numberSuffix: z.string().optional(),
    numberNotation: z.enum(["human", "raw"]).default("human").optional(),
  })
  .refine((data) => Object.keys(data).length >= 1)

export type BalanceFormatOptions = z.infer<typeof BalanceFormatOptionsSchema>

export function formatBigNumber(
  value: Maybe<BigNumberLikeType>,
  options?: Maybe<z.infer<typeof BalanceFormatOptionsSchema>>,
  locale?: string | string[],
) {
  let num = normalizeBigNumber(value)
  if (num == null) {
    if (typeof value === "string") return value
    return null
  }

  const localeOptions = getFormatSeparators(locale)

  const config = {
    prefix: options?.numberPrefix ?? "",
    suffix: options?.numberSuffix ?? "",
    decimalSeparator: localeOptions.decimal ?? ".",
    groupSeparator: localeOptions.group ?? ",",
    groupSize: 3,
  }

  if (options?.fixedPointScale != null) {
    num = num.div(BN_10.pow(options.fixedPointScale?.toString()))
  }

  if (options?.numberNotation === "raw") {
    config.groupSeparator = ""
  } else if (options?.numberNotation === "human") {
    config.groupSeparator = ","
  }

  if (options?.decimalPlaces != null) {
    return num.toFormat(
      Number.parseInt(options.decimalPlaces?.toString(), 10),
      config,
    )
  }

  return num.toFormat(config)
}
