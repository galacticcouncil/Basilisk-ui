import { PoolBase } from "@galacticcouncil/sdk"
import { FC, useState } from "react"
import { useMedia } from "react-use"
import { PoolActions } from "sections/pools/pool/actions/PoolActions"
import { PoolDetails } from "sections/pools/pool/details/PoolDetails"
import { PoolFooter } from "sections/pools/pool/footer/PoolFooter"
import { PoolIncentives } from "sections/pools/pool/incentives/PoolIncentives"
import { SContainer, SGridContainer } from "sections/pools/pool/Pool.styled"
import { PoolShares } from "sections/pools/pool/shares/PoolShares"
import { theme } from "theme"
import { PoolValue } from "./details/PoolValue"
import { PositionChip } from "./position/chip/PoolPositionChip"

type Props = { pool: PoolBase }

export const Pool: FC<Props> = ({ pool }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isDesktop = useMedia(theme.viewport.gte.sm)

  return (
    <SContainer id={pool.address}>
      <PositionChip
        sx={{ display: ["inline-block", "none"] }}
        poolId={pool.address}
      />
      <SGridContainer>
        <PoolDetails pool={pool} css={{ gridArea: "details" }} />
        <PoolIncentives
          poolId={pool.address}
          css={{ gridArea: "incentives" }}
        />
        <PoolValue pool={pool} css={{ gridArea: "values" }} />
        <PoolActions
          pool={pool}
          isExpanded={isExpanded}
          onExpandClick={() => setIsExpanded((prev) => !prev)}
          css={{ gridArea: "actions" }}
        />
      </SGridContainer>
      {isDesktop && isExpanded && <PoolShares pool={pool} />}
      {isDesktop && <PoolFooter pool={pool} />}
    </SContainer>
  )
}
