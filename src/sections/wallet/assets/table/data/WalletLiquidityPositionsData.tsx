import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { getAssetLogo, getAssetName } from "components/AssetIcon/AssetIcon"
import { Text } from "components/Typography/Text/Text"

export const WalletLiquidityPositionsTableName = (props: {
  symbolA: string
  symbolB: string
  large?: boolean
}) => {
  return (
    <div sx={{ flex: "row", align: "center", gap: 8 }}>
      <MultipleIcons
        icons={[
          {
            icon: getAssetLogo(props.symbolA),
          },
          {
            icon: getAssetLogo(props.symbolB),
          },
        ]}
        size={props.large ? 34 : [24, 32]}
      />
      <div sx={{ display: ["block", "none"] }}>
        <Text
          fw={600}
          fs={props.large ? 18 : 12}
          lh={props.large ? 24 : 16}
          color="white"
        >
          {props.symbolA}/{props.symbolB}
        </Text>
        <Text
          fw={500}
          fs={props.large ? 14 : 11}
          lh={props.large ? 18 : 14}
          color="neutralGray400"
        >
          {getAssetName(props.symbolA)}/{getAssetName(props.symbolB)}
        </Text>
      </div>
    </div>
  )
}
