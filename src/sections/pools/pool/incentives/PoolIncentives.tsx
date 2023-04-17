import { Separator } from "components/Separator/Separator"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-use"
import { PoolIncentivesRow } from "sections/pools/pool/incentives/row/PoolIncentivesRow"
import { theme } from "theme"
import { useAPR } from "utils/farms/apr"
import { MultiplePoolIncentivesRow } from "./row/MultiplePoolIncentivesRow/MultiplePoolIncentivesRow"

type PoolIncentivesProps = { poolId: string; className?: string }

export const PoolIncentives = ({ poolId, className }: PoolIncentivesProps) => {
  const { t } = useTranslation()
  const isDesktop = useMedia(theme.viewport.gte.sm)
  const { data } = useAPR(poolId)

  return (
    <div className={className}>
      <Text fs={14} lh={26} fw={400} color="neutralGray400">
        {t("pools.pool.incentives.title")}
      </Text>
      <Spacer size={[0, 0, 18]} />
      {isDesktop ? (
        <div>
          {data?.map((row, i) => (
            <PoolIncentivesRow
              key={i}
              assetId={row.assetId}
              apr={row.apr}
              minApr={row.minApr}
            />
          ))}
        </div>
      ) : (
        <MultiplePoolIncentivesRow farms={data ?? []} />
      )}

      <Separator sx={{ mt: 18, display: ["block", "block", "none"] }} />
    </div>
  )
}
