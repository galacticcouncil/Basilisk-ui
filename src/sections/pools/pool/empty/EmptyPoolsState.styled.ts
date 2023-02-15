import styled from "@emotion/styled"
import { theme } from "theme"

export const SEmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background: ${theme.gradients.bgDark};

  border-radius: 20px;

  padding: 130px 0;
`
