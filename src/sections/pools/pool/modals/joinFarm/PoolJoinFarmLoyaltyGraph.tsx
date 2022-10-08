import { useTranslation } from "react-i18next"
import { AprFarm } from "utils/apr"
import { useLoyaltyRates, useMockLoyaltyCurve } from "utils/loyalty"
import { Graph } from "components/Graph/Graph"
import { Spinner } from "components/Spinner/Spinner.styled"

export function PoolJoinFarmLoyaltyGraph(props: { farm: AprFarm }) {
  const { t } = useTranslation()

  const mockLoyaltyCurve = useMockLoyaltyCurve()
  const loyaltyCurve =
    props.farm.yieldFarm.loyaltyCurve.unwrapOr(mockLoyaltyCurve)

  const rates = useLoyaltyRates(props.farm, loyaltyCurve)
  if (loyaltyCurve == null) return null
  return (
    <div sx={{ height: 300, flex: "row", align: "center", justify: "center" }}>
      {rates.data ? (
        <Graph
          labelX={t("pools.allFarms.modal.position.loyalty.x")}
          labelY={t("pools.allFarms.modal.position.loyalty.y")}
          data={rates.data}
        />
      ) : (
        <Spinner width={64} height={64} />
      )}
    </div>
  )
}
