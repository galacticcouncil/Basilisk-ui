import { FC } from "react"
import { StyledDivider } from "components/Divider/Divider.styled"
import { Color, MarginProps } from "common/styles"

type Props = {
  height?: number
  color?: Color
} & MarginProps

export const Divider: FC<Props> = (props) => {
  return <StyledDivider {...props} />
}
