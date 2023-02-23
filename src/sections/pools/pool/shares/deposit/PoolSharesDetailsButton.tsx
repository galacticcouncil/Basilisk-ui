import { PoolBase } from "@galacticcouncil/sdk"
import { DepositNftType } from "api/deposits"
import { Button } from "components/Button/Button"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { PoolFarmPositionDetail } from "sections/pools/farm/modals/positionDetail/PoolFarmPositionDetail"

export const PoolSharesDetailsButton = ({
  pool,
  depositNft,
}: {
  pool: PoolBase
  depositNft: DepositNftType
}) => {
  const { t } = useTranslation()

  const [openFarm, setOpenFarm] = useState(false)

  return (
    <>
      <Button
        sx={{ px: 36, height: "fit-content" }}
        size="small"
        onClick={() => setOpenFarm(true)}
      >
        {t("pools.pool.positions.farms.details")}
      </Button>
      {openFarm && (
        <PoolFarmPositionDetail
          pool={pool}
          isOpen={openFarm}
          depositNft={depositNft}
          onClose={() => setOpenFarm(false)}
          onSelect={() => setOpenFarm(false)}
        />
      )}
    </>
  )
}
