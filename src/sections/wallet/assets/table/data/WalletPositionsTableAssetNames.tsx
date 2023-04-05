import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { Text } from "components/Typography/Text/Text"

type Props = {
  assetA: { name: string; symbol: string }
  assetB: { name: string; symbol: string }
  large?: boolean
}

export const WalletPositionsTableAssetNames = ({
  assetA,
  assetB,
  large,
}: Props) => {
  return (
    <div sx={{ flex: "row", align: "center", gap: [8, 16] }}>
      <MultipleIcons
        icons={[
          { icon: getAssetLogo(assetA.symbol) },
          { icon: getAssetLogo(assetB.symbol) },
        ]}
        size={large ? 32 : [24, 32]}
      />
      <div>
        <Text
          fw={600}
          fs={large ? 18 : [12, 18]}
          lh={large ? 24 : [16, 24]}
          color="white"
        >
          {assetA.symbol}/{assetB.symbol}
        </Text>
        <Text
          fw={500}
          fs={large ? 14 : [11, 14]}
          lh={large ? 18 : [14, 18]}
          color="neutralGray400"
        >
          {assetA.name}/{assetB.name}
        </Text>
      </div>
    </div>
  )
}
