import { Button, ButtonProps } from "../Button/Button"
import { useTranslation } from "react-i18next"
import { ReactComponent as FundIcon } from "assets/icons/FundIcon.svg"

type Props = Pick<ButtonProps, "onClick">

export const FundWalletMobileButton = (props: Props) => {
  const { t } = useTranslation()

  return (
    <Button {...props} variant="primary" fullWidth={true}>
      <FundIcon />
      {t("fund.button")}
    </Button>
  )
}
