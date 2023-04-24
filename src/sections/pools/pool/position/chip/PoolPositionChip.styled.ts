import styled from "@emotion/styled"
import { theme } from "theme"

export const SChip = styled.div`
  display: inline-block;

  padding: 3px 6px;
  margin: 16px 0 0 16px;

  font-weight: 800;
  font-size: 9px;
  line-height: 14px;
  text-transform: uppercase;

  border-radius: 4px;
  background: ${theme.gradients.primaryGradient};
`
