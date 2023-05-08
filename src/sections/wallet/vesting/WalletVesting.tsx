import { WalletVestingHeader } from "./WalletVestingHeader"
import { WalletVestingBox } from "./WalletVestingBox"
import { useApiPromise } from "utils/api"
import { isApiLoaded } from "utils/helpers"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import Skeleton from "react-loading-skeleton"
import { SBox } from "./WalletVestingBox.styled"
import { Heading } from "components/Typography/Heading/Heading"
import { WalletVestingEmpty } from "./WalletVestingEmpty"

export const WalletVesting = () => {
  const { t } = useTranslation()
  const api = useApiPromise()

  if (!isApiLoaded(api))
    return (
      <div
        sx={{
          mt: 45,
        }}
      >
        <div
          sx={{ flex: ["column", "row"], align: ["normal", "center"], mb: 40 }}
        >
          <div
            sx={{
              flex: ["row", "column"],
              justify: ["space-between", "normal"],
              align: ["center", "normal"],
            }}
          >
            <Text color="neutralGray300" fs={[14, 16]} sx={{ mb: [0, 14] }}>
              {t("wallet.vesting.total_vested")}
            </Text>
            <Skeleton sx={{ width: 150, height: 34 }} />
          </div>
        </div>
        <SBox>
          <Heading
            fs={20}
            fw={500}
            sx={{
              ml: 10,
            }}
          >
            {t("wallet.vesting.your_vesting")}
          </Heading>
          <WalletVestingEmpty />
        </SBox>
      </div>
    )

  return (
    <div
      sx={{
        mt: 45,
      }}
    >
      <WalletVestingHeader />
      <WalletVestingBox />
    </div>
  )
}
