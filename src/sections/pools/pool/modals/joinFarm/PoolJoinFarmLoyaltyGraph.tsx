import { useTranslation } from "react-i18next"
import { AprFarm } from "utils/apr"
import { useLoyaltyRates } from "utils/loyalty"
import { Box } from "components/Box/Box"
import { Graph } from "components/Graph/Graph"
import { Spinner } from "components/Spinner/Spinner.styled"
import { css } from "styled-components"

export function PoolJoinFarmLoyaltyGraph(props: { farm: AprFarm }) {
  const { t } = useTranslation()
  const loyaltyCurve = props.farm.yieldFarm.loyaltyCurve.unwrapOr(null)

  const rates = useLoyaltyRates(props.farm, loyaltyCurve)

  if (loyaltyCurve == null) return null
  return (
    <Box
      flex
      height={300}
      css={css`
        align-items: center;
        justify-content: center;
      `}
    >
      {rates.data ? (
        <Graph
          labelX={t("pools.allFarms.modal.position.loyalty.x")}
          labelY={t("pools.allFarms.modal.position.loyalty.y")}
          data={rates.data}
        />
      ) : (
        <Spinner width={64} height={64} />
      )}
    </Box>
  )
}
