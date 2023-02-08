import { PoolBase } from "@galacticcouncil/sdk"
import BigNumber from "bignumber.js"
import { TFunction } from "react-i18next"
import { BN_10 } from "utils/constants"

export const getValidationRules = (
  balance: BigNumber,
  decimals: string,
  t: TFunction<"translation", undefined>,
) => ({
  required: t("error.required"),
  validate: {
    validNumber: (value: string) => {
      try {
        if (!new BigNumber(value).isNaN()) return true
      } catch {}
      return t("error.validNumber")
    },
    positive: (value: string) =>
      new BigNumber(value).gt(0) || t("error.positive"),
    maxBalance: (value: string) => {
      try {
        if (!balance) throw new Error("Missing asset meta")
        if (balance.gte(BigNumber(value).multipliedBy(BN_10.pow(decimals))))
          return true
      } catch {}
      return t("liquidity.add.modal.validation.notEnoughBalance")
    },
  },
})

export const getAllowedTokensId = (
  pools: PoolBase[] | undefined,
  pairedTokenId: string,
) =>
  pools?.reduce((acc, item) => {
    if (item.tokens.some((token) => token.id === pairedTokenId)) {
      const allowedTokenId = item.tokens.find(
        (token) => token.id !== pairedTokenId,
      )?.id
      if (allowedTokenId) acc.push(allowedTokenId)
    }
    return acc
  }, [] as string[])

export const opposite = (value: "assetA" | "assetB") =>
  value === "assetA" ? "assetB" : "assetA"
