import { useTranslation } from "react-i18next"
import { usePoolPositionData } from "./PoolPosition.utils"
import { Text } from "components/Typography/Text/Text"
import { SMobContiner } from "./PoolPosition.styled"
import { PalletLiquidityMiningYieldFarmEntry } from "@polkadot/types/lookup"
import { PoolBase } from "@galacticcouncil/sdk"
import { normalizeBigNumber } from "utils/balance"
import { formatNum } from "utils/formatting"
import { Separator } from "components/Separator/Separator"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { AssetIcon } from "components/AssetIcon/AssetIcon"

type Props = {
  position: PalletLiquidityMiningYieldFarmEntry
  index: number
  pool: PoolBase
}

export const MobPoolPosition = ({ position, index, pool }: Props) => {
  const { t } = useTranslation()

  const { positionValue, assetA, assetB, rewardAsset } = usePoolPositionData({
    position,
    pool,
  })

  const lockedSharesValue = formatNum(
    normalizeBigNumber(position.valuedShares.toBigNumber()).toFixed(),
    {
      notation: "compact",
    },
  )
  return (
    <SMobContiner sx={{ flex: "column", gap: 10 }}>
      <div sx={{ flex: "row", justify: "space-between", align: "center" }}>
        <GradientText fs={16} lh={22} fw={500} sx={{ width: "fit-content" }}>
          {t("pools.pool.positions.position.title", { index })}
        </GradientText>
        <AssetIcon icon={rewardAsset?.icon} />
      </div>
      <div sx={{ flex: "row", justify: "space-between" }}>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("pools.pool.positions.position.lockedShares")}
        </Text>
        <Text fs={14} lh={18} color="white">
          {lockedSharesValue}
        </Text>
      </div>
      <Separator />
      <div sx={{ flex: "row", justify: "space-between", align: "center" }}>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("pools.pool.positions.position.current")}
        </Text>
        <div sx={{ flex: "column", gap: 2, align: "end" }}>
          <Text fs={12} lh={16} color="white">
            {t("pools.pool.positions.position.amounts", {
              amountA: assetA?.amount,
              symbolA: assetA?.symbol,
              amountB: assetB?.amount,
              symbolB: assetB?.symbol,
            })}
          </Text>
          <Text fs={14} lh={18} color="neutralGray500">
            {t("value.usd", { amount: positionValue })}
          </Text>
        </div>
      </div>
    </SMobContiner>
  )
}
