import { Modal } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import { MyPositionsHeader } from "./MyPositionsHeader"
import { MyPositionsList } from "./MyPositionsList"
import { PoolBase } from "@galacticcouncil/sdk"
import { GradientText } from "components/Typography/GradientText/GradientText"

type MyPositionsModalProps = {
  pool: PoolBase
  isOpen: boolean
  onClose: () => void
  arePositions: boolean
}

export const MyPositionsModal = ({
  pool,
  isOpen,
  onClose,
  arePositions,
}: MyPositionsModalProps) => {
  const { t } = useTranslation()
  const [{ symbol: assetA }, { symbol: assetB }] = pool.tokens
  return (
    <Modal
      open={isOpen}
      title={
        <GradientText fs={20} fw={600} sx={{ mb: 10 }}>
          {t("pools.allFarms.modal.myPositions", {
            symbol: `${assetA}/${assetB}`,
          })}
        </GradientText>
      }
      onClose={onClose}
    >
      {isOpen && (
        <>
          <MyPositionsHeader pool={pool} arePositions={arePositions} />
          <MyPositionsList pool={pool} />
        </>
      )}
    </Modal>
  )
}
