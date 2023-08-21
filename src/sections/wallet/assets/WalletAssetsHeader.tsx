import BigNumber from "bignumber.js"
import { Separator } from "components/Separator/Separator"
import { Heading } from "components/Typography/Heading/Heading"
import { Text } from "components/Typography/Text/Text"
import { ReactNode, useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"
import { useUsersTotalLocked } from "sections/pools/header/PoolsHeader.utils"
import { theme } from "theme"
import { separateBalance } from "utils/balance"
import { BN_0 } from "utils/constants"
import { AssetsTableData } from "./table/WalletAssetsTable.utils"
import { useLiquidityPositionsTableData } from "./table/data/WalletLiquidityPositionsData.utils"
import { useTotalInUsersDeposits } from "utils/farms/deposits"
import { InfoTooltip } from "components/InfoTooltip/InfoTooltip"
import { SInfoIcon } from "components/InfoTooltip/InfoTooltip.styled"

type Props = {
  assetsData?: AssetsTableData[]
  lpData?: ReturnType<typeof useLiquidityPositionsTableData>["data"]
  isLoading?: boolean
}

export const WalletAssetsHeader = ({
  assetsData,
  lpData,
  isLoading,
}: Props) => {
  const { t } = useTranslation()

  const farms = useTotalInUsersDeposits()

  const totalUsd = useMemo(() => {
    if (!assetsData) return BN_0

    return assetsData.reduce((acc, cur) => {
      if (!cur.totalUSD.isNaN()) {
        return acc.plus(cur.totalUSD)
      }
      return acc
    }, BN_0)
  }, [assetsData])

  const lpAmount = useMemo(() => {
    if (!lpData) return BN_0
    return lpData.reduce((acc, { totalUsd }) => acc.plus(totalUsd), BN_0)
  }, [lpData])

  const totalBalance = farms.data?.plus(lpAmount).plus(totalUsd)

  const totalLocked = useUsersTotalLocked()

  const tooltipBalance = (
    <div sx={{ flex: "column", gap: 14, width: 220 }}>
      <Text fs={11}>{t("wallet.assets.header.total.tooltip.title")}</Text>

      <div sx={{ flex: "column", gap: 2 }}>
        <Text fs={8} tTransform="uppercase" color="neutralGray500">
          {t("wallet.assets.header.total.tooltip.assets")}
        </Text>
        <Text fs={12}>{t("value.usd", { amount: totalUsd })}</Text>
      </div>

      <div sx={{ flex: "column", gap: 2 }}>
        <Text fs={8} tTransform="uppercase" color="neutralGray500">
          {t("wallet.assets.header.total.tooltip.positions")}
        </Text>
        <Text fs={12}>{t("value.usd", { amount: lpAmount })}</Text>
      </div>

      <div sx={{ flex: "column", gap: 2 }}>
        <Text fs={8} tTransform="uppercase" color="neutralGray500">
          {t("wallet.assets.header.total.tooltip.farms")}
        </Text>
        <Text fs={12}>{t("value.usd", { amount: farms.data ?? BN_0 })}</Text>
      </div>
    </div>
  )

  const tooltipPools = (
    <div sx={{ flex: "column", gap: 14, width: 210 }}>
      <Text fs={11}>{t("wallet.assets.header.positions.tooltip.title")}</Text>

      <div sx={{ flex: "column", gap: 2 }}>
        <Text fs={8} tTransform="uppercase" color="neutralGray500">
          {t("wallet.assets.header.total.tooltip.positions")}
        </Text>
        <Text fs={12}>{t("value.usd", { amount: lpAmount })}</Text>
      </div>

      <div sx={{ flex: "column", gap: 2 }}>
        <Text fs={8} tTransform="uppercase" color="neutralGray500">
          {t("wallet.assets.header.total.tooltip.farms")}
        </Text>
        <Text fs={12}>{t("value.usd", { amount: farms.data ?? BN_0 })}</Text>
      </div>
    </div>
  )

  return (
    <div
      sx={{ flex: ["column", "row"], mb: [28, 56], gap: [0, 16] }}
      css={{ flexWrap: "wrap" }}
    >
      <WalletAssetsHeaderValue
        isLoading={isLoading}
        value={totalBalance}
        label={t("wallet.assets.header.total")}
        tooltip={tooltipBalance}
      />

      <Separator
        sx={{ mb: 15, display: ["inherit", "none"] }}
        css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
      />

      <WalletAssetsHeaderValue
        isLoading={totalLocked.isLoading}
        value={totalLocked.data}
        label={t("wallet.assets.header.totalInPools")}
        tooltip={tooltipPools}
      />
    </div>
  )
}

export const WalletAssetsHeaderValue = (props: {
  isLoading?: boolean
  value?: BigNumber | null
  label: string
  tooltip?: ReactNode
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
      <div sx={{ flex: "row", align: "center", gap: 10, mb: [0, 14] }}>
        <Text color="neutralGray300" sx={{ fontSize: [14, 16] }}>
          {props.label}
        </Text>
        {props.tooltip && (
          <InfoTooltip side="bottom" text={props.tooltip}>
            <SInfoIcon />
          </InfoTooltip>
        )}
      </div>

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
