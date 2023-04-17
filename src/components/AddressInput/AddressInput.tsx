import { useAsset } from "api/asset"
import { forwardRef, InputHTMLAttributes } from "react"
import { useTranslation } from "react-i18next"
import { BASILISK_ADDRESS_PREFIX, NATIVE_ASSET_ID } from "utils/api"
import { safeConvertAddressSS58 } from "utils/formatting"
import { Maybe } from "utils/helpers"
import {
  SErrorMessage,
  SInput,
  SInputWrapper,
  SLabel,
  SNativeAddress,
} from "./AddressInput.styled"

type InputProps = {
  onChange?: (value: string) => void
  onBlur?: () => void
  value: Maybe<string>
  disabled?: boolean
  type?: InputHTMLAttributes<HTMLInputElement>["type"]
  name: string
  label?: string
  error?: string
  placeholder?: string
  withLabel?: boolean
  className?: string
}

export const AddressInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const asset = useAsset(NATIVE_ASSET_ID)
    const { t } = useTranslation()

    const nativeAddress = safeConvertAddressSS58(
      props.value,
      BASILISK_ADDRESS_PREFIX,
    )

    return (
      <SLabel id={props.name} className={props.className}>
        <SInputWrapper disabled={props.disabled} error={props.error}>
          <SInput
            ref={ref}
            onChange={(e) => props.onChange?.(e.target.value)}
            onBlur={props.onBlur}
            value={props.value ?? ""}
            id={props.name}
            type={props.type}
            error={props.error}
            disabled={props.disabled}
            placeholder={props.placeholder}
          />
          {nativeAddress && nativeAddress !== props.value && (
            <SNativeAddress color="primary300" fs={12} lh={16}>
              {t("address.input.native", {
                symbol: asset.data?.symbol,
                address: nativeAddress,
              })}
            </SNativeAddress>
          )}
        </SInputWrapper>

        {props.error && <SErrorMessage>{props.error}</SErrorMessage>}
      </SLabel>
    )
  },
)
