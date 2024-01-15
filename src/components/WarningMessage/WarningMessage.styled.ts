import styled from "@emotion/styled"
import { theme } from "theme"

export const SWarningMessageContainer = styled.div`
  background: ${theme.gradients.primaryGradient};

  width: 100%;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 8px;

  z-index: ${theme.zIndices.header};

  color: ${theme.colors.black};
`

export const SWarningMessageContent = styled.div`
  display: flex;
  flex-direction: row;

  gap: 8px;
  align-items: center;
  justify-content: center;
`

export const SSecondaryItem = styled.div`
  display: flex;
  flex: 1 1 0%;
  flexbasis: 0;
`
