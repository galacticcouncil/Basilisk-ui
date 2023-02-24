import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { ReactComponent as MinusIcon } from "assets/icons/MinusIcon.svg"
import { ReactComponent as PlusIcon } from "assets/icons/PlusIcon.svg"
import { ReactComponent as WindMillIcon } from "assets/icons/WindMillIcon.svg"
import { ReactComponent as MoreIcon } from "assets/icons/MoreIcon.svg"
import { Button } from "components/Button/Button"
import { Icon } from "components/Icon/Icon"
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { PoolAddLiquidity } from "sections/pools/pool/modals/addLiquidity/PoolAddLiquidity"
import { PoolRemoveLiquidity } from "sections/pools/pool/modals/removeLiquidity/PoolRemoveLiquidity"
import { PoolFarmJoin } from "sections/pools/farm/modals/join/PoolFarmJoin"
import { PoolBase } from "@galacticcouncil/sdk"
import {
  SActionsContainer,
  SButtonOpen,
  SMobActionButton,
} from "sections/pools/pool/actions/PoolActions.styled"
import { useAccountStore } from "state/store"
import { useMedia } from "react-use"
import { theme } from "theme"
import { Modal } from "components/Modal/Modal"
import { useAccountDepositIds, useDeposits } from "api/deposits"
import { MyPositionsModal } from "../modals/myPositions/MyPositionsModal"
import { useCurrentSharesValue } from "../shares/value/PoolSharesValue.utils"
import { usePoolShareToken } from "api/pools"
import { useTokenBalance } from "api/balances"
import { usePoolFarms } from "utils/farms/apr"

type Props = {
  pool: PoolBase
  isExpanded: boolean
  onExpandClick: () => void
  className?: string
}

export const PoolActions: FC<Props> = ({
  pool,
  isExpanded,
  onExpandClick,
  className,
}) => {
  const { t } = useTranslation()
  const [openAdd, setOpenAdd] = useState(false)
  const [openRemove, setOpenRemove] = useState(false)
  const [openFarms, setOpenFarms] = useState(false)
  const [openActions, setOpenActions] = useState(false)
  const [openMyPositions, setOpenMyPositions] = useState(false)
  const { account } = useAccountStore()
  const isDesktop = useMedia(theme.viewport.gte.sm)
  const farms = usePoolFarms(pool.address)

  const deposits = useDeposits(pool.address)
  const accountDepositIds = useAccountDepositIds(account?.address)
  const positions = deposits.data?.filter((deposit) =>
    accountDepositIds.data?.some((ad) => ad.instanceId.eq(deposit.id)),
  )

  const shareToken = usePoolShareToken(pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

  const { dollarValue } = useCurrentSharesValue({
    shareToken: shareToken.data?.token,
    shareTokenBalance: balance.data?.balance,
    pool,
  })

  const closeActionsDrawer = () => setOpenActions(false)

  const disabledRemoveLP = balance.data?.balance.isZero()

  const disabledJoinFarm = !farms.data?.length || balance.data?.balance.isZero()

  const disabledMyPositions =
    !account || (!positions?.length && (!dollarValue || dollarValue.isZero()))

  const actionButtons = (
    <div sx={{ width: ["auto", 214], flex: "column", gap: 10, mt: [19, 0] }}>
      <Button
        fullWidth
        size="small"
        disabled={!account}
        onClick={() => {
          setOpenAdd(true)
          closeActionsDrawer()
        }}
      >
        <div sx={{ flex: "row", align: "center", justify: "center" }}>
          <Icon icon={<PlusIcon />} sx={{ mr: 8 }} />
          {t("pools.pool.actions.addLiquidity")}
        </div>
      </Button>

      <Button
        fullWidth
        size="small"
        disabled={!account || disabledRemoveLP}
        onClick={() => {
          setOpenRemove(true)
          closeActionsDrawer()
        }}
      >
        <div sx={{ flex: "row", align: "center", justify: "center" }}>
          <Icon icon={<MinusIcon />} sx={{ mr: 8 }} />
          {t("pools.pool.actions.removeLiquidity")}
        </div>
      </Button>

      <Button
        fullWidth
        size="small"
        disabled={!account || disabledJoinFarm}
        onClick={() => {
          setOpenFarms(true)
          closeActionsDrawer()
        }}
      >
        <div sx={{ flex: "row", align: "center", justify: "center" }}>
          <Icon icon={<WindMillIcon />} sx={{ mr: 8 }} />
          {t("pools.pool.actions.joinFarm")}
        </div>
      </Button>
    </div>
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
        <>
          <Modal
            open={openActions}
            isDrawer
            titleDrawer={t("pools.pool.actions.header", {
              tokens: `${pool.tokens[0].symbol}/${pool.tokens[1].symbol}`,
            })}
            onClose={closeActionsDrawer}
          >
            {actionButtons}
          </Modal>
          <MyPositionsModal
            pool={pool}
            isOpen={openMyPositions}
            onClose={() => setOpenMyPositions(false)}
            arePositions={!!positions?.length}
          />
          <div sx={{ flex: "row", gap: 12 }}>
            <SMobActionButton size="small" onClick={() => setOpenActions(true)}>
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
        </>
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
