import { Text } from "../../../components/Typography/Text/Text"
import { Heading } from "../../../components/Typography/Heading/Heading"
import { Separator } from "../../../components/Separator/Separator"
import { useTranslation } from "react-i18next"
import {
  useVestingClaimableBalance,
  useVestingTotalVestedAmount,
} from "../../../api/vesting"
import { useSpotPrice } from "../../../api/spotPrice"
import { useAUSD } from "../../../api/asset"
import { NATIVE_ASSET_ID } from "../../../utils/network"
import { useMemo } from "react"
import { BN_0 } from "../../../utils/constants"
import { useAssetMeta } from "../../../api/assetMeta"

export const WalletVestingHeader = () => {
  const { t } = useTranslation()

  const claimableBalance = useVestingClaimableBalance()
  const totalVestedAmount = useVestingTotalVestedAmount()

  const AUSD = useAUSD()
  const spotPrice = useSpotPrice(NATIVE_ASSET_ID, AUSD.data?.id)
  const { data: nativeAsset } = useAssetMeta(NATIVE_ASSET_ID)


  const claimableUSD = useMemo(() => {
    if (claimableBalance && spotPrice.data) {
      return claimableBalance.times(spotPrice.data.spotPrice)
    }
    return BN_0
  }, [claimableBalance, spotPrice])

  const totalVestedUSD = useMemo(() => {
    if (totalVestedAmount && spotPrice.data) {
      return totalVestedAmount.times(spotPrice.data.spotPrice)
    }
    return BN_0
  }, [totalVestedAmount, spotPrice])

  return (
    <div sx={{ flex: ["column", "row"], mb: 40, align: "center", gap: 130 }}>
      <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
        <Text color="neutralGray300" sx={{ mb: 14 }}>
          {t("wallet.vesting.claimable")}
        </Text>
        <div sx={{ flex: "row", align: "start" }}>
          <Heading as="h3" sx={{ fontSize: [16, 58], fontWeight: 900 }}>
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
          <Heading as="h3" sx={{ fontSize: [16, 28], fontWeight: 900 }}>
            {t("value.bsx", { value: totalVestedAmount, decimalPlaces: 2, fixedPointScale: nativeAsset?.data?.decimals })}
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
          {t("value.usd", { amount: totalVestedUSD })}
        </Text>
      </div>
    </div>
  )
}
