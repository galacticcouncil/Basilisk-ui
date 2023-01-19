import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { PoolBase } from "@galacticcouncil/sdk"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Button } from "components/Button/Button"
import { AprFarm, useAPR } from "utils/farms/apr"
import { DepositNftType } from "api/deposits"
import { useRedepositMutation } from "utils/farms/redeposit"
import { useAsset } from "api/asset"
import { theme } from "theme"
import { Fragment } from "react"
import { SContainer, SInnerContainer } from "./PoolPositionFarmRedeposit.styled"

const PoolPositionFarmRedepositAsset = (props: {
  pool: PoolBase
  farm: AprFarm
  hideName?: boolean
}) => {
  const { t } = useTranslation()
  const asset = useAsset(props.farm.assetId)
  if (!asset.data) return null

  return (
    <div sx={{ flex: "row", align: "center", gap: 6 }}>
      {asset.data.icon}
      {!props.hideName && (
        <Text fs={14} lh={16}>
          {asset.data.name}
        </Text>
      )}
      <Text fs={14} lh={16} color="primary200">
        {t("value.APR", { apr: props.farm.apr })}
      </Text>
    </div>
  )
}

export const PoolPositionFarmRedeposit = (props: {
  pool: PoolBase
  depositNft: DepositNftType
  className?: string
}) => {
  const { t } = useTranslation()
  const apr = useAPR(props.pool.address)

  let availableYieldFarms =
    apr.data?.filter(
      (i) =>
        !props.depositNft.deposit.yieldFarmEntries.some(
          (entry) =>
            entry.globalFarmId.eq(i.globalFarm.id) &&
            entry.yieldFarmId.eq(i.yieldFarm.id),
        ),
    ) ?? []

  const redeposit = useRedepositMutation(props.pool, availableYieldFarms, [
    props.depositNft,
  ])

  const isMultiple = availableYieldFarms.length > 1

  if (!availableYieldFarms.length) return null
  return (
    <SContainer isMultiple={isMultiple}>
      <SInnerContainer isMultiple={isMultiple}>
        <div
          sx={{
            flex: ["column", "row"],
            align: ["start", "center"],
            gap: [10, 0],
          }}
        >
          <GradientText fs={12} fw={400}>
            {t("pools.pool.positions.farms.redeposit.title")}
          </GradientText>

          <div
            sx={{ flex: "row", gap: 20, align: "center", ml: [0, 12], mr: 20 }}
          >
            {availableYieldFarms.map((farm, i) => (
              <Fragment key={`${farm.globalFarm.id}-${farm.yieldFarm.id}`}>
                <PoolPositionFarmRedepositAsset
                  hideName={!isMultiple}
                  farm={farm}
                  pool={props.pool}
                />

                {i + 1 !== availableYieldFarms.length && (
                  <span
                    sx={{ width: 1, height: 35 }}
                    css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <Button
          size="small"
          variant="primary"
          disabled={redeposit.isLoading}
          sx={{ width: 120 }}
          onClick={() => redeposit.mutate()}
        >
          {t("pools.pool.positions.farms.redeposit.join")}
        </Button>
      </SInnerContainer>
    </SContainer>
  )
}
