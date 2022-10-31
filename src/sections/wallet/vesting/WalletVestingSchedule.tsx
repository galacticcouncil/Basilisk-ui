import { SSchedule, SInner } from "./WalletVestingSchedule.styled"
import { Text } from "../../../components/Typography/Text/Text"
import { Trans, useTranslation } from "react-i18next"
import { getFormatSeparators } from "../../../utils/formatting"
import i18n from "i18next"
import { css } from "@emotion/react"
import { theme } from "../../../theme"
import { Heading } from "../../../components/Typography/Heading/Heading"
import { Button } from "../../../components/Button/Button"

export const WalletVestingSchedule = () => {

  const { t } = useTranslation()
  const separators = getFormatSeparators(i18n.languages[0])

  const [num, denom] = t("value", {
    value: 0,
    fixedPointScale: 12,
    decimalPlaces: 2,
  }).split(separators.decimal ?? ".")

  return <SSchedule>
    <SInner>
      <div sx={{
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}>
        <Text color="primary200" fs={16} fw={500}>{t("wallet.vesting.claimable_now")}</Text>
        <Heading as="h3" sx={{ fontSize: [16, 42], fontWeight: 900 }}>
          <Trans
            t={t}
            i18nKey="wallet.vesting.claimable_now_value"
            tOptions={{ num, denom }}
          >
              <span
                css={css`
                  color: rgba(${theme.rgbColors.white}, 0.4);
                  font-size: 22px;
                `}
              />
          </Trans>
        </Heading>
        <Text
          color="neutralGray300"
          fs={16}
          lh={18}
        >
          {t("value.usd", { amount: 0 })}
        </Text>
      </div>
      <div>
        <Button variant="gradient" transform="uppercase" sx={{
          fontWeight: 800
        }}>{t("wallet.vesting.claim_assets")}</Button>
      </div>
    </SInner>
  </SSchedule>
}
