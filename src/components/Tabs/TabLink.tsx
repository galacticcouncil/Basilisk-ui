import { Link, Search } from "@tanstack/react-location"
import { ReactNode } from "react"
import { Button, ButtonProps } from "../Button/Button"

type Props = ButtonProps & {
  to: string
  icon?: ReactNode
  isActive?: boolean
  fullWidth?: boolean
  search?: Search<unknown>
}

export const TabLink = ({ to, children, icon, fullWidth, search }: Props) => (
  <Link to={to} search={search} sx={{ width: fullWidth ? "100%" : "auto" }}>
    {({ isActive }) => (
      <Button
        variant="outline"
        active={isActive}
        sx={{ p: "12px 34px", width: fullWidth ? "100%" : "auto" }}
        transform="none"
      >
        {icon}
        {children}
      </Button>
    )}
  </Link>
)
