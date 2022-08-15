import { BasiliskIcon } from "assets/icons/BasiliskIcon"
import { ChevronDown } from "assets/icons/ChevronDown"
import { noop } from "common/helpers"
import { MarginProps } from "common/styles"
import { Box } from "components/Box/Box"
import { Icon } from "components/Icon/Icon"
import { Input } from "components/Input/Input"
import { Text } from "components/Typography/Text/Text"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { getFormattedNumber } from "utils/formatNumber"
import {
  AssetWrapper,
  MaxButton,
  SelectAssetButton,
} from "./SelectAsset.styled"

const currency1 = { short: "BSX", full: "Basilisk" }

type SelectAssetProps = {
  balance: number
  usd: number
} & MarginProps

export const SelectAsset: FC<SelectAssetProps> = (p) => {
  const { t } = useTranslation()

  return (
    <AssetWrapper {...p}>
      <Box flex acenter spread mb={11}>
        <Text fw={600} lh={22} color="primary200">
          {t("selectAsset.title")}
        </Text>
        <Box flex acenter>
          <Text fs={12} mr={2} lh={16} opacity={70} color="white">
            {t("selectAsset.balance")}
          </Text>
          <Text fs={12} lh={16} mr={5}>
            {getFormattedNumber(p.balance)}
          </Text>
          <MaxButton
            size="micro"
            text={t("selectAsset.button.max")}
            capitalize
          />
        </Box>
      </Box>
      <Box flex spread acenter>
        <SelectAssetButton size="small">
          <Icon icon={<BasiliskIcon />} mr={10} />
          <Box mr={6}>
            <Text fw={700} color="white">
              {currency1.short}
            </Text>
            <Text color="neutralGray400" fs={12} lh={14}>
              {currency1.full}
            </Text>
          </Box>
          <Icon icon={<ChevronDown />} />
        </SelectAssetButton>
        <Input
          value="2345"
          name="amount"
          label="deposit amount"
          onChange={() => noop}
          width={368}
        />
      </Box>
    </AssetWrapper>
  )
}
