import { AssetIcon, AssetIconProps } from "components/AssetIcon/AssetIcon"
import { FC } from "react"
import { IconsWrapper } from "./MultipleIcons.styled"
import { ResponsiveValue } from "utils/responsive"

type DualAssetIconsProps = {
  size?: ResponsiveValue<number>
  icons: Array<AssetIconProps>
}

export const MultipleIcons: FC<DualAssetIconsProps> = ({
  icons,
  size = 28,
}) => (
  <IconsWrapper size={size}>
    {icons.map((icon, index) => (
      <AssetIcon {...icon} key={index} />
    ))}
  </IconsWrapper>
)
