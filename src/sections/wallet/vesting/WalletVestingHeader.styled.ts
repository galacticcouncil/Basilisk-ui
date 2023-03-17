import styled from "@emotion/styled"
import { theme } from "../../../theme"

export const STable = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;

  border: 1px solid rgba(${theme.rgbColors.white}, 0.12);
  border-radius: 16px;

  padding: 29px;
  margin-top: 12px;

  width: 100%;
`

export const SSeparator = styled.div`
  height: auto;
  width: 1px;
  background: rgba(${theme.rgbColors.white}, 0.12);
`
