import { Page } from "components/Page/Page"
import { PoolsHeader } from "sections/pools/header/PoolsHeader"
import { Pool } from "sections/pools/pool/Pool"
import { Box } from "components/Box/Box"
import { useSdkPools } from "api/pools"

export const PoolsPage = () => {
  const pools = useSdkPools()

  return (
    <Page>
      <PoolsHeader />
      <Box flex column gap={20}>
        {pools.data?.map((pool) => (
          <Pool
            key={pool.address}
            pool={pool}
            hasJoinedFarms={false}
            hasLiquidity={false}
          />
        ))}
      </Box>
    </Page>
  )
}
