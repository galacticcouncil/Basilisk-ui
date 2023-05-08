import { useAssetsTableData } from "sections/wallet/assets/table/data/WalletAssetsTableData.utils"
import { WalletAssetsTablePlaceholder } from "sections/wallet/assets/table/placeholder/WalletAssetsTablePlaceholder"
import { WalletAssetsTableSkeleton } from "sections/wallet/assets/table/skeleton/WalletAssetsTableSkeleton"
import { WalletAssetsTable } from "sections/wallet/assets/table/WalletAssetsTable"
import { useAccountStore } from "state/store"
import { WalletFarmingPositionsWrapper } from "./farmingPositions/WalletFarmingPositions"
import { useLiquidityPositionsTableData } from "./table/data/WalletLiquidityPositionsData.utils"
import { WalletLiquidityPositionsSkeleton } from "./table/skeleton/WalletLiquidityPositionsSkeleton"
import { WalletLiquidityPositionsTable } from "./table/WalletLiquidityPositionsTable"
import {
  WalletAssetsHeader,
  WalletAssetsHeaderValue,
} from "./WalletAssetsHeader"
import { useApiPromise } from "utils/api"
import { isApiLoaded } from "utils/helpers"
import { WalletFarmingPositionsSkeleton } from "./table/skeleton/WalletFarmingPositionsSkeleton"
import { Separator } from "components/Separator/Separator"
import { theme } from "theme"
import { useTranslation } from "react-i18next"

export const WalletAssets = () => {
  const api = useApiPromise()
  const { t } = useTranslation()

  if (!isApiLoaded(api))
    return (
      <div sx={{ mt: [34, 56] }}>
        <div
          sx={{ flex: ["column", "row"], mb: [28, 56], gap: [0, 16] }}
          css={{ flexWrap: "wrap" }}
        >
          <WalletAssetsHeaderValue
            isLoading
            label={t("wallet.assets.header.total")}
          />

          <Separator
            sx={{ mb: 15, display: ["inherit", "none"] }}
            css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
          />

          <WalletAssetsHeaderValue
            isLoading
            label={t("wallet.assets.header.transferable")}
          />

          <Separator
            sx={{ mb: 15, display: ["inherit", "none"] }}
            css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
          />

          <WalletAssetsHeaderValue
            isLoading
            label={t("wallet.assets.header.totalInPools")}
          />
        </div>
        <div sx={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <WalletAssetsTableSkeleton />
          <WalletLiquidityPositionsSkeleton />
          <WalletFarmingPositionsSkeleton />
        </div>
      </div>
    )

  return <WalletAssetsData />
}

export const WalletAssetsData = () => {
  const { account } = useAccountStore()
  const assetTableQuery = useAssetsTableData()
  const liquidityPositionsQuery = useLiquidityPositionsTableData()

  const queries = [assetTableQuery, liquidityPositionsQuery]
  const isLoading = queries.some((query) => query.isLoading)
  const hasData = queries.every((query) => query.data)

  return (
    <div sx={{ mt: [34, 56] }}>
      {!account ? (
        <WalletAssetsTablePlaceholder />
      ) : isLoading ? (
        <>
          <WalletAssetsHeader isLoading={isLoading} />
          <div sx={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <WalletAssetsTableSkeleton />
            <WalletLiquidityPositionsSkeleton />
          </div>
        </>
      ) : (
        hasData && (
          <>
            <WalletAssetsHeader assetsData={assetTableQuery.data} />

            <div sx={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <WalletAssetsTable data={assetTableQuery.data} />
              <WalletLiquidityPositionsTable
                data={liquidityPositionsQuery.data}
              />
              <WalletFarmingPositionsWrapper />
            </div>
          </>
        )
      )}
    </div>
  )
}
