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
  balance: BigNumber | undefined
  decimals: number

  allowedAssets?: Maybe<u32 | string>[]
  hiddenAssets?: Maybe<u32 | string>[]
  onSelectAsset?: (id: u32 | string) => void

  error?: string
  disabled?: boolean
  value: string
  onChange: (v: string) => void
}

export const PoolAddLiquidityAssetSelect: FC<Props> = (props) => {
  const { t } = useTranslation()
  const { openModal, modal } = useAssetsModal({
    allowedAssets: props.allowedAssets,
    onSelect: props.onSelectAsset,
    hiddenAssets: props.hiddenAssets,
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
