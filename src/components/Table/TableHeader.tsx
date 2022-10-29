import { STableHeader } from "components/Table/Table.styled"
import { SortDirection } from "@tanstack/react-table"
import { ReactNode } from "react"
import { css } from "@emotion/react"
import { theme } from "theme"
import { ReactComponent as CaretIcon } from "assets/icons/CaretIcon.svg"

type Props = {
  canSort: boolean
  sortDirection?: false | SortDirection
  onSort?: (event: unknown) => void
  children: ReactNode
}

export const TableHeader = ({
  canSort,
  sortDirection,
  onSort,
  children,
}: Props) => {
  const isSorting =
    canSort && sortDirection !== undefined && onSort !== undefined
  const asc = sortDirection === "asc" ? 1 : sortDirection === false ? 1 : 0
  const desc = sortDirection === "desc" ? 1 : sortDirection === false ? 1 : 0

  return (
    <STableHeader canSort={canSort} onClick={onSort}>
      <div sx={{ flex: "row", align: "center" }}>
        {children}
        {isSorting && (
          <div sx={{ flex: "column", gap: 2, ml: 6 }}>
            <CaretIcon css={{ rotate: "180deg", opacity: asc }} />
            <CaretIcon css={{ opacity: desc }} />
          </div>
        )}
      </div>
    </STableHeader>
  )
}
