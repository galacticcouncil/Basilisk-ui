import { flexRender } from "@tanstack/react-table"
import {
  Table,
  TableBodyContent,
  TableContainer,
  TableData,
  TableHeaderContent,
  TableRow,
  TableTitle,
} from "components/Table/Table.styled"
import { Text } from "components/Typography/Text/Text"
import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import { TableSortHeader } from "components/Table/Table"
import { assetsTableStyles } from "sections/wallet/assets/table/WalletAssetsTable.styled"
import { WalletTransferModal } from "sections/wallet/transfer/WalletTransferModal"
import {
  LiquidityPositionsTableData,
  useLiquidityPositionsTable,
} from "./WalletLiquidityPositionsTable.utils"
import { WalletLiquidityPositionsTableDetails } from "./details/WalletLiquidityPositionsTableDetails"
import { WalletLiquidityPositionsTableActionsMob } from "sections/wallet/assets/table/actions/WalletLiquidityPositionsTableActionsMob"
import { useMedia } from "react-use"
import { theme } from "theme"

type Props = { data: LiquidityPositionsTableData[] }

export const WalletLiquidityPositionsTable = ({ data }: Props) => {
  const { t } = useTranslation()
  const [row, setRow] = useState<LiquidityPositionsTableData | undefined>()
  const [poolAddress, setPoolAddress] = useState<string | null>(null)

  const isDesktop = useMedia(theme.viewport.gte.sm)
  const table = useLiquidityPositionsTable(data, {
    onTransfer: setPoolAddress,
  })

  return (
    <TableContainer css={assetsTableStyles}>
      <TableTitle>
        <Text fs={[16, 20]} lh={[20, 26]} fw={500} color="white">
          {t("wallet.assets.liquidityPositions.table.title")}
        </Text>
      </TableTitle>
      <Table>
        <TableHeaderContent>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableSortHeader
                  key={header.id}
                  canSort={header.column.getCanSort()}
                  sortDirection={header.column.getIsSorted()}
                  onSort={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableSortHeader>
              ))}
            </TableRow>
          ))}
        </TableHeaderContent>
        <TableBodyContent>
          {table.getRowModel().rows.map((row, i) => (
            <Fragment key={row.id}>
              <TableRow
                isOdd={!(i % 2)}
                onClick={() => !isDesktop && setRow(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableData key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableData>
                ))}
              </TableRow>
              {row.getIsExpanded() && (
                <TableRow isSub>
                  <TableData colSpan={table.getAllColumns().length}>
                    <WalletLiquidityPositionsTableDetails
                      assetA={row.original.assetA}
                      assetB={row.original.assetB}
                    />
                  </TableData>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBodyContent>
      </Table>
      {poolAddress && (
        <WalletTransferModal
          open
          value={{ type: "liquidityPositions", poolAddress }}
          onClose={() => setPoolAddress(null)}
        />
      )}
      <WalletLiquidityPositionsTableActionsMob
        row={row}
        onClose={() => setRow(undefined)}
        onTransferClick={setPoolAddress}
      />
    </TableContainer>
  )
}
