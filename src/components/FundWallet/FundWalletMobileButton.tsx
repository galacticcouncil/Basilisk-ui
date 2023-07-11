import { Button, ButtonProps } from "../Button/Button"

type Props = Pick<ButtonProps, "onClick">

export const FundWalletMobileButton = (props: Props) => (
  <Button {...props} variant="primary" fullWidth={true}>
    Fund wallet
  </Button>
)
