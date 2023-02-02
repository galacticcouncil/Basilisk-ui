import { FC } from "react"
import { Text } from "components/Typography/Text/Text"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { Icon } from "components/Icon/Icon"
import { useAsset } from "api/asset"

// TODO: add icon handling
type Props = {
  id: string
  amount: string
}

export const PoolRemoveLiquidityReward: FC<Props> = ({ id, amount }) => {
  const asset = useAsset(id)

  return (
    <div sx={{ flex: "row", justify: "space-between", align: "center" }}>
      <div sx={{ flex: "row", align: "center", gap: 8 }}>
        <Icon size={34} icon={getAssetLogo(asset.data?.symbol)} />
        <div sx={{ flex: "column" }}>
          <Text fs={[14, 16]}>{asset.data?.symbol}</Text>
          <Text fs={[10, 12]} color="neutralGray500">
            {asset.data?.name}
          </Text>
        </div>
      </div>
      <Text fs={[16, 20]} lh={26} fw={[500, 700]}>
        {amount}
      </Text>
    </div>
  )
}
