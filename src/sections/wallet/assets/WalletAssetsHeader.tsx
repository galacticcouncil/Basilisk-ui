import BigNumber from "bignumber.js"
import { Separator } from "components/Separator/Separator"
import { Heading } from "components/Typography/Heading/Heading"
import { Text } from "components/Typography/Text/Text"
import { useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"
import { useUsersTotalLocked } from "sections/pools/header/PoolsHeader.utils"
import { theme } from "theme"
import { separateBalance } from "utils/balance"
import { BN_0 } from "utils/constants"
import { AssetsTableData } from "./table/WalletAssetsTable.utils"

type Props = {
  assetsData?: AssetsTableData[]
  isLoading?: boolean
}

export const WalletAssetsHeader = ({ assetsData, isLoading }: Props) => {
  const { t } = useTranslation()
  const totalUsd = useMemo(() => {
    if (!assetsData) return null

    return assetsData.reduce((acc, cur) => {
      if (!cur.totalUSD.isNaN()) {
        return acc.plus(cur.totalUSD)
      }
      return acc
    }, BN_0)
  }, [assetsData])

  const transferableUsd = useMemo(() => {
    if (!assetsData) return null

    return assetsData.reduce((acc, cur) => {
      if (!cur.transferableUSD.isNaN()) {
        return acc.plus(cur.transferableUSD)
      }
      return acc
    }, BN_0)
  }, [assetsData])

  const totalLocked = useUsersTotalLocked()

  return (
    <div
      sx={{ flex: ["column", "row"], mb: [28, 56], gap: [0, 16] }}
      css={{ flexWrap: "wrap" }}
    >
      <WalletAssetsHeaderValue
        isLoading={isLoading}
        value={totalUsd}
        label={t("wallet.assets.header.total")}
      />

      <Separator
        sx={{ mb: 15, display: ["inherit", "none"] }}
        css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
      />

      <WalletAssetsHeaderValue
        isLoading={isLoading}
        value={transferableUsd}
        label={t("wallet.assets.header.transferable")}
      />

      <Separator
        sx={{ mb: 15, display: ["inherit", "none"] }}
        css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
      />

      <WalletAssetsHeaderValue
        isLoading={totalLocked.isLoading}
        value={totalLocked.data}
        label={t("wallet.assets.header.totalInPools")}
      />
    </div>
  )
}

export const WalletAssetsHeaderValue = (props: {
  isLoading?: boolean
  value?: BigNumber | null
  label: string
}) => {
  const { t } = useTranslation()

  return (
    <div
      sx={{
        flexGrow: 1,
        flex: ["row", "column"],
        justify: "space-between",
        align: ["center", "start"],
        mb: [15, 0],
      }}
    >
      <Text color="neutralGray300" sx={{ fontSize: [14, 16], mb: [0, 14] }}>
        {props.label}
      </Text>

      {props.isLoading ? (
        <Skeleton sx={{ width: [97, 208], height: [27, 42] }} />
      ) : (
        props.value && (
          <Heading as="h3" sx={{ fontSize: [16, 52], fontWeight: 900 }}>
            <Trans
              t={t}
              i18nKey="wallet.assets.header.value"
              tOptions={{
                ...separateBalance(props.value, {
                  numberPrefix: "$",
                  type: "dollar",
                }),
              }}
            >
              <span
                sx={{ fontSize: [16, 26] }}
                css={{ color: `rgba(${theme.rgbColors.white}, 0.4);` }}
              />
            </Trans>
          </Heading>
        )
      )}
    </div>
  )
}
