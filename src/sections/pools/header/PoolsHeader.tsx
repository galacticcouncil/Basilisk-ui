import { Separator } from "components/Separator/Separator"
import { Spacer } from "components/Spacer/Spacer"
import { Switch } from "components/Switch/Switch"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { PoolsHeaderTotal } from "sections/pools/header/total/PoolsHeaderTotal"
import { useAccountStore } from "state/store"
import { SValue } from "./PoolsHeader.styled"
import { PoolsHeaderClaim } from "./claim/PoolsHeaderClaim"

type Props = {
  myPositions: boolean
  onMyPositionsChange: (value: boolean) => void
  disableMyPositions: boolean
}

export const PoolsHeader = ({
  myPositions,
  onMyPositionsChange,
  disableMyPositions,
}: Props) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  return (
    <div>
      <div sx={{ flex: "row", justify: "space-between" }}>
        <GradientText fs={[20, 30]} fw={700}>
          {t("pools.header.title")}
        </GradientText>
        {!!account && (
          <Switch
            value={myPositions}
            onCheckedChange={onMyPositionsChange}
            disabled={disableMyPositions}
            size="small"
            name="my-positions"
            label={t("pools.header.switch")}
          />
        )}
      </div>

      <Spacer size={[32, 40]} />

      <div sx={{ flex: ["column", "row"] }}>
        <SValue>
          <Text color="neutralGray300">{t("pools.header.totalLocked")}</Text>
          <PoolsHeaderTotal variant="pools" myPositions={myPositions} />
        </SValue>

        <Separator sx={{ my: 12, display: ["inherit", "none"] }} />

        <SValue>
          <Text color="neutralGray300">{t("pools.header.totalFarms")}</Text>
          <PoolsHeaderTotal variant="farms" myPositions={myPositions} />
        </SValue>

        <Separator sx={{ my: 12, display: ["inherit", "none"] }} />

        <SValue>
          <Text color="neutralGray300">{t("pools.header.total24volumes")}</Text>
          <PoolsHeaderTotal myPositions={myPositions} variant="volume" />
        </SValue>

        <PoolsHeaderClaim />
      </div>
    </div>
  )
}
