import { Text } from "components/Typography/Text/Text"
import { theme } from "theme"
import { useTranslation } from "react-i18next"
import BN from "bignumber.js"

type Props = {
  lockedMax: BN
  lockedMaxUSD: BN
  reserved: BN
  reservedUSD: BN
}

export const WalletAssetsTableDetails = ({
  lockedMax,
  lockedMaxUSD,
  reserved,
  reservedUSD,
}: Props) => {
  const { t } = useTranslation()

  return (
    <div sx={{ flex: "row" }}>
      <div sx={{ m: "auto" }}>
        <Text fs={12} lh={14} fw={500} color="neutralGray300">
          {t("wallet.assets.table.details.reserved")}
        </Text>
        <Text fs={16} lh={22} fw={400} color="white" sx={{ mt: 8 }}>
          {t("value", { value: reserved })}
        </Text>
        <Text fs={11} lh={16} fw={500} color="neutralGray500" sx={{ mt: 2 }}>
          {t("value.usd", { amount: reservedUSD })}
        </Text>
      </div>
      <div
        css={{
          width: 1,
          background: `rgba(${theme.rgbColors.white}, 0.06)`,
        }}
      />
      <div sx={{ m: "auto" }}>
        <Text fs={12} lh={14} fw={500} color="neutralGray300">
          {t("wallet.assets.table.details.locked")}
        </Text>
        <Text fs={14} lh={18} fw={500} color="white" sx={{ mt: 8 }}>
          {t("value", { value: lockedMax, type: "token" })}
        </Text>
        <Text fs={12} lh={16} fw={500} color="neutralGray500" sx={{ mt: 2 }}>
          {t("value.usd", { amount: lockedMaxUSD, type: "dollar" })}
        </Text>
      </div>
    </div>
  )
}
