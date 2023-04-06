import { PoolBase } from "@galacticcouncil/sdk"
import { PalletLiquidityMiningYieldFarmEntry } from "@polkadot/types/lookup"
import { DepositNftType } from "api/deposits"
import { Row } from "components/Row/Row"
import { Separator } from "components/Separator/Separator"
import { useTranslation } from "react-i18next"
import { useEnteredDate } from "utils/block"
import { AprFarm } from "utils/farms/apr"
import { useDepositValues } from "utils/farms/deposits"
import { usePositionMinedValue } from "utils/farms/positions"

export function PoolFarmPosition(props: {
  pool: PoolBase
  farm: AprFarm
  depositNft: DepositNftType
  position: PalletLiquidityMiningYieldFarmEntry
}) {
  const { t } = useTranslation()

  const { mined, rewardAsset } = usePositionMinedValue({
    position: props.position,
    pool: props.pool,
  })
  const { assetA, assetB } = useDepositValues(props.depositNft)
  const enteredDate = useEnteredDate(props.position.enteredAt.toBigNumber())

  return (
    <div sx={{ flex: "column", gap: 8 }}>
      <Row
        left={t("pools.allFarms.modal.position.joinedDate.label")}
        right={t("pools.allFarms.modal.position.joinedDate.value", {
          date: enteredDate.data,
        })}
      />
      <Separator />
      <Row
        left={t("pools.allFarms.modal.position.value.label")}
        right={t("pools.allFarms.modal.position.value.value", {
          amountA: assetA?.amount,
          symbolA: assetA?.symbol,
          amountB: assetB?.amount,
          symbolB: assetB?.symbol,
        })}
      />
      <Separator />
      <Row
        left={t("pools.allFarms.modal.position.mined.label")}
        right={t("pools.allFarms.modal.position.mined.value", {
          value: mined,
          fixedPointScale: rewardAsset?.decimals,
          numberSuffix: ` ${rewardAsset?.symbol}`,
        })}
      />
    </div>
  )
}
