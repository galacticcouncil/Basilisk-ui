import {
  useTotalInFarms,
  useTotalsInPools,
} from "sections/pools/header/PoolsHeader.utils"
import { Text } from "components/Typography/Text/Text"
import { Heading } from "components/Typography/Heading/Heading"
import { useTranslation } from "react-i18next"
import { Separator } from "components/Separator/Separator"

export const PoolsHeaderTotals = () => {
  const { t } = useTranslation()
  const totalInPools = useTotalsInPools()
  const totalInFarms = useTotalInFarms()

  return (
    <div
      sx={{ flex: ["column", "row"], mb: 40 }}
      css={{ "> *:not([role='separator'])": { flex: 1 } }}
    >
      <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
        <Text color="neutralGray300" sx={{ mb: 14 }}>
          {t("pools.header.totalLocked")}
        </Text>
        <div sx={{ flex: "row", align: "baseline" }}>
          <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
            {t("value.usd", {
              amount: totalInPools.data?.poolTotal,
            })}
          </Heading>
        </div>
      </div>
      <Separator sx={{ mb: 12, display: ["inherit", "none"] }} />
      <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
        <Text color="neutralGray300" sx={{ mb: 14 }}>
          {t("pools.header.totalFarms")}
        </Text>
        <div sx={{ flex: "row", align: "baseline" }}>
          <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
            {t("value.usd", { amount: totalInFarms.data })}
          </Heading>
        </div>
      </div>
    </div>
  )
}

export const PoolsHeaderUserTotals = () => {
  const { t } = useTranslation()
  const totalInPools = useTotalsInPools()
  const totalInFarms = useTotalInFarms()

  return (
    <div
      sx={{ flex: ["column", "row"], mb: 40 }}
      css={{ "> *:not([role='separator'])": { flex: 1 } }}
    >
      <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
        <Text color="neutralGray300" sx={{ mb: 14 }}>
          {t("pools.header.myLocked")}
        </Text>
        <div sx={{ flex: "row", align: "baseline" }}>
          <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
            {t("value.usd", {
              amount: totalInPools.data?.userTotal,
            })}
          </Heading>
        </div>
      </div>
      <Separator sx={{ mb: 12, display: ["inherit", "none"] }} />
      <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
        <Text color="neutralGray300" sx={{ mb: 14 }}>
          {t("pools.header.myFarms")}
        </Text>
        <div sx={{ flex: "row", align: "baseline" }}>
          <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
            {t("value.usd", { amount: totalInFarms.data })}
          </Heading>
        </div>
      </div>
    </div>
  )
}
