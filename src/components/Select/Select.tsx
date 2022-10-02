import { FC, ReactNode, useCallback, useRef, useState } from "react"
import { Icon } from "../Icon/Icon"
import { Box } from "../Box/Box"
import { Text } from "../Typography/Text/Text"
import {
  SSelectButton,
  SSelectWrapper,
  SChevron,
  SSelectOptionsWrapper,
} from "./Select.styled"
import { u32 } from "@polkadot/types"

interface SelectProps {
  options: {
    label: string
    subLabel?: string
    value: string | u32
    icon?: ReactNode
  }[]
  value?: string | u32
  onChange?: (value: string) => void
}

export const Select: FC<SelectProps> = ({ options, value }) => {
  const [isOpened, setIsOpened] = useState(false)
  const [selected, setSelected] = useState(value)

  const selectWrapperRef = useRef<HTMLDivElement>(null)
  const selectedOption = options.find((option) => option.value === selected)

  const handleToggleOpen = useCallback(() => {
    setIsOpened((isOpened) => !isOpened)
  }, [setIsOpened])

  return (
    <SSelectWrapper ref={selectWrapperRef}>
      <SSelectButton size="small" onClick={handleToggleOpen}>
        {selectedOption && (
          <>
            {selectedOption.icon && <Icon icon={selectedOption.icon} mr={10} />}
            <Box mr={6}>
              <Text fw={700} color="white">
                {selectedOption.label}
              </Text>
              <Text color="neutralGray400" fs={12} lh={14}>
                {selectedOption.subLabel}
              </Text>
            </Box>
          </>
        )}

        <Icon icon={<SChevron direction={isOpened ? "up" : "down"} />} />
      </SSelectButton>
      {isOpened && <SSelectOptionsWrapper>Test</SSelectOptionsWrapper>}
    </SSelectWrapper>
  )
}
