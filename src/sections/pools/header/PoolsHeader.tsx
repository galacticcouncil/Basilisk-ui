import { Switch } from "components/Switch/Switch"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { useAccountStore } from "state/store"
import {
  PoolsHeaderTotals,
  PoolsHeaderUserTotals,
} from "sections/pools/header/PoolsHeaderTotals"

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
      {showMyPositions ? <PoolsHeaderUserTotals /> : <PoolsHeaderTotals />}
    </>
  )
}
