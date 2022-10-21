import { Text } from "../../../components/Typography/Text/Text"
import { Heading } from "../../../components/Typography/Heading/Heading"
import { Separator } from "../../../components/Separator/Separator"
import { useTranslation } from "react-i18next"
import { useVestingClaimableBalance } from "../../../api/vesting"
import { useSpotPrice } from "../../../api/spotPrice"
import { useAUSD } from "../../../api/asset"
import { NATIVE_ASSET_ID } from "../../../utils/network"
import { useMemo } from "react"
import { BN_0 } from "../../../utils/constants"

export const WalletVestingHeader = () => {
  const { t } = useTranslation()

  const claimableBalance = useVestingClaimableBalance()
  const AUSD = useAUSD()
  const spotPrice = useSpotPrice(NATIVE_ASSET_ID, AUSD.data?.id)

  const claimableUSD = useMemo(() => {
    if (claimableBalance && spotPrice.data) {
      return claimableBalance.times(spotPrice.data.spotPrice)
    }
    return BN_0
  }, [claimableBalance, spotPrice])

  return (
    <div
      sx={{ flex: ["column", "row"], mb: 40 }}
      css={{ "> *:not([role='separator'])": { flex: 1 } }}
    >
      <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
        <Text color="neutralGray300" sx={{ mb: 14 }}>
          {t("wallet.vesting.claimable")}
        </Text>
        <div sx={{ flex: "row", align: "start" }}>
          <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
            {t("value", { value: claimableBalance, decimalPlaces: 2 })}
          </Heading>
        </div>
        <Text
          sx={{
            mt: 10,
          }}
          color="neutralGray300"
          fs={16}
          lh={18}
        >
          {t("value.usd", { amount: claimableUSD })}
        </Text>
      </div>
      <Separator sx={{ mb: 12, display: ["inherit", "none"] }} />
      <div sx={{ flex: ["row", "column"], justify: "start" }}>
        <Text color="neutralGray300" sx={{ mb: 14 }}>
          {t("wallet.vesting.total_vested")}
        </Text>
        <div sx={{ flex: "row", align: "start" }}>
          <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
            {t("value.usd", { amount: "2" })}
          </Heading>
        </div>
      </div>
    </div>
  )
}
