import styled from "@emotion/styled"
import { ButtonTransparent } from "components/Button/Button"
import { theme } from "theme"

export const SAddressBookButton = styled(ButtonTransparent)`
  position: absolute;
  top: 16px;
  right: 16px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 3px 10px;

  color: ${theme.colors.neutralGray400};
  background: rgba(${theme.rgbColors.white}, 0.06);
  border-radius: 9999px;

  &:hover {
    background: rgba(${theme.rgbColors.white}, 0.12);
  }
`
