import { Link } from "@tanstack/react-location"
import { ReactComponent as DocumentIcon } from "assets/icons/DocumentIcon.svg"
import { ReactComponent as TransferIcon } from "assets/icons/TransferIcon.svg"
import { Modal } from "components/Modal/Modal"
import { Separator } from "components/Separator/Separator"
import { TableAction } from "components/Table/Table"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { WalletPositionsTableAssetNames } from "sections/wallet/assets/table/data/WalletPositionsTableAssetNames"
import { WalletLiquidityPositionsTableDetailsBalance } from "sections/wallet/assets/table/details/WalletLiquidityPositionsTableDetailsBalance"
import { LiquidityPositionsTableData } from "sections/wallet/assets/table/WalletLiquidityPositionsTable.utils"
import { useAccountStore } from "state/store"
import { theme } from "theme"
import { LINKS } from "utils/navigation"

type Props = {
  row?: LiquidityPositionsTableData
  onClose: () => void
  onTransferClick: (id: string) => void
}

export const WalletLiquidityPositionsTableActionsMob = ({
  row,
  onClose,
  onTransferClick,
}: Props) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  if (!row) return null

  return (
    <Modal open={!!row} isDrawer onClose={onClose}>
      <>
        <div sx={{ pb: 30, mx: 16 }}>
          <WalletPositionsTableAssetNames
            assetA={row.assetA}
            assetB={row.assetB}
            large
          />
        </div>
        <Separator
          css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
        />
        <div
          sx={{ py: 30, mx: 16 }}
          css={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gridColumnGap: 8,
          }}
        >
          <div sx={{ flex: "column" }}>
            <Text fs={12} lh={14} color="neutralGray300" sx={{ mb: 6 }}>
              {t("wallet.assets.table.header.total")}
            </Text>
            <Text fs={14} lh={18} color="white" sx={{ mb: 2 }}>
              {t("value", { value: row.total })}
            </Text>
            <Text fs={12} lh={14} color="neutralGray500">
              {t("value.usd", { amount: row.totalUsd })}
            </Text>
          </div>
          <Separator
            orientation="vertical"
            css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
          />
          <div sx={{ flex: "column" }} css={{ justifySelf: "flex-end" }}>
            <Text fs={12} lh={14} color="neutralGray300" sx={{ mb: 6 }}>
              {t("wallet.assets.table.header.transferable")}
            </Text>
            <Text fs={14} lh={18} color="white" sx={{ mb: 2 }}>
              {t("value", { value: row.transferable })}
            </Text>
            <Text fs={12} lh={12} color="neutralGray500">
              {t("value.usd", { amount: row.transferableUsd })}
            </Text>
          </div>
        </div>
        <div sx={{ bg: "backgroundGray1000", m: "-15px" }}>
          <div
            sx={{ py: 30, mx: 31 }}
            css={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              gridColumnGap: 8,
            }}
          >
            <WalletLiquidityPositionsTableDetailsBalance
              symbol={row.assetA.symbol}
              balance={row.assetA.balance}
              balanceUsd={row.assetA.balanceUsd}
            />
            <Separator
              orientation="vertical"
              css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
            />
            <WalletLiquidityPositionsTableDetailsBalance
              symbol={row.assetB.symbol}
              balance={row.assetB.balance}
              balanceUsd={row.assetB.balanceUsd}
              css={{ justifySelf: "flex-end" }}
            />
          </div>
          <div sx={{ flex: "column", gap: 12, p: 15 }}>
            <TableAction
              onClick={() => onTransferClick(row.poolAddress)}
              icon={<TransferIcon />}
              css={{ width: "100%" }}
              large
              disabled={account?.isExternalWalletConnected}
            >
              {t("wallet.assets.liquidityPositions.table.actions.transfer")}
            </TableAction>
            <Link to={LINKS.pools_and_farms} hash={row.poolAddress}>
              <TableAction
                icon={<DocumentIcon />}
                css={{ width: "100%" }}
                large
              >
                {t("wallet.assets.liquidityPositions.table.actions.details")}
              </TableAction>
            </Link>
          </div>
        </div>
      </>
    </Modal>
  )
}
