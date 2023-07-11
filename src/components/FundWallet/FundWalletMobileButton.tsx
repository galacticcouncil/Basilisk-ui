import { Button, ButtonProps } from '../Button/Button'
import styled from '@emotion/styled'

type Props = Pick<ButtonProps, 'onClick'>

export const FundWalletMobileButton = (props: Props) => <Button {...props} variant="primary" fullWidth={true}>Fund wallet</Button>
