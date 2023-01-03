import { FC, ReactNode } from "react"
import { u32 } from "@polkadot/types"
import BigNumber from "bignumber.js"
import { useAssetsModal } from "sections/assets/AssetsModal.utils"
import { Maybe } from "utils/helpers"
import { AssetSelectInput } from "components/AssetSelect/AssetSelectInput"
import { useTranslation } from "react-i18next"

type Props = {
  name: string
  className?: string

  asset: u32 | string
  assetIcon: ReactNode
  assetName: string
  balance: BigNumber | undefined
  decimals: number

  allowedAssets?: Maybe<u32 | string>[]
  onSelectAsset?: (id: u32 | string) => void

  value: string
  onChange: (v: string) => void
}

export const PoolAddLiquidityAssetSelect: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { openModal, modal } = useAssetsModal({
    allowedAssets: props.allowedAssets,
    onSelect: props.onSelectAsset,
  })

  return (
    <>
      {modal}
      <AssetSelectInput
        {...props}
        title={t("selectAsset.title")}
        onSelectAssetClick={openModal}
      />
    </>
  )
}
