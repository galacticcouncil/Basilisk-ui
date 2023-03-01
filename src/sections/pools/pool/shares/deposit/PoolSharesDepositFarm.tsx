import { FC, ReactElement } from "react"
import { SContainer } from "sections/pools/pool/shares/deposit/PoolSharesDepositFarm.styled"
import { getCurrentLoyaltyFactor, useAPR } from "utils/farms/apr"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { PoolBase } from "@galacticcouncil/sdk"
import { DepositNftType } from "api/deposits"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { Icon } from "components/Icon/Icon"
import { Separator } from "components/Separator/Separator"
import { useAssetMeta } from "api/assetMeta"
import { PalletLiquidityMiningYieldFarmEntry } from "@polkadot/types/lookup"

type Props = {
  pool: PoolBase
  depositNft: DepositNftType
}

type DepositedYieldFarmProps = {
  apr: NonNullable<ReturnType<typeof useAPR>["data"]>[0]
  depositYieldFarm?: PalletLiquidityMiningYieldFarmEntry
}

export const DepositedYieldFarm = ({
  depositYieldFarm,
  apr: { apr, assetId, loyaltyCurve, currentPeriod },
}: DepositedYieldFarmProps) => {
  const { t } = useTranslation()
  const { data: assetMeta } = useAssetMeta(assetId.toString())

  if (!assetMeta || !depositYieldFarm) return null

  const currentPeriodInFarm = currentPeriod.minus(
    depositYieldFarm.enteredAt.toBigNumber(),
  )

  const currentApr = apr.times(
    getCurrentLoyaltyFactor(loyaltyCurve, currentPeriodInFarm),
  )

  return (
    <div sx={{ flex: "row", align: "center", gap: 6 }}>
      <Icon size={20} icon={getAssetLogo(assetMeta.symbol)} />
      <Text fs={14}>{assetMeta.symbol}</Text>
      <Text fs={12} color="primary200">
        {t("value.APR", {
          apr: currentApr,
        })}
      </Text>
    </div>
  )
}

export const PoolSharesDepositFarm: FC<Props> = ({ pool, depositNft }) => {
  const { t } = useTranslation()

  const apr = useAPR(pool.address)
  const activeAprs =
    apr.data?.filter((i) =>
      depositNft.deposit.yieldFarmEntries.some(
        (entry) =>
          entry.globalFarmId.eq(i.globalFarm.id) &&
          entry.yieldFarmId.eq(i.yieldFarm.id),
      ),
    ) ?? []

  const assetAprs = activeAprs.reduce((acc, apr, i) => {
    const isLastElement = i + 1 === activeAprs.length
    const depositYieldFarm = depositNft.deposit.yieldFarmEntries.find(
      (farm) => farm.yieldFarmId.toString() === apr.yieldFarm.id.toString(),
    )

    acc.push(
      <DepositedYieldFarm
        key={apr.yieldFarm.id.toString()}
        apr={apr}
        depositYieldFarm={depositYieldFarm}
      />,
    )

    if (!isLastElement)
      acc.push(<Separator key={i} sx={{ height: 35 }} orientation="vertical" />)

    return acc
  }, [] as ReactElement[])

  return (
    <SContainer>
      <div sx={{ flex: "column", gap: 14 }}>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("pools.pool.positions.farms.joinedFarms")}
        </Text>
        <div sx={{ flex: "row", gap: 35 }}>{assetAprs}</div>
      </div>
    </SContainer>
  )
}
