import { ReactComponent as MinusIcon } from "assets/icons/MinusIcon.svg"
import { ReactComponent as PlusIcon } from "assets/icons/PlusIcon.svg"
import { ReactComponent as WindMillIcon } from "assets/icons/WindMillIcon.svg"
import { Button } from "components/Button/Button"
import { Icon } from "components/Icon/Icon"
import { useTranslation } from "react-i18next"
import { useAccountStore } from "state/store"

type Props = {
  disabledRemove?: boolean
  disabledJoin?: boolean
  onAdd: () => void
  onRemove: () => void
  onJoin: () => void
}

export const PoolActionsButtons = ({
  disabledRemove,
  disabledJoin,
  onAdd,
  onRemove,
  onJoin,
}: Props) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  const actionsDisabled = !account || account.isExternalWalletConnected
  const removeDisabled = disabledRemove || actionsDisabled

  return (
    <div sx={{ width: ["auto", 214], flex: "column", gap: 10, mt: [19, 0] }}>
      <Button fullWidth size="small" disabled={actionsDisabled} onClick={onAdd}>
        <div sx={{ flex: "row", align: "center", justify: "center" }}>
          <Icon icon={<PlusIcon />} sx={{ mr: 8 }} />
          {t("pools.pool.actions.addLiquidity")}
        </div>
      </Button>

      <Button
        fullWidth
        size="small"
        disabled={removeDisabled}
        onClick={onRemove}
      >
        <div sx={{ flex: "row", align: "center", justify: "center" }}>
          <Icon icon={<MinusIcon />} sx={{ mr: 8 }} />
          {t("pools.pool.actions.removeLiquidity")}
        </div>
      </Button>

      <Button fullWidth size="small" disabled={disabledJoin} onClick={onJoin}>
        <div sx={{ flex: "row", align: "center", justify: "center" }}>
          <Icon icon={<WindMillIcon />} sx={{ mr: 8 }} />
          {t(
            !actionsDisabled
              ? "pools.pool.actions.joinFarm"
              : "pools.pool.actions.farmDetails",
          )}
        </div>
      </Button>
    </div>
  )
}
