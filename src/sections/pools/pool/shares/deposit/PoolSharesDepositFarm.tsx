import { FC, useState } from "react"
import {
  SAssetContainer,
  SAssetIcon,
  SContainer,
} from "sections/pools/pool/shares/deposit/PoolSharesDepositFarm.styled"
import { useAPR } from "utils/farms/apr"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { Button } from "components/Button/Button"
import { PoolBase } from "@galacticcouncil/sdk"
import { PoolFarmPositionDetail } from "sections/pools/farm/modals/positionDetail/PoolFarmPositionDetail"
import { DepositNftType } from "api/deposits"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { useAssetMetaList } from "api/assetMeta"
import BN from "bignumber.js"

type Props = {
  pool: PoolBase
  depositNft: DepositNftType
}

export const PoolSharesDepositFarm: FC<Props> = ({ pool, depositNft }) => {
  const { t } = useTranslation()
  const [openFarm, setOpenFarm] = useState(false)

  const aprs = useAPR(pool.address)

  const [fromApr, toApr] = aprs.data
    .filter((i) =>
      depositNft.deposit.yieldFarmEntries.some(
        (entry) =>
          entry.globalFarmId.eq(i.globalFarm.id) &&
          entry.yieldFarmId.eq(i.yieldFarm.id),
      ),
    )
    .reduce<[BN | null, BN | null]>(
      ([oldMin, oldMax], item) => {
        const min = !oldMin || oldMin.gt(item.apr) ? item.apr : oldMin
        const max = !oldMax || oldMax.lt(item.apr) ? item.apr : oldMax
        return [min, max]
      },
      [null, null],
    )

  const assetList = useAssetMetaList(aprs.data.map((i) => i.assetId))

  return (
    <SContainer>
      <>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("pools.pool.positions.farms.joinedFarms")}
        </Text>
        <div sx={{ flex: "row", align: "center", gap: 6 }}>
          <SAssetContainer>
            {assetList.data?.map((asset) => (
              <SAssetIcon key={asset.symbol}>
                {getAssetLogo(asset.symbol)}
              </SAssetIcon>
            ))}
          </SAssetContainer>
          {fromApr != null && toApr != null && (
            <Text fs={14} lh={16} color="primary200">
              {fromApr.eq(toApr)
                ? t("value.APR", { apr: fromApr })
                : t("value.APR.range", { from: fromApr, to: toApr })}
            </Text>
          )}
        </div>
        <Button size="small" onClick={() => setOpenFarm(true)}>
          {t("pools.pool.positions.farms.details")}
        </Button>
      </>
      {openFarm && (
        <PoolFarmPositionDetail
          pool={pool}
          isOpen={openFarm}
          depositNft={depositNft}
          onClose={() => setOpenFarm(false)}
          onSelect={() => setOpenFarm(false)}
        />
      )}
    </SContainer>
  )
}
