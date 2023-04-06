import { ReactComponent as BuyIcon } from "assets/icons/BuyIcon.svg"
import { ReactComponent as SellIcon } from "assets/icons/SellIcon.svg"
import { ReactComponent as TransferIcon } from "assets/icons/TransferIcon.svg"
import { ButtonTransparent } from "components/Button/Button"
import { theme } from "theme"
import { ReactComponent as ChevronDownIcon } from "assets/icons/ChevronDown.svg"
import { ReactComponent as ChevronRightIcon } from "assets/icons/ChevronRight.svg"
import { useTranslation } from "react-i18next"
import { TableAction } from "components/Table/Table"
import { Dropdown } from "components/Dropdown/Dropdown"
import { ReactComponent as DollarIcon } from "assets/icons/DollarIcon.svg"
import { ReactComponent as PlusIcon } from "assets/icons/PlusIcon.svg"
import { ReactComponent as MoreDotsIcon } from "assets/icons/MoreDotsIcon.svg"
import { isNotNil } from "utils/helpers"
import { useAccountStore } from "state/store"

type Props = {
  toggleExpanded: () => void
  symbol: string
  onBuyClick: (() => void) | undefined
  onSellClick: (() => void) | undefined
  onTransferClick: () => void
  couldAddLiquidity: boolean
  onAddLiquidityClick: () => void
  onSetFeeAsPaymentClick: () => void
  couldBeSetAsPaymentFee: boolean
  isBalanceZero: boolean
}

export const WalletAssetsTableActions = (props: Props) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  return (
    <>
      <div sx={{ display: ["block", "none"] }}>
        <ButtonTransparent css={{ color: theme.colors.iconGray }}>
          <ChevronRightIcon />
        </ButtonTransparent>
      </div>
      <div
        sx={{
          flex: "row",
          gap: 10,
          display: ["none", "flex"],
          align: "center",
        }}
      >
        <TableAction
          icon={<BuyIcon />}
          onClick={props.onBuyClick}
          disabled={
            props.onBuyClick == null || account?.isExternalWalletConnected
          }
        >
          {t("wallet.assets.table.actions.buy")}
        </TableAction>
        <TableAction
          icon={<SellIcon />}
          onClick={props.onSellClick}
          disabled={
            props.onSellClick == null || account?.isExternalWalletConnected
          }
        >
          {t("wallet.assets.table.actions.sell")}
        </TableAction>
        <TableAction
          icon={<TransferIcon />}
          disabled={props.isBalanceZero || account?.isExternalWalletConnected}
          onClick={props.onTransferClick}
        >
          {t("wallet.assets.table.actions.transfer")}
        </TableAction>

        {!account?.isExternalWalletConnected && (
          <Dropdown
            items={[
              props.couldAddLiquidity
                ? {
                    key: "addLiquidity" as const,
                    icon: <PlusIcon />,
                    label: t("wallet.assets.table.actions.add.liquidity"),
                  }
                : null,
              props.couldBeSetAsPaymentFee
                ? {
                    key: "setAsFeePayment" as const,
                    icon: <DollarIcon />,
                    label: t("wallet.assets.table.actions.payment.asset"),
                  }
                : null,
            ].filter(isNotNil)}
            onSelect={(item) => {
              switch (item) {
                case "addLiquidity": {
                  props.onAddLiquidityClick()
                  break
                }
                case "setAsFeePayment": {
                  props.onSetFeeAsPaymentClick()
                  break
                }
              }
            }}
          >
            <MoreDotsIcon />
          </Dropdown>
        )}

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
