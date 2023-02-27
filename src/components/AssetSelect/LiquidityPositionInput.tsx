import { PoolBase } from "@galacticcouncil/sdk"
import { useTokenBalance } from "api/balances"
import { usePoolShareToken } from "api/pools"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { AssetInput } from "components/AssetInput/AssetInput"
import { MultipleIcons } from "components/MultipleIcons/MultipleIcons"
import { Text } from "components/Typography/Text/Text"
import { Trans, useTranslation } from "react-i18next"
import { useAccountStore } from "state/store"
import { getFloatingPointAmount } from "utils/balance"
import { TokenInputContainer, TokenInputMaxButton } from "./TokenInput"
import { useAsset } from "api/asset"

export const LiquidityPositionInput = (props: {
  name: string

  value: string
  onChange: (value: string) => void

  pool: PoolBase

  title?: string
  className?: string

  error?: string
}) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  const shareToken = usePoolShareToken(props.pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

  const assetIn = useAsset(props.pool?.tokens[0].id)
  const assetOut = useAsset(props.pool?.tokens[1].id)

  return (
    <TokenInputContainer className={props.className}>
      <Text fw={500} lh={22} color="primary200" css={{ gridArea: "title" }}>
        {props.title}
      </Text>

      <div
        sx={{ flex: "row", align: "center", pt: [5, 0], justify: "end" }}
        css={{ gridArea: "balance" }}
      >
        <Text fs={12} lh={16} color="white" sx={{ mr: 5 }}>
          <Trans
            t={t}
            i18nKey="selectAsset.balance"
            tOptions={{
              balance: balance.data?.balance,
              fixedPointScale: 12,
              type: "token",
            }}
          >
            <span css={{ opacity: 0.7 }} />
          </Trans>
        </Text>
        <TokenInputMaxButton
          onClick={() => {
            if (balance.data?.balance != null) {
              props.onChange(
                getFloatingPointAmount(balance.data.balance, 12).toString(),
              )
            }
          }}
        />
      </div>

      <div
        sx={{ flex: "row", align: "center", justify: "space-between" }}
        css={{ gridArea: "input" }}
      >
        <div sx={{ flex: "row", flexShrink: 0, gap: 6, align: "center" }}>
          <MultipleIcons
            icons={[
              { icon: getAssetLogo(assetIn.data?.symbol) },
              { icon: getAssetLogo(assetOut.data?.symbol) },
            ]}
          />
          <div sx={{ flex: "column", mr: 20, flexShrink: 0 }}>
            <Text fw={700} fs={16}>
              {assetIn.data?.symbol}/{assetOut.data?.symbol}
            </Text>
            <Text fw={500} fs={12} color="neutralGray500">
              {assetIn.data?.name}/{assetOut.data?.name}
            </Text>
          </div>
        </div>

        <AssetInput
          name={props.name}
          label={t("selectAsset.input.label")}
          value={props.value}
          onChange={props.onChange}
          error={props.error}
          css={{ flexGrow: 1 }}
        />
      </div>
    </TokenInputContainer>
  )
}
