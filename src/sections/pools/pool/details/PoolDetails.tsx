import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { PoolBase } from "@galacticcouncil/sdk"
import { PoolDetailsTradeFee } from "./PoolDetailsTradeFee"
import { useAssetDetailsList } from "../../../../api/assetDetails"
import { useMemo } from "react"

export const PoolDetails = (props: {
  pool: PoolBase
  onClick?: () => void
  className?: string
}) => {
  const { t } = useTranslation()
  const assets = useAssetDetailsList()

  const [assetA, assetB] = useMemo(() => {
    if (!assets.data) return []
    return props.pool.tokens.map((poolToken) => {
      const poolAsset = assets.data.find((asset) => asset.id === poolToken.id)
      return { ...poolToken, name: poolAsset?.name }
    })
  }, [props.pool.tokens, assets.data])

  return (
    <div sx={{ flex: "column" }} className={props.className}>
      <div sx={{ flex: "row", justify: "space-between" }}>
        <div>
          <Text fs={14} lh={26} fw={400} color="neutralGray400">
            {t("pools.pool.title", { poolType: props.pool.type })}
          </Text>
          <div sx={{ flex: "row", align: "center", gap: 4 }}>
            <MultipleIcons
              icons={[
                { icon: getAssetLogo(assetA.symbol) },
                { icon: getAssetLogo(assetB.symbol) },
              ]}
            />
            <div sx={{ flex: "column", gap: 1 }}>
              <Text fw={700} color="white">
                {assetA.symbol}/{assetB.symbol}
              </Text>
              <Text fs={12} lh={14} color="neutralGray500">
                {assetA.name}/{assetB.name}
              </Text>
            </div>
          </div>
        </div>
        <PoolDetailsTradeFee pool={props.pool} />
      </div>
      <Separator sx={{ mt: [18, 18, 34] }} />
    </div>
  )
}
