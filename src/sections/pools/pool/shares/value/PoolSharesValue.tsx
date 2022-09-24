import { FC } from "react"
import { Text } from "components/Typography/Text/Text"
import { Box } from "components/Box/Box"
import { useTranslation } from "react-i18next"
import { Maybe } from "utils/types"
import { u32 } from "@polkadot/types"
import BN from "bignumber.js"
import { PoolBase } from "@galacticcouncil/sdk"
import { useCurrentSharesValue } from "sections/pools/pool/shares/value/PoolSharesValue.utils"

type Props = { token: Maybe<u32>; pool: PoolBase; balance: BN }

export const PoolSharesValue: FC<Props> = (props) => {
  const { t } = useTranslation()

  const { dollarValue } = useCurrentSharesValue(props)

  return (
    <Box flex column gap={6}>
      <Text fs={12} lh={16} color="neutralGray500">
        {t("pools.pool.liquidity.value")}
      </Text>
      <Box flex column gap={2}>
        <Text fs={14} lh={18} color="white">
          TODO
        </Text>
        <Text fs={12} lh={16} color="neutralGray500">
          {t("value.usd", { amount: dollarValue })}
        </Text>
      </Box>
    </Box>
  )
}
