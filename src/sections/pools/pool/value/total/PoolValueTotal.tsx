import { PoolBase } from "@galacticcouncil/sdk"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { useTotalInPool } from "../../Pool.utils"

type Props = { pool: PoolBase }

export const PoolValueTotal = ({ pool }: Props) => {
  const { t } = useTranslation()
  const { data } = useTotalInPool(pool)

  return (
    <div>
      <Text fs={14} color="neutralGray400" lh={26}>
        {t("pools.pool.poolDetails.total")}
      </Text>
      <Text lh={22} color="white" fs={18}>
        {t("value.usd", { amount: data })}
      </Text>
    </div>
  )
}
