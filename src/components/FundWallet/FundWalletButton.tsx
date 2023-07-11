import { Button, ButtonProps } from "../Button/Button"
import styled from "@emotion/styled"

const SButton = styled(Button)`
  font-size: 12px;
  line-height: 12px;
  padding: 11px 15px 11px 15px;
`

type Props = Pick<ButtonProps, "onClick">

export const FundWalletButton = (props: Props) => (
  <SButton {...props} variant="primary">
    Fund wallet
  </SButton>
)
