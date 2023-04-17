import { useTranslation } from "react-i18next"
import { useUserDeposits } from "utils/farms/deposits"
import { SChip } from "./PoolPositionChip.styled"

type PositionChipProps = { poolId: string; className?: string }

export const PositionChip = ({ poolId, className }: PositionChipProps) => {
  const { t } = useTranslation()
  const { data } = useUserDeposits(poolId)

  if (!data?.length) return null

  return (
    <SChip className={className}>
      {t("pools.pool.positions.amount", { count: data.length })}
    </SChip>
  )
}
