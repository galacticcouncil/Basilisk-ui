import React, { FC } from "react"
import { formatAssetValue } from "utils/formatting"
import { Maybe } from "utils/helpers"
import {
  SDollars,
  SErrorMessage,
  SInput,
  SInputWrapper,
  SLabelWrapper,
  SUnit,
} from "./AssetInput.styled"

export type AssetInputProps = {
  value: Maybe<string>
  onChange: (val: string) => void
  name: string
  label: string
  dollars?: string
  unit?: Maybe<string>
  type?: string
  placeholder?: string
  error?: string
  withLabel?: boolean
  className?: string
  disabled?: boolean
}

export const AssetInput: FC<AssetInputProps> = (props) => {
  return (
    <div
      className={props.className}
      css={{ position: "relative", width: "100%" }}
    >
      <SLabelWrapper
        htmlFor={props.name}
        error={props.error}
        disabled={props.disabled}
      >
        <SInputWrapper>
          <SInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.validity.valid) {
                props.onChange(
                  e.target.value.replace(/\s+/g, "").replace(/,/g, "."),
                )
              }
            }}
            value={formatAssetValue(props.value ?? "")}
            id={props.name}
            type={props.type}
            placeholder={props.placeholder}
            disabled={props.disabled}
          />
          {props.unit && <SUnit>{props.unit}</SUnit>}
        </SInputWrapper>
        {!props.disabled && props.dollars && (
          <SDollars>{`≈  ${props.dollars}`}</SDollars>
        )}
      </SLabelWrapper>
      {props.error && <SErrorMessage>{props.error}</SErrorMessage>}
    </div>
  )
}
