import { SBox } from "./WalletVestingBox.styled"
import { Heading } from "../../../components/Typography/Heading/Heading"
import { useTranslation } from "react-i18next"
import { WalletVestingSchedule } from "./WalletVestingSchedule"
import { WalletVestingEmpty } from "./WalletVestingEmpty"

export const WalletVestingBox = () => {

  const { t } = useTranslation()

  return <SBox>
    <Heading fs={20} fw={500} sx={{
      ml: 10
    }}>{t("wallet.vesting.your_vesting")}</Heading>
    <WalletVestingEmpty />
    <WalletVestingSchedule />
  </SBox>
}
