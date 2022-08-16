import { MarginProps, SizeProps } from "common/styles"
import { Label } from "components/Label/Label"
import React, { FC } from "react"
import { InputWrapper, StyledInput } from "./AssetInput.styled"

export type AssetInputProps = {
  value: string
  onChange: (val: string) => void
  name: string
  label: string
  dollars: string
  unit?: string
  type?: string
  placeholder?: string
  error?: string
  withLabel?: boolean
} & SizeProps &
  MarginProps

export const AssetInput: FC<AssetInputProps> = ({
  onChange,
  value,
  label,
  type = "text",
  placeholder,
  name,
  withLabel,
  ...p
}) => {
  return (
    <>
      <Label
        id={name}
        label={label}
        error={p.error}
        withLabel={withLabel}
        width={p.width || 300}
        mb={5}
        {...p}
      >
        <InputWrapper dollars={p.dollars} unit={p.unit}>
          <StyledInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange(e.target.value)
            }
            value={value ?? ""}
            id={name}
            type={type}
            error={p.error}
            unit={p.unit}
            placeholder={placeholder}
          />
        </InputWrapper>
      </Label>
    </>
  )
}
