import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { Text } from "components/Typography/Text/Text"
import { LiquidityPositionsTableData } from "../WalletLiquidityPositionsTable.utils"

export const WalletLiquidityPositionsTableName = (props: {
  assetA: LiquidityPositionsTableData["assetA"]
  assetB: LiquidityPositionsTableData["assetB"]
  large?: boolean
}) => {
  return (
    <div sx={{ flex: "row", align: "center", gap: 8 }}>
      <MultipleIcons
        icons={[
          {
            icon: getAssetLogo(props.assetA.symbol),
          },
          {
            icon: getAssetLogo(props.assetB.symbol),
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
          {props.assetA.symbol}/{props.assetB.symbol}
        </Text>
        <Text
          fw={500}
          fs={props.large ? 14 : 11}
          lh={props.large ? 18 : 14}
          color="neutralGray400"
        >
          {props.assetA.name}/{props.assetB.name}
        </Text>
      </div>
    </div>
  )
}
