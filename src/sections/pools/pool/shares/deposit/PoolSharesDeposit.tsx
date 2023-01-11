import { FC } from "react"
import {
  SContainer,
  SIcon,
  SPositionContainer,
} from "sections/pools/pool/shares/deposit/PoolSharesDeposit.styled"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { useTranslation } from "react-i18next"
import { ReactComponent as FarmIcon } from "assets/icons/FarmIcon.svg"
import { PoolBase } from "@galacticcouncil/sdk"
import { DepositNftType } from "api/deposits"
import { Text } from "components/Typography/Text/Text"
import { PoolPositionFarmRedeposit } from "../../position/farm/PoolPositionFarmRedeposit"
import { usePoolSharesDeposit } from "./PoolSharesDeposit.utils"
import { PoolSharesDepositFarm } from "./PoolSharesDepositFarm"

type Props = {
  index: number
  depositNft: DepositNftType
  pool: PoolBase
}

export const PoolSharesDeposit: FC<Props> = ({ depositNft, index, pool }) => {
  const { t } = useTranslation()

  const { enteredDate, usdValue, assetA, assetB } = usePoolSharesDeposit({
    depositNft,
    pool,
  })

  return (
    <SContainer>
      <SIcon>
        <FarmIcon />
      </SIcon>
      <div sx={{ flex: "column", gap: 12 }}>
        <div>
          <GradientText fs={16} lh={22} fw={500}>
            {t("pools.pool.positions.title", { index })}
          </GradientText>
        </div>

        <SPositionContainer>
          <div sx={{ flex: "column", gap: 6 }}>
            <Text fs={12} lh={16} color="neutralGray500">
              {t("pools.pool.positions.position.title", { index })}
            </Text>
            <Text fs={14} lh={18} color="white">
              {t("pools.pool.positions.position.entered", {
                date: enteredDate,
              })}
            </Text>
          </div>
          <div sx={{ flex: "column", gap: 6 }}>
            <Text fs={12} lh={16} color="neutralGray500">
              {t("pools.pool.positions.position.locked")}
            </Text>
            <Text
              fs={14}
              lh={18}
              color="white"
              css={{ wordBreak: "break-all" }}
            >
              {t("pools.pool.positions.position.shares", {
                shares: depositNft.deposit.shares,
              })}
            </Text>
          </div>
          <div sx={{ flex: "column", gap: 6 }}>
            <Text fs={12} lh={16} color="neutralGray500">
              {t("pools.pool.positions.position.current")}
            </Text>
            <div sx={{ flex: "column", gap: 2 }}>
              <Text fs={14} lh={18} color="white">
                {t("value.usd", { amount: usdValue })}
              </Text>
              <Text fs={12} lh={16} color="neutralGray500">
                {t("pools.pool.positions.position.amounts", {
                  amountA: assetA?.amount,
                  symbolA: assetA?.symbol,
                  amountB: assetB?.amount,
                  symbolB: assetB?.symbol,
                })}
              </Text>
            </div>
          </div>
          <PoolSharesDepositFarm pool={pool} depositNft={depositNft} />

          <PoolPositionFarmRedeposit pool={pool} depositNft={depositNft} />
        </SPositionContainer>
      </div>
    </SContainer>
  )
}
