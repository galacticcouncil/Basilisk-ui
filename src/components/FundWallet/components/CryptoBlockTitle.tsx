import { Heading } from "../../Typography/Heading/Heading"
import { ReactComponent as FundCryptoIcon } from "assets/icons/FundCryptoIcon.svg"
import styled from "@emotion/styled"
import { useTranslation } from "react-i18next"

const SWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 9px;
`

export const CryptoBlockTitle = () => {
  const { t } = useTranslation()

  return (
    <SWrapper>
      <FundCryptoIcon />
      <Heading as="h2" fw={600} fs={20}>
        {t("fund.modal.crypto.title")}
      </Heading>
    </SWrapper>
  )
}
