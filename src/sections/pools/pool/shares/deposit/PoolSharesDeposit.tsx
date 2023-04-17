import { PoolBase } from "@galacticcouncil/sdk"
import { DepositNftType } from "api/deposits"
import { ReactComponent as FarmIcon } from "assets/icons/FarmIcon.svg"
import { Separator } from "components/Separator/Separator"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Text } from "components/Typography/Text/Text"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import {
  SContainer,
  SIcon,
  SPositionContainer,
} from "sections/pools/pool/shares/deposit/PoolSharesDeposit.styled"
import { useEnteredDate } from "utils/block"
import { BN_0 } from "utils/constants"
import { useDepositValues } from "utils/farms/deposits"
import { PoolPositionFarmRedeposit } from "../../position/farm/PoolPositionFarmRedeposit"
import { PoolSharesDepositFarm } from "./PoolSharesDepositFarm"
import { PoolSharesDetailsButton } from "./PoolSharesDetailsButton"

type Props = {
  index: number
  depositNft: DepositNftType
  pool: PoolBase
}

export const PoolSharesDeposit: FC<Props> = ({ depositNft, index, pool }) => {
  const { t } = useTranslation()

  const { assetA, assetB, amountUSD } = useDepositValues(depositNft)

  // use latest entry date
  const enteredDate = useEnteredDate(
    depositNft.deposit.yieldFarmEntries.reduce(
      (acc, curr) =>
        acc.lt(curr.enteredAt.toBigNumber())
          ? curr.enteredAt.toBigNumber()
          : acc,
      BN_0,
    ),
  )

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
                date: enteredDate.data,
              })}
            </Text>
          </div>
          <Separator sx={{ my: "5px" }} orientation="vertical" />
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
          <Separator sx={{ my: "5px" }} orientation="vertical" />
          <div sx={{ flex: "column", gap: 6 }}>
            <Text fs={12} lh={16} color="neutralGray500">
              {t("pools.pool.positions.position.current")}
            </Text>
            <div sx={{ flex: "column", gap: 2 }}>
              <Text fs={14} lh={18} color="white">
                {t("value.usd", { amount: amountUSD })}
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
          <Separator sx={{ my: "5px" }} orientation="vertical" />
          <PoolSharesDetailsButton pool={pool} depositNft={depositNft} />
        </SPositionContainer>
        <Separator />
        <div sx={{ flex: "row", justify: "space-between" }}>
          <PoolSharesDepositFarm pool={pool} depositNft={depositNft} />
          <PoolPositionFarmRedeposit pool={pool} depositNft={depositNft} />
        </div>
      </div>
    </SContainer>
  )
}
