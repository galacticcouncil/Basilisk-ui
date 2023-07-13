import { Heading } from "components/Typography/Heading/Heading"
import { ReactComponent as FundCryptoIcon } from "assets/icons/FundCryptoIcon.svg"
import { useTranslation } from "react-i18next"

export const CryptoBlockTitle = () => {
  const { t } = useTranslation()

  return (
    <div sx={{ display: 'flex', align: 'center', gap: 9  }}>
      <FundCryptoIcon />
      <Heading as="h2" fw={600} fs={20}>
        {t("fund.modal.crypto.title")}
      </Heading>
    </div>
  )
}
