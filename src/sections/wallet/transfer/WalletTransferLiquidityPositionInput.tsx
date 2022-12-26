import { useTokenBalance } from "api/balances"
import { PoolShareToken } from "api/pools"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { AssetInput } from "components/AssetInput/AssetInput"
import { DualAssetIcons } from "components/DualAssetIcons/DualAssetIcons"
import { Text } from "components/Typography/Text/Text"
import { Trans, useTranslation } from "react-i18next"
import { useAccountStore } from "state/store"
import { getFloatingPointAmount } from "utils/balance"
import {
  SContainer,
  SMaxButton,
} from "./WalletTransferLiquidityPositionInput.styled"

export const WalletTransferLiquidityPositionInput = (props: {
  name: string

  value: string
  onChange: (value: string) => void

  pool: PoolShareToken

  title?: string
  className?: string

  error?: string
}) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()
  const balance = useTokenBalance(
    props.pool?.shareToken?.token,
    account?.address,
  )

  const [assetIn, assetOut] = props.pool?.tokens

  return (
    <SContainer>
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
        <SMaxButton
          size="micro"
          text={t("selectAsset.button.max")}
          capitalize
          onClick={() => {
            if (balance.data?.balance != null) {
              props.onChange(
                getFloatingPointAmount(balance.data.balance, 12).toFixed(4),
              )
            }
          }}
        />
      </div>

      <div
        sx={{ flex: "row", align: "center", justify: "space-between" }}
        css={{ gridArea: "input" }}
      >
        <div sx={{ flex: "row", flexShrink: 0, align: "center" }}>
          <DualAssetIcons
            firstIcon={{ icon: getAssetLogo(assetIn.symbol) }}
            secondIcon={{ icon: getAssetLogo(assetOut.symbol) }}
          />
          <div sx={{ flex: "column", mr: 20, flexShrink: 0 }}>
            <Text fw={700} fs={16}>
              {assetIn.symbol}/{assetOut.symbol}
            </Text>
            <Text fw={500} fs={12} color="neutralGray500">
              {t("farms.deposit.assetType")}
            </Text>
          </div>
        </div>

        <AssetInput
          name={props.name}
          label={t("selectAsset.input.label")}
          value={props.value}
          onChange={props.onChange}
          css={{ flexGrow: 1 }}
          error={props.error}
        />
      </div>
    </SContainer>
  )
}
