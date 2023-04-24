import { InfoTooltip } from "components/InfoTooltip/InfoTooltip"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { usePoolDetailsTradeVolume } from "../../details/PoolDetails.utils"
import { SInfoIcon } from "./PoolValueVolume.styled"

type Props = { poolId: string }

export const PoolValueVolume = ({ poolId }: Props) => {
  const { t } = useTranslation()
  const volume = usePoolDetailsTradeVolume(poolId)

  return (
    <div sx={{ flex: "column", width: ["auto", "auto", 120], align: "start" }}>
      <div sx={{ flex: "row", align: "center", gap: 6 }}>
        <Text
          fs={14}
          color="neutralGray400"
          lh={26}
          fw={400}
          css={{ display: "inline" }}
        >
          {t("pools.pool.poolDetails.24hours")}
        </Text>
        <InfoTooltip text={t("pools.pool.poolDetails.24hours.tooltip")}>
          <SInfoIcon />
        </InfoTooltip>
      </div>

      <Text
        lh={22}
        color="white"
        tAlign={["right", "right", "left"]}
        sx={{ width: "calc(100% - 20px)" }}
      >
        {t("value.usd", { amount: volume })}
      </Text>
    </div>
  )
}
