import { Page } from "components/Layout/Page/Page"
import { Spacer } from "components/Spacer/Spacer"
import { Spinner } from "components/Spinner/Spinner.styled"
import { useState } from "react"
import {
  PoolsPageFilter,
  useFilteredPools,
} from "sections/pools/PoolsPage.utils"
import { PoolsHeader } from "sections/pools/header/PoolsHeader"
import { Pool } from "sections/pools/pool/Pool"
import { EmptyPoolsState } from "./pool/empty/EmptyPoolsState"

export const PoolsPage = () => {
  const [filter, setFilter] = useState<PoolsPageFilter>({
    showMyPositions: false,
  })

  const { data, hasPositions, isLoading } = useFilteredPools(filter)

  return (
    <Page>
      <PoolsHeader
        myPositions={filter.showMyPositions}
        onMyPositionsChange={(value) =>
          setFilter((prev) => ({
            ...prev,
            showMyPositions: value,
          }))
        }
        disableMyPositions={!hasPositions}
      />

      <Spacer size={40} />

      <div sx={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {isLoading ? (
          <div sx={{ width: "100%", flex: "row", justify: "center" }}>
            <Spinner width={32} height={32} />
          </div>
        ) : !!data?.length ? (
          data?.map((pool) => <Pool key={pool.address} pool={pool} />)
        ) : (
          <EmptyPoolsState />
        )}
      </div>
    </Page>
  )
}
