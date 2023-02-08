import { Modal } from "components/Modal/Modal"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { usePools } from "api/pools"
import { PoolAddLiquidityModal } from "./PoolAddLiquidityModal"
import { useAssetMeta } from "api/assetMeta"

type Props = {
  isOpen: boolean
  onClose: () => void
  poolAddress: string
  selectedAsset?: string
}

export const PoolAddLiquidity: FC<Props> = ({
  isOpen,
  onClose,
  selectedAsset,
  ...props
}) => {
  const [poolAddress, setPoolAddress] = useState(props.poolAddress)
  const { t } = useTranslation()

  const pools = usePools()
  const asset = useAssetMeta(selectedAsset)

  const pool = pools.data?.find((pool) => pool.address === poolAddress)

  const assetA = selectedAsset ? asset.data : pool?.tokens[0]
  const assetB = pool?.tokens[1]

  return (
    <Modal
      open={isOpen}
      title={t("pools.addLiquidity.modal.title")}
      onClose={() => {
        setPoolAddress(props.poolAddress)
        onClose()
      }}
    >
      {assetA && (
        <PoolAddLiquidityModal
          tradeFee={pool?.tradeFee}
          poolAddress={poolAddress}
          assetA={assetA}
          assetB={assetB}
          setPoolAddress={setPoolAddress}
        />
      )}
    </Modal>
  )
}
