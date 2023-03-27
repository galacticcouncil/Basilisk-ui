import { flexRender } from "@tanstack/react-table"
import { TableSortHeader } from "components/Table/Table"
import {
  Table,
  TableBodyContent,
  TableHeaderContent,
  TableRow,
  TableTitle,
} from "components/Table/Table.styled"
import { Text } from "components/Typography/Text/Text"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"
import { WalletFarmingPositionsSkeleton } from "../table/skeleton/WalletFarmingPositionsSkeleton"
import { STableContainer, STableData } from "./WalletFarmingPositions.styled"
import {
  FarmingPositionsTableData,
  useFarmingPositionsData,
  useFarmingPositionsTable,
} from "./WalletFarmingPositions.utils"

export const WalletFarmingPositionsWrapper = () => {
  const { data, isLoading } = useFarmingPositionsData()

  if (isLoading) return <WalletFarmingPositionsSkeleton />

  return <WalletFarmingPositions data={data} />
}

type Props = { data: FarmingPositionsTableData[] }

export const WalletFarmingPositions = ({ data }: Props) => {
  const { t } = useTranslation()
  const table = useFarmingPositionsTable(data)

  return (
    <STableContainer>
      <TableTitle>
        <Text fs={[16, 20]} lh={[20, 26]} fw={500} color="white">
          {t("wallet.assets.farmingPositions.title")}
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
              <TableRow isOdd={!(i % 2)}>
                {row.getVisibleCells().map((cell) => (
                  <STableData key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </STableData>
                ))}
              </TableRow>
            </Fragment>
          ))}
        </TableBodyContent>
      </Table>
    </STableContainer>
  )
}
