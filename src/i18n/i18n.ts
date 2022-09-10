import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import translationEN from "./locales/en/translations.json"
import { formatDate, formatNum } from "utils/formatting"
import BN from "bignumber.js"
import { getFullDisplayBalance } from "../utils/balance"
import BigNumber from "bignumber.js"
import { BN_10 } from "utils/constants"

function isBalanceWithSettings(value: any): value is {
  value: BigNumber
  decimals?: string | number
  displayDecimals?: string | number
} {
  return value !== null && "value" in value
}

function isFormatParams(x: unknown): x is Record<string, unknown> {
  return x != null && !Array.isArray(x) && typeof x === "object"
}

function isPrecisionFormatParams(
  x: unknown,
): x is { precision: BigNumber | number } {
  return (
    x != null &&
    "precision" in x &&
    (BigNumber.isBigNumber(x["precision"]) ||
      typeof x["precision"] === "number")
  )
}

function convertBigNumberToString(
  value: BN | BigNumber | number | null | undefined,
  options: Record<string, unknown> | undefined,
) {
  if (value == null) return null
  if (typeof value === "number") return value.toString()
  let bn: BigNumber = BN.isBigNumber(value)
    ? new BigNumber(value.toString())
    : value

  if (
    options != null &&
    typeof options.interpolationkey === "string" &&
    isFormatParams(options.formatParams)
  ) {
    const params = options.formatParams[options.interpolationkey]
    if (isPrecisionFormatParams(params)) {
      bn = bn.div(BN_10.pow(params.precision))
    }
  }

  return bn.toFixed()
}

const resources = {
  en: { translation: translationEN },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "en",
    lng: "en",
    interpolation: {
      format(value, format, lng, options) {
        if (format === "balance") {
          if (!value) {
            return "-"
          }

          if (isBalanceWithSettings(value)) {
            return getFullDisplayBalance(
              value.value,
              value.decimals,
              value.displayDecimals,
            )
          }

          return getFullDisplayBalance(value)
        }

        if (format === "num") {
          const parsed = convertBigNumberToString(value, options)
          if (parsed == null) return null
          return formatNum(parsed, undefined, lng)
        }

        if (format === "compact") {
          const parsed = convertBigNumberToString(value, options)
          if (parsed == null) return null
          return formatNum(parsed, { notation: "compact" }, lng)?.toLowerCase()
        }

        if (value instanceof Date) {
          return formatDate(value, format || "")
        }

        return value
      },
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
