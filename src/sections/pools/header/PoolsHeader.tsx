import { Separator } from "components/Separator/Separator"
import { Switch } from "components/Switch/Switch"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Text } from "components/Typography/Text/Text"
import { FC, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { PoolsHeaderTotal } from "sections/pools/header/PoolsHeaderTotal"
import { useAccountStore } from "state/store"
import { useTotalInPositions } from "utils/farms/positions"
import { useUsersTotalInDeposits } from "utils/totals"
import { PoolsHeaderVolume } from "./PoolsHeaderVolume"

const TotalsTest = () => {
  const oldTotal = useTotalInPositions()
  const newTotal = useUsersTotalInDeposits()

  useEffect(() => {
    if (oldTotal.data && newTotal.data) {
      console.log("--------------------------------")
      console.log("OLD: ", oldTotal.data.toFixed(12))
      console.log("NEW: ", newTotal.data.toFixed(12))
      console.log("EQ?: ", oldTotal.data.eq(newTotal.data))
      console.log("--------------------------------")
    }
  }, [oldTotal.data, newTotal.data])

  return null
}

type Props = {
  showMyPositions: boolean
  onShowMyPositionsChange: (value: boolean) => void
}

export const PoolsHeader: FC<Props> = ({
  showMyPositions,
  onShowMyPositionsChange,
}) => {
  const { t } = useTranslation()

  const { account } = useAccountStore()

  return (
    <>
      <TotalsTest />
      <div sx={{ flex: "row", justify: "space-between", mb: 43 }}>
        <GradientText fs={30} fw={700}>
          {t("pools.header.title")}
        </GradientText>
        {!!account && (
          <Switch
            value={showMyPositions}
            onCheckedChange={onShowMyPositionsChange}
            size="small"
            name="my-positions"
            label={t("pools.header.switch")}
          />
        )}
      </div>
      <div
        sx={{ flex: ["column", "row"], mb: 40 }}
        css={{ "> *:not([role='separator'])": { flex: 1 } }}
      >
        <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
          <Text color="neutralGray300" sx={{ mb: 14 }}>
            {t("pools.header.totalLocked")}
          </Text>
          <div sx={{ flex: "row", align: "baseline" }}>
            <PoolsHeaderTotal variant="pools" myPositions={showMyPositions} />
          </div>
        </div>
        <Separator sx={{ mb: 12, display: ["inherit", "none"] }} />
        <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
          <Text color="neutralGray300" sx={{ mb: 14 }}>
            {t("pools.header.totalFarms")}
          </Text>
          <div sx={{ flex: "row", align: "baseline" }}>
            <PoolsHeaderTotal variant="farms" myPositions={showMyPositions} />
          </div>
        </div>

        <div sx={{ flex: ["row", "column"], justify: "space-between" }}>
          <Text color="neutralGray300" sx={{ mb: 14 }}>
            {t("pools.header.total24volumes")}
          </Text>
          <div sx={{ flex: "row", align: "baseline" }}>
            <PoolsHeaderVolume myPositions={showMyPositions} variant="pools" />
          </div>
        </div>
      </div>
    </>
  )
}
