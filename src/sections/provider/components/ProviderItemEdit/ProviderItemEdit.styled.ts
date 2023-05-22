import styled from "@emotion/styled"
import { ButtonTransparent } from "components/Button/Button"
import { theme } from "theme"

export const SContainer = styled.form`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 30px;
  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.backgroundGray1000};
  }
`

export const SInput = styled.input`
  all: unset;
  color: ${theme.colors.white} !important;
  font-family: "ChakraPetch", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  width: min-content;
  &:focus {
    background-color: rgba(${theme.rgbColors.primary450}, 0.12);
  }
`

export const SButton = styled(ButtonTransparent)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.primary300};
  font-weight: 400;
  font-size: 12px;
  transition: all 0.15s ease-in-out;
  &:hover {
    color: ${theme.colors.primary100};
  }
`
