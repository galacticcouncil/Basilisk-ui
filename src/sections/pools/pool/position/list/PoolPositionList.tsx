import { FC } from "react"
import {
  SContainer,
  SIcon,
} from "sections/pools/pool/position/list/PoolPositionList.styled"
import { PalletLiquidityMiningDepositData } from "@polkadot/types/lookup"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { useTranslation } from "react-i18next"
import { ReactComponent as FarmIcon } from "assets/icons/FarmIcon.svg"
import { Box } from "components/Box/Box"
import { PoolPosition } from "sections/pools/pool/position/PoolPosition"

type Props = { index: number; deposit: PalletLiquidityMiningDepositData }

export const PoolPositionList: FC<Props> = ({ index, deposit }) => {
  const { t } = useTranslation()

  return (
    <SContainer>
      <SIcon>
        <FarmIcon />
      </SIcon>
      <Box flex column gap={12}>
        <div>
          <GradientText fs={16} lh={22}>
            {t("pools.pool.positions.title", { index })}
          </GradientText>
        </div>
        {deposit.yieldFarmEntries.map((position, i) => (
          <PoolPosition
            key={i}
            position={position}
            index={++i}
            poolId={deposit.ammPoolId}
          />
        ))}
      </Box>
    </SContainer>
  )
}