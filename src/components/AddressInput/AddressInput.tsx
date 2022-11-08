import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"
import { useAsset } from "api/asset"
import { Text } from "components/Typography/Text/Text"
import { InputHTMLAttributes, forwardRef } from "react"
import { BASILISK_ADDRESS_PREFIX, NATIVE_ASSET_ID } from "utils/api"
import { Maybe } from "utils/helpers"
import { SInput, SInputWrapper } from "./AddressInput.styled"

type InputProps = {
  onChange?: (value: string) => void
  value: Maybe<string>
  disabled?: boolean
  type?: InputHTMLAttributes<HTMLInputElement>["type"]

  name: string
  label: string
  error?: string
  placeholder?: string
  withLabel?: boolean
  className?: string
}

export const AddressInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const asset = useAsset(NATIVE_ASSET_ID)

    let validAddress: string | null = null
    try {
      validAddress = encodeAddress(
        decodeAddress(props.value),
        BASILISK_ADDRESS_PREFIX,
      )
    } catch {}

    return (
      <label id={props.name} className={props.className}>
        <SInputWrapper disabled={props.disabled} error={props.error}>
          <SInput
            ref={ref}
            onChange={(e) => props.onChange?.(e.target.value)}
            value={props.value ?? ""}
            id={props.name}
            type={props.type}
            error={props.error}
            disabled={props.disabled}
            placeholder={props.placeholder}
          />
          {validAddress && validAddress !== props.value && (
            <Text color="primary300" fs={12} lh={16}>
              {asset.data?.symbol.toString()}: {validAddress}
            </Text>
          )}
        </SInputWrapper>
      </label>
    )
  },
)
