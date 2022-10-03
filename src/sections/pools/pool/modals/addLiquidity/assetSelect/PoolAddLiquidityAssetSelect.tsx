import { MarginProps } from "utils/styles"
import { AssetInput } from "components/AssetInput/AssetInput"
import { Box } from "components/Box/Box"
import { Text } from "components/Typography/Text/Text"
import { FC, ReactNode } from "react"
import { Trans, useTranslation } from "react-i18next"
import { SContainer, SMaxButton } from "./PoolAddLiquidityAssetSelect.styled"
import { u32 } from "@polkadot/types"
import BigNumber from "bignumber.js"
import { getFloatingPointAmount } from "utils/balance"
import { Select } from "../../../../../../components/Select/Select"
import { useFilteredPools } from "../../../../PoolsPage.utils"
import { getAssetLogo } from "../../../../../../components/AssetIcon/AssetIcon"

type Props = {
  name: string
  asset: u32 | string
  balance: BigNumber | undefined
  decimals: number
  currency: { short: string; full: string }
  assetIcon: ReactNode
  value: string
  onChange: (v: string) => void
} & MarginProps

export const PoolAddLiquidityAssetSelect: FC<Props> = ({
  name,
  value,
  onChange,
  asset,
  balance,
  decimals,
  ...p
}) => {
  const { t } = useTranslation()

  const pools = useFilteredPools({
    showMyPositions: false,
  })

  return (
    <SContainer {...p}>
      <Box flex acenter spread mb={11}>
        <Text fw={600} lh={22} color="primary200">
          {t("selectAsset.title")}
        </Text>
        <Box flex acenter>
          <Text fs={12} mr={5} lh={16} color="white">
            <Trans
              t={t}
              i18nKey="selectAsset.balance"
              tOptions={{
                balance,
                decimalPlaces: 4,
                fixedPointScale: decimals,
              }}
            >
              <span css={{ opacity: 0.7 }} />
            </Trans>
          </Text>
          <SMaxButton
            size="micro"
            text={t("selectAsset.button.max")}
            capitalize
            onClick={() => {
              if (balance != null) {
                onChange(getFloatingPointAmount(balance, decimals).toFixed(4))
              }
            }}
          />
        </Box>
      </Box>
      <Box flex spread acenter>
        <Select
          value={asset}
          options={
            pools.data?.map((pool) => {
              const assetIcon = getAssetLogo(pool.tokens[0].symbol)
              return {
                label: pool.tokens[0].symbol,
                value: pool.tokens[0].id,
                icon: assetIcon,
              }
            }) ?? []
          }
        />
        <AssetInput
          value={value}
          name={name}
          label={t("selectAsset.input.label")}
          onChange={onChange}
          dollars="1234 USD"
          unit={p.currency.short}
        />
      </Box>
    </SContainer>
  )
}
