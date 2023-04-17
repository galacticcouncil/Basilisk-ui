import { PoolBase } from "@galacticcouncil/sdk"
import { PoolValueTotal } from "./total/PoolValueTotal"
import { PoolValueVolume } from "./volume/PoolValueVolume"

type Props = { pool: PoolBase; className?: string }

export const PoolValue = ({ pool, className }: Props) => {
  return (
    <div
      sx={{ flex: "row", justify: "space-between", align: "end", mb: 16 }}
      className={className}
    >
      <PoolValueTotal pool={pool} />
      <PoolValueVolume poolId={pool.address} />
    </div>
  )
}
