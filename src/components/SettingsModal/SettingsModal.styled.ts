import styled from "@emotion/styled"
import { theme } from "theme"

export const SLimitSwitch = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;
  align-items: center;

  padding: 8px;
  margin: 16px 0;

  background-color: rgba(${theme.rgbColors.black}, 0.25);
  border-radius: 12px;
`
