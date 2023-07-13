import { ButtonProps } from "../Button/Button"
import { useTranslation } from "react-i18next"
import { Button } from "../Button/Button"

type Props = Pick<ButtonProps, "onClick">

export const FundWalletButton = (props: Props) => {
  const { t } = useTranslation()

  return (
    <Button
      {...props}
      variant="primary"
      sx={{ fontSize: 12, lineHeight: 12, p: "11px 15px" }}
    >
      {t("fund.button")}
    </Button>
  )
}
