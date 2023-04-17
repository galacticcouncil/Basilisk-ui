import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { PoolBase } from "@galacticcouncil/sdk"
import { getTradeFee } from "sections/pools/pool/Pool.utils"

export function PoolDetailsTradeFee(props: { pool: PoolBase }) {
  const { t } = useTranslation()

  return (
    <div sx={{ flex: "row", align: "center" }}>
      <div
        sx={{ flex: "column", justify: "center", width: ["auto", "auto", 120] }}
      >
        <Text fs={14} fw={400} color="neutralGray400" lh={26}>
          {t("pools.pool.poolDetails.fee")}
        </Text>
        <Text lh={22} color="white" tAlign={["right", "right", "left"]}>
          {t("value.percentage", { value: getTradeFee(props.pool.tradeFee) })}
        </Text>
      </div>
    </div>
  )
}
