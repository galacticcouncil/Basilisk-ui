import styled from "styled-components"
import { theme } from "../../theme"

export const SSelectOption = styled.div`
  display: flex;
  align-items: center;
  text-transform: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    background: rgba(${theme.rgbColors.white}, 0.15);
  }
`
