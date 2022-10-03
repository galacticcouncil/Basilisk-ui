import { FC, ReactNode } from "react"
import { Icon } from "../Icon/Icon"
import { SSelectOption } from "./SelectOption.styled"
import { Text } from "../Typography/Text/Text"
import { Box } from "../Box/Box"

export interface SelectOption {
  label: string
  subLabel?: string
  value: string
  icon?: ReactNode
}

interface SelectOptionProps extends SelectOption {
  onSelect: (value: string) => void
}

export const SOption: FC<SelectOptionProps> = ({
  label,
  icon,
  value,
  onSelect,
  subLabel,
}) => (
  <SSelectOption onClick={() => onSelect(value)}>
    {icon && <Icon icon={icon} mr={10} />}
    <Box mr={6}>
      <Text fw={700} color="white">
        {label}
      </Text>
      {subLabel && (
        <Text color="neutralGray400" fs={12} lh={14}>
          {subLabel}
        </Text>
      )}
    </Box>
  </SSelectOption>
)
