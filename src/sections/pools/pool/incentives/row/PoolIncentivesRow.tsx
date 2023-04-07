import { u32 } from "@polkadot/types-codec"
import { useAsset } from "api/asset"
import BigNumber from "bignumber.js"
import { Icon } from "components/Icon/Icon"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { SContainer } from "sections/pools/pool/incentives/PoolIncentives.styled"

type Props = { assetId: u32; apr: BigNumber; minApr: BigNumber }

export const PoolIncentivesRow = ({ assetId, apr, minApr }: Props) => {
  const { t } = useTranslation()
  const asset = useAsset(assetId)

  return (
    <SContainer>
      <Icon icon={asset.data?.icon} sx={{ mr: 10 }} size={28} />
      <Text color="white" fw={500}>
        {asset.data?.symbol}
      </Text>
      <Text fw={500} color="primary200" sx={{ ml: "auto" }}>
        {t("value.APR.range", { from: minApr, to: apr })}
      </Text>
    </SContainer>
  )
}
