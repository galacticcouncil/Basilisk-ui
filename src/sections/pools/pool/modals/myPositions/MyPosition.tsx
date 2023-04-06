import { PoolBase } from "@galacticcouncil/sdk"
import { useAssetMetaList } from "api/assetMeta"
import { DepositNftType } from "api/deposits"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { Icon } from "components/Icon/Icon"
import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { Separator } from "components/Separator/Separator"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Text } from "components/Typography/Text/Text"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { PoolFarmPositionDetail } from "sections/pools/farm/modals/positionDetail/PoolFarmPositionDetail"
import { useAPR } from "utils/farms/apr"
import { useDepositValues } from "utils/farms/deposits"
import { PoolPositionFarmRedeposit } from "../../position/farm/PoolPositionFarmRedeposit"
import { SMobContainer } from "./MyPositions.styled"

type MyPositionProps = {
  depositNft: DepositNftType
  index: number
  pool: PoolBase
}

export const MyPosition = ({ pool, depositNft, index }: MyPositionProps) => {
  const { t } = useTranslation()
  const [openFarm, setOpenFarm] = useState(false)

  const { amountUSD, assetA, assetB } = useDepositValues(depositNft)

  const apr = useAPR(pool.address)
  const activeAprs =
    apr.data?.filter((i) =>
      depositNft.deposit.yieldFarmEntries.some(
        (entry) =>
          entry.globalFarmId.eq(i.globalFarm.id) &&
          entry.yieldFarmId.eq(i.yieldFarm.id),
      ),
    ) ?? []

  const { data: assetList } = useAssetMetaList(activeAprs.map((i) => i.assetId))

  return (
    <>
      <SMobContainer onClick={() => setOpenFarm(true)}>
        <div sx={{ flex: "column", gap: 10, flexGrow: 1 }}>
          <div sx={{ flex: "row", justify: "space-between", align: "center" }}>
            <GradientText
              fs={16}
              lh={22}
              fw={500}
              sx={{ width: "fit-content" }}
            >
              {t("pools.pool.positions.position.title", { index })}
            </GradientText>
            {assetList && (
              <MultipleIcons
                icons={assetList.map((asset) => {
                  return {
                    icon: getAssetLogo(asset.symbol),
                  }
                })}
              />
            )}
          </div>
          <div sx={{ flex: "row", justify: "space-between" }}>
            <Text fs={12} lh={16} color="neutralGray500">
              {t("pools.pool.positions.position.lockedShares")}
            </Text>
            <Text fs={14} lh={18} color="white">
              {t("pools.pool.positions.position.lockedSharesValue", {
                shares: depositNft.deposit.shares,
                symbol: `${assetA?.symbol}/${assetB?.symbol}`,
              })}
            </Text>
          </div>
          <Separator />
          <div sx={{ flex: "row", justify: "space-between", align: "center" }}>
            <Text fs={12} lh={16} color="neutralGray500">
              {t("pools.pool.positions.position.current")}
            </Text>
            <div sx={{ flex: "column", gap: 2, align: "end" }}>
              <Text fs={14} lh={18} color="white">
                {t("pools.pool.positions.position.amounts", {
                  amountA: assetA?.amount,
                  symbolA: assetA?.symbol,
                  amountB: assetB?.amount,
                  symbolB: assetB?.symbol,
                })}
              </Text>
              <Text fs={14} lh={18} color="neutralGray500">
                {t("value.usd", { amount: amountUSD })}
              </Text>
            </div>
          </div>
          <PoolPositionFarmRedeposit pool={pool} depositNft={depositNft} />
        </div>
        <Icon
          icon={<ChevronRight />}
          sx={{
            color: "primary300",
          }}
        />
      </SMobContainer>
      <PoolFarmPositionDetail
        pool={pool}
        isOpen={openFarm}
        depositNft={depositNft}
        onClose={() => setOpenFarm(false)}
        onSelect={() => setOpenFarm(false)}
      />
    </>
  )
}
