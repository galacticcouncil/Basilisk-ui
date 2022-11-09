import { ReactComponent as TransferIcon } from "assets/icons/TransferIcon.svg"
import { ReactComponent as DocumentIcon } from "assets/icons/DocumentIcon.svg"
import { ButtonTransparent } from "components/Button/Button"
import { theme } from "theme"
import { ReactComponent as ChevronDownIcon } from "assets/icons/ChevronDown.svg"
import { ReactComponent as ChevronRightIcon } from "assets/icons/ChevronRight.svg"
import { useTranslation } from "react-i18next"
import { TableAction } from "components/Table/Table"

type Props = {
  toggleExpanded: () => void
  symbol: string
  onTransferClick: () => void
}

export const WalletLiquidityPositionsTableActions = (props: Props) => {
  const { t } = useTranslation()

  return (
    <>
      <div sx={{ display: ["block", "none"] }}>
        <ButtonTransparent
          onClick={() => console.log("detail", props.symbol)}
          css={{ color: theme.colors.iconGray }}
        >
          <ChevronRightIcon />
        </ButtonTransparent>
      </div>
      <div sx={{ flex: "row", gap: 10, display: ["none", "flex"] }}>
        <TableAction icon={<TransferIcon />} onClick={props.onTransferClick}>
          {t("wallet.assets.liquidityPositions.table.actions.transfer")}
        </TableAction>
        <TableAction
          icon={<DocumentIcon />}
          onClick={() => console.log("buy", props.symbol)}
        >
          {t("wallet.assets.liquidityPositions.table.actions.details")}
        </TableAction>

        <ButtonTransparent
          onClick={props.toggleExpanded}
          css={{ color: theme.colors.iconGray }}
        >
          <ChevronDownIcon />
        </ButtonTransparent>
      </div>
    </>
  )
}
