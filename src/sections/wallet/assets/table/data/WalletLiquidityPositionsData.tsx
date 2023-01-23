import { DualAssetIcons } from "components/DualAssetIcons/DualAssetIcons"
import { getAssetLogo, getAssetName } from "components/AssetIcon/AssetIcon"
import { Text } from "components/Typography/Text/Text"

export const WalletLiquidityPositionsTableName = (props: {
  symbolA: string
  symbolB: string
}) => {
  return (
    <div sx={{ flex: "row", align: "center", gap: 8 }}>
      <DualAssetIcons
        firstIcon={{
          icon: getAssetLogo(props.symbolA),
        }}
        secondIcon={{
          icon: getAssetLogo(props.symbolB),
        }}
      />
      <div sx={{ display: ["block", "none"] }}>
        <Text fw={600} fs={12} lh={16} color="white">
          {props.symbolA}/{props.symbolB}
        </Text>
        <Text fw={500} fs={11} lh={14} color="neutralGray400">
          {getAssetName(props.symbolA)}/{getAssetName(props.symbolB)}
        </Text>
      </div>
    </div>
  )
}
