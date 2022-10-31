import styled from "@emotion/styled"
import { theme } from "../../../theme"

export const STable = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid rgba(${theme.rgbColors.white}, 0.12);
  border-radius: 16px;
  padding: 29px;
  box-sizing: border-box;
  justify-content: space-between;
`
