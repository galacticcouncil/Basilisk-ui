import { PoolBase } from "@galacticcouncil/sdk"
import { useAssetDetailsList } from "api/assetDetails"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PoolDetailsTradeFee } from "./tradeFee/PoolDetailsTradeFee"

type Props = { pool: PoolBase; className?: string }

export const PoolDetails = ({ pool, className }: Props) => {
  const { t } = useTranslation()
  const assets = useAssetDetailsList()

  const [assetA, assetB] = useMemo(() => {
    if (!assets.data) return []
    return pool.tokens.map((poolToken) => {
      const poolAsset = assets.data.find((asset) => asset.id === poolToken.id)
      return { ...poolToken, name: poolAsset?.name }
    })
  }, [pool.tokens, assets.data])

  return (
    <div sx={{ flex: "column" }} className={className}>
      <div sx={{ flex: "row", justify: "space-between", align: "start" }}>
        <div>
          <Text fs={14} lh={26} fw={400} color="neutralGray400">
            {t("pools.pool.title", { poolType: pool.type })}
          </Text>
          <div sx={{ flex: "row", align: "center", gap: 4 }}>
            <MultipleIcons
              icons={[
                { icon: getAssetLogo(assetA.symbol) },
                { icon: getAssetLogo(assetB.symbol) },
              ]}
            />
            <div sx={{ flex: "column" }}>
              <Text fw={700} color="white">
                {assetA.symbol}/{assetB.symbol}
              </Text>
              <Text fs={12} lh={16} color="neutralGray500">
                {assetA.name}/{assetB.name}
              </Text>
            </div>
          </div>
        </div>
        <PoolDetailsTradeFee pool={pool} />
      </div>
      <Separator sx={{ mt: [18, 18, 34] }} />
    </div>
  )
}
