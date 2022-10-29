import BN from "bignumber.js"
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { ButtonTransparent } from "components/Button/Button"
import { ReactComponent as BuyIcon } from "assets/icons/BuyIcon.svg"
import { ReactComponent as SellIcon } from "assets/icons/SellIcon.svg"
import { ReactComponent as TransferIcon } from "assets/icons/TransferIcon.svg"
import { ReactComponent as ChevronIcon } from "assets/icons/ChevronDown.svg"
import { TableAction } from "components/Table/TableAction"
import { theme } from "theme"
import { useState } from "react"

export const useAssetsTable = () => {
  const { t } = useTranslation()
  const { accessor, display } = createColumnHelper<TData>()

  const [sorting, setSorting] = useState<SortingState>([])

  const columns = [
    accessor("symbol", {
      header: t("wallet.assets.table.header.name"),
      cell: ({ row }) => (
        <div sx={{ flex: "row", gap: 6, align: "center" }}>
          <div>{getAssetLogo(row.original.symbol)}</div>
          <div sx={{ flex: "column" }}>
            <Text fs={14} lh={18} fw={500} color="white">
              {row.original.symbol}
            </Text>
            <Text fs={12} lh={16} fw={500} color="neutralGray500">
              {row.original.name}
            </Text>
          </div>
        </div>
      ),
    }),
    accessor("transferable", {
      header: t("wallet.assets.table.header.transferable"),
      sortingFn: (a, b) =>
        a.original.transferable.gt(b.original.transferable) ? 1 : -1,
      cell: ({ row }) => (
        <div sx={{ flex: "column", gap: 2 }}>
          <Text fs={14} lh={18} fw={500} color="white">
            {t("value", { value: row.original.transferable })}
          </Text>
          <Text fs={12} lh={16} fw={500} color="neutralGray500">
            {t("value.usd", { amount: row.original.transferableUSD })}
          </Text>
        </div>
      ),
    }),
    accessor("total", {
      header: t("wallet.assets.table.header.total"),
      sortingFn: (a, b) => (a.original.total.gt(b.original.total) ? 1 : -1),
      cell: ({ row }) => (
        <div sx={{ flex: "column" }}>
          <Text fs={14} lh={18} fw={500} color="white">
            {t("value", { value: row.original.total })}
          </Text>
          <Text fs={12} lh={16} fw={500} color="neutralGray500">
            {t("value.usd", { amount: row.original.totalUSD })}
          </Text>
        </div>
      ),
    }),
    display({
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div sx={{ flex: "row", gap: 10 }}>
          <TableAction
            icon={<BuyIcon />}
            onClick={() => console.log("buy", row.original.symbol)}
          >
            Buy
          </TableAction>
          <TableAction
            icon={<SellIcon />}
            onClick={() => console.log("sell", row.original.symbol)}
          >
            Sell
          </TableAction>
          <TableAction
            icon={<TransferIcon />}
            onClick={() => console.log("transfer", row.original.symbol)}
          >
            Transfer
          </TableAction>
          <ButtonTransparent
            onClick={() => row.toggleExpanded()}
            css={{ color: theme.colors.iconGray }}
          >
            <ChevronIcon />
          </ButtonTransparent>
        </div>
      ),
    }),
  ]

  return useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
}

const data: TData[] = [
  {
    id: 1,
    symbol: "BSX",
    name: "Basilisk",
    transferable: new BN(545673.14323),
    transferableUSD: new BN(3000),
    total: new BN(1000000),
    totalUSD: new BN(6000),
    locked: new BN(10000),
    lockedUSD: new BN(150),
    origin: "Basilisk",
  },
  {
    id: 2,
    symbol: "KAR",
    name: "Karura",
    transferable: new BN(35975.1739),
    transferableUSD: new BN(3000),
    total: new BN(1000000),
    totalUSD: new BN(6000),
    locked: new BN(10000),
    lockedUSD: new BN(150),
    origin: "Kusama",
  },
  {
    id: 3,
    symbol: "PHA",
    name: "Phala",
    transferable: new BN(145430.23334),
    transferableUSD: new BN(3000),
    total: new BN(1000000),
    totalUSD: new BN(6000),
    locked: new BN(10000),
    lockedUSD: new BN(150),
    origin: "Kusama",
  },
  {
    id: 4,
    symbol: "KSM",
    name: "Kusama",
    transferable: new BN(10023.2445),
    transferableUSD: new BN(3000),
    total: new BN(1000000),
    totalUSD: new BN(6000),
    locked: new BN(10000),
    lockedUSD: new BN(150),
    origin: "Kusama",
  },
]

type TData = {
  id: number
  symbol: string
  name: string
  transferable: BN
  transferableUSD: BN
  total: BN
  totalUSD: BN
  locked: BN
  lockedUSD: BN
  origin: string
}
