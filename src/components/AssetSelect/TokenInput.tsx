import { useTranslation } from "react-i18next"
import { SMaxButton } from "./TokenInput.styled"

export const TokenInputMaxButton = (props: { onClick: () => void }) => {
  const { t } = useTranslation()
  return (
    <SMaxButton
      size="micro"
      text={t("tokenInput.button.max")}
      capitalize
      onClick={props.onClick}
    />
  )
}

export { SContainer as TokenInputContainer } from "./TokenInput.styled"
