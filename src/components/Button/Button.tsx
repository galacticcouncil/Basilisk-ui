import { Link } from "components/Link/Link"
import {
  ComponentProps,
  ElementType,
  FC,
  forwardRef,
  ReactNode,
  SyntheticEvent,
} from "react"
import {
  SButton,
  SButtonTransparent,
  SContent,
  SSpinner,
} from "./Button.styled"

export type ButtonProps = {
  variant?: "primary" | "secondary" | "gradient" | "transparent" | "outline"
  disabled?: boolean
  text?: string
  to?: string
  type?: "button" | "submit" | "reset"
  onClick?: (e: SyntheticEvent) => void
  size?: "small" | "medium" | "micro"
  transform?: "uppercase" | "lowercase" | "none"
  fullWidth?: boolean
  isLoading?: boolean
  capitalize?: boolean
  children?: ReactNode
  className?: string
  active?: boolean
  as?: ElementType<any>
}

export const Button: FC<ButtonProps> = ({
  type = "button",
  variant = "secondary",
  size = "medium",
  as = "button",
  ...props
}) => {
  const disabled = props.isLoading || props.disabled
  const element = (
    <SButton
      {...props}
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      as={as}
    >
      <SContent>
        {props.isLoading && <SSpinner width={16} height={16} />}
        {props.text || props.children}
      </SContent>
    </SButton>
  )
  if (props.to) return <Link to={props.to}>{element}</Link>
  return element
}

export const ButtonTransparent = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof SButtonTransparent>
>((props, ref) => {
  return <SButtonTransparent ref={ref} type="button" {...props} />
})
