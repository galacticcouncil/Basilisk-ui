import { PoolBase } from "@galacticcouncil/sdk"
import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { useMemo, useState } from "react"
import { useMedia } from "react-use"
import { PoolFarmJoin } from "sections/pools/farm/modals/join/PoolFarmJoin"
import {
  SActionsContainer,
  SButtonOpen,
} from "sections/pools/pool/actions/PoolActions.styled"
import { PoolAddLiquidity } from "sections/pools/pool/modals/addLiquidity/PoolAddLiquidity"
import { PoolRemoveLiquidity } from "sections/pools/pool/modals/removeLiquidity/PoolRemoveLiquidity"
import { theme } from "theme"
import { usePoolActionsConditions } from "./PoolActions.utils"
import { PoolActionsButtons } from "./buttons/PoolActionsButtons"
import { PoolActionsMobile } from "./mobile/PoolActionsMobile"

type Props = {
  pool: PoolBase
  isExpanded: boolean
  onExpandClick: () => void
  className?: string
}

export const PoolActions = ({
  pool,
  isExpanded,
  onExpandClick,
  className,
}: Props) => {
  const [openAdd, setOpenAdd] = useState(false)
  const [openRemove, setOpenRemove] = useState(false)
  const [openFarms, setOpenFarms] = useState(false)
  const [openActions, setOpenActions] = useState(false)

  const isDesktop = useMedia(theme.viewport.gte.sm)
  const { disabledRemove, disabledJoin, disabledMyPositions, arePositions } =
    usePoolActionsConditions(pool)

  const actionButtons = useMemo(
    () => (
      <PoolActionsButtons
        disabledRemove={disabledRemove}
        disabledJoin={disabledJoin}
        onAdd={() => {
          setOpenAdd(true)
          setOpenActions(false)
        }}
        onRemove={() => {
          setOpenRemove(true)
          setOpenActions(false)
        }}
        onJoin={() => {
          setOpenFarms(true)
          setOpenActions(false)
        }}
      />
    ),
    [disabledRemove, disabledJoin],
  )

  return (
    <>
      {isDesktop ? (
        <SActionsContainer className={className}>
          {actionButtons}
          <SButtonOpen
            isActive={isExpanded}
            onClick={onExpandClick}
            disabled={disabledMyPositions}
          >
            <ChevronDown />
          </SButtonOpen>
        </SActionsContainer>
      ) : (
        <PoolActionsMobile
          isOpen={openActions}
          onOpen={() => setOpenActions(true)}
          onClose={() => setOpenActions(false)}
          pool={pool}
          actionButtons={actionButtons}
          disabledMyPositions={disabledMyPositions}
          arePositions={arePositions}
        />
      )}

      <PoolAddLiquidity
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        poolAddress={pool.address}
      />
      <PoolRemoveLiquidity
        isOpen={openRemove}
        onClose={() => setOpenRemove(false)}
        pool={pool}
      />
      <PoolFarmJoin
        pool={pool}
        isOpen={openFarms}
        onClose={() => setOpenFarms(false)}
        onSelect={() => setOpenFarms(false)}
      />
    </>
  )
}
