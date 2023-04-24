import { PoolBase } from "@galacticcouncil/sdk"
import { ReactComponent as MoreIcon } from "assets/icons/MoreIcon.svg"
import { Icon } from "components/Icon/Icon"
import { Modal } from "components/Modal/Modal"
import { ReactNode, useState } from "react"
import { useTranslation } from "react-i18next"
import { MyPositionsModal } from "../../modals/myPositions/MyPositionsModal"
import { SMobActionButton } from "./PoolActionsMobile.styled"

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  pool: PoolBase
  actionButtons: ReactNode
  disabledMyPositions: boolean
  arePositions: boolean
}

export const PoolActionsMobile = ({
  isOpen,
  onOpen,
  onClose,
  pool,
  actionButtons,
  disabledMyPositions,
  arePositions,
}: Props) => {
  const { t } = useTranslation()
  const [openMyPositions, setOpenMyPositions] = useState(false)

  return (
    <>
      <div sx={{ flex: "row", gap: 12 }}>
        <SMobActionButton size="small" onClick={onOpen}>
          <div sx={{ flex: "row", align: "center", justify: "center" }}>
            <Icon icon={<MoreIcon />} sx={{ mr: 8 }} />
            {t("pools.pool.actions.actions")}
          </div>
        </SMobActionButton>
        <SMobActionButton
          size="small"
          onClick={() => setOpenMyPositions(true)}
          disabled={disabledMyPositions}
        >
          <div sx={{ flex: "row", align: "center", justify: "center" }}>
            {t("pools.pool.actions.myPositions")}
          </div>
        </SMobActionButton>
      </div>

      <Modal
        open={isOpen}
        isDrawer
        titleDrawer={t("pools.pool.actions.header", {
          tokens: `${pool.tokens[0].symbol}/${pool.tokens[1].symbol}`,
        })}
        onClose={onClose}
      >
        {actionButtons}
      </Modal>
      <MyPositionsModal
        pool={pool}
        isOpen={openMyPositions}
        onClose={() => setOpenMyPositions(false)}
        arePositions={arePositions}
      />
    </>
  )
}
