import { WalletAssetsTable } from "sections/wallet/assets/table/WalletAssetsTable"
import { useAssetsTableData } from "sections/wallet/assets/table/data/WalletAssetsTableData.utils"
import { useAccountStore } from "state/store"
import { WalletAssetsTablePlaceholder } from "sections/wallet/assets/table/placeholder/WalletAssetsTablePlaceholder"
import { WalletAssetsTableSkeleton } from "sections/wallet/assets/table/skeleton/WalletAssetsTableSkeleton"
import { WalletAssetsHeader } from "./WalletAssetsHeader"
import { WalletLiquidityPositionsSkeleton } from "./table/skeleton/WalletLiquidityPositionsSkeleton"
import { WalletLiquidityPositionsTable } from "./table/WalletLiquidityPositionsTable"

export const WalletAssets = () => {
  const { account } = useAccountStore()
  const { data, isLoading } = useAssetsTableData()

  return (
    <div sx={{ mt: [34, 56] }}>
      {!account ? (
        <WalletAssetsTablePlaceholder />
      ) : isLoading ? (
        <>
          <WalletAssetsHeader isLoading={isLoading} />
          <div sx={{
            display: "flex",
            flexDirection: "column",
            gap: 20
          }}>
          <WalletAssetsTableSkeleton />
          <WalletLiquidityPositionsSkeleton />
          </div>
        </>
      ) : (
        data && (
          <>
            <WalletAssetsHeader data={data} />
            <div sx={{
              display: "flex",
              flexDirection: "column",
              gap: 20
            }}>
            <WalletAssetsTable data={data} />
              <WalletLiquidityPositionsTable data={data} />
            </div>
          </>
        )
      )}
    </div>
  )
}
