import { useAsset } from "api/asset"
import { useActiveYieldFarm, useGlobalFarmList } from "api/farms"
import { BasiliskIcon } from "assets/icons/tokens/BasiliskIcon"
import { Box } from "components/Box/Box"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { PoolIncentivesRow } from "sections/pools/pool/incentives/row/PoolIncentivesRow"

const PoolIncentiveItem = (props: { assetId: string }) => {
  const asset = useAsset(props.assetId)

  return (
    <PoolIncentivesRow
      icon={<BasiliskIcon />}
      name={asset.data.name ?? ""}
      value="5-10"
    />
  )
}

export const PoolIncentives = (props: { id: string }) => {
  const globalFarms = useGlobalFarmList()
  const yieldFarms = useActiveYieldFarm(props.id)

  const { t } = useTranslation()
  return (
    <Box width={206}>
      <Text fs={14} lh={26} color="neutralGray400" mb={18}>
        {t("pools.pool.incentives.title")}
      </Text>
      {yieldFarms.data?.map((i, index) => {
        const globalFarm = globalFarms.data?.find(
          (farm) => farm.id.toHuman() === i.globalFarmId,
        )

        if (!globalFarm) return null
        return (
          <Fragment key={index}>
            <PoolIncentiveItem
              assetId={globalFarm.rewardCurrency.toHuman()}
              {...i}
            />
            {index !== yieldFarms.data.length - 1 && <Separator mb={13} />}
          </Fragment>
        )
      })}
    </Box>
  )
}
