import styled from "@emotion/styled"
import { theme } from "theme"

export const SValue = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex: 1;
  gap: 8px;

  @media ${theme.viewport.gte.sm} {
    flex-direction: column;
  }
`
