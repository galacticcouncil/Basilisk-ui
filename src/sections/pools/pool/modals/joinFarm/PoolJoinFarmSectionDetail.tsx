import { ModalMeta } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import { AprFarm } from "utils/apr"
import { PoolToken } from "@galacticcouncil/sdk"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { PoolJoinFarmDeposit } from "./PoolJoinFarmDeposit"
import { PoolJoinFarmItem } from "./PoolJoinFarmItem"
import { Row } from "components/Row/Row"
import { Separator } from "components/Separator/Separator"
import { PalletLiquidityMiningYieldFarmEntry } from "@polkadot/types/lookup"
import { useMemo } from "react"
import { subSeconds } from "date-fns"
import { BLOCK_TIME, BN_1 } from "utils/constants"
import { useBestNumber } from "api/chain"
import { useMath } from "utils/math"
import BN from "bignumber.js"
import { useAsset } from "api/asset"

function PoolJoinFarmYieldFarmEntryDetail(props: {
  poolId: string
  assetIn: PoolToken
  assetOut: PoolToken
  yieldFarmEntry: PalletLiquidityMiningYieldFarmEntry
  farm: AprFarm
}) {
  const { t } = useTranslation()
  const math = useMath()
  const bestNumber = useBestNumber()

  const rewardAsset = useAsset(props.farm.globalFarm.rewardCurrency)
  // const blockNumber = useMemo(() => {
  //   const blocksPerPeriod = props.farm.globalFarm.blocksPerPeriod.toBigNumber()
  //   const enteredAt = props.yieldFarmEntry.enteredAt.toBigNumber()
  //   return enteredAt.multipliedBy(blocksPerPeriod)
  // }, [props.farm, props.yieldFarmEntry])

  // TODO: ask, whether the date make sense or not
  const enteredDate = useMemo(() => {
    const enteredAt = props.yieldFarmEntry.enteredAt.toBigNumber()
    const blocksPerPeriod = props.farm.globalFarm.blocksPerPeriod.toBigNumber()
    const blockRange = enteredAt
      .times(blocksPerPeriod)
      .plus(blocksPerPeriod.plus(1))

    const date = subSeconds(Date.now(), blockRange.times(BLOCK_TIME).toNumber())
    return date
  }, [props.yieldFarmEntry, props.farm])

  const mined = useMemo(() => {
    if (bestNumber.data == null || math.liquidityMining == null) return null

    const currentPeriod = bestNumber.data.relaychainBlockNumber
      .toBigNumber()
      .dividedToIntegerBy(props.farm.globalFarm.blocksPerPeriod.toBigNumber())

    const periods = currentPeriod.minus(
      props.yieldFarmEntry.enteredAt.toBigNumber(),
    )

    let loyaltyMultiplier = BN_1.toString()

    if (!props.farm.yieldFarm.loyaltyCurve.isNone) {
      const { initialRewardPercentage, scaleCoef } =
        props.farm.yieldFarm.loyaltyCurve.unwrap()

      loyaltyMultiplier = math.liquidityMining.calculate_loyalty_multiplier(
        periods.toFixed(),
        initialRewardPercentage.toBigNumber().toFixed(),
        scaleCoef.toBigNumber().toFixed(),
      )
    }

    return new BN(
      math.liquidityMining.calculate_user_reward(
        props.yieldFarmEntry.accumulatedRpvs.toBigNumber().toFixed(),
        props.yieldFarmEntry.valuedShares.toBigNumber().toFixed(),
        props.yieldFarmEntry.accumulatedClaimedRewards.toBigNumber().toFixed(),
        props.farm.yieldFarm.accumulatedRpvs.toBigNumber().toFixed(),
        loyaltyMultiplier,
      ),
    )
  }, [
    bestNumber.data,
    math.liquidityMining,
    props.farm.globalFarm.blocksPerPeriod,
    props.farm.yieldFarm.accumulatedRpvs,
    props.farm.yieldFarm.loyaltyCurve,
    props.yieldFarmEntry.accumulatedClaimedRewards,
    props.yieldFarmEntry.accumulatedRpvs,
    props.yieldFarmEntry.enteredAt,
    props.yieldFarmEntry.valuedShares,
  ])

  return (
    <>
      <Row
        left={t("pools.allFarms.modal.position.joinedDate.label")}
        right={t("pools.allFarms.modal.position.joinedDate.value", {
          date: enteredDate,
        })}
      />
      <Separator />
      {/* TODO */}
      <Row left={t("pools.allFarms.modal.position.value.label")} right="-" />
      <Separator />
      <Row
        left={t("pools.allFarms.modal.position.mined.label")}
        right={t("pools.allFarms.modal.position.mined.value", {
          value: mined,
          fixedPointScale: rewardAsset.data?.decimals,
          numberSuffix: rewardAsset.data?.name && ` ${rewardAsset.data?.name}`,
        })}
      />
    </>
  )
}

export function PoolJoinFarmSectionDetail(props: {
  poolId: string
  assetIn: PoolToken
  assetOut: PoolToken
  yieldFarmEntry?: PalletLiquidityMiningYieldFarmEntry
  onBack: () => void
  farm: AprFarm
}) {
  const { t } = useTranslation()

  return (
    <>
      <ModalMeta
        title={t("pools.allFarms.detail.modal.title")}
        secondaryIcon={{
          icon: <ChevronRight css={{ transform: "rotate(180deg)" }} />,
          name: "Back",
          onClick: props.onBack,
        }}
      />

      <PoolJoinFarmItem farm={props.farm} />

      {props.yieldFarmEntry ? (
        <PoolJoinFarmYieldFarmEntryDetail
          poolId={props.poolId}
          assetIn={props.assetIn}
          assetOut={props.assetOut}
          farm={props.farm}
          yieldFarmEntry={props.yieldFarmEntry}
        />
      ) : (
        <PoolJoinFarmDeposit
          poolId={props.poolId}
          assetIn={props.assetIn}
          assetOut={props.assetOut}
          farm={props.farm}
        />
      )}
    </>
  )
}
