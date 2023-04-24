import { u32 } from "@polkadot/types-codec"
import { useAsset } from "api/asset"
import { ReactComponent as PlaceholderIcon } from "assets/icons/PlaceholderIcon.svg"

export const FarmAssetIcon = ({ assetId }: { assetId: u32 }) => {
  const { data: asset } = useAsset(assetId)

  return asset?.icon ?? <PlaceholderIcon />
}
