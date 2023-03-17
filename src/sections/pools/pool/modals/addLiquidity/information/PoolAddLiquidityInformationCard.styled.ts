import styled from "@emotion/styled"
import { theme } from "theme"

export const SCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  background: rgba(${theme.rgbColors.primary450}, 0.12);

  padding: 12px 14px;

  border-radius: 8px;
`

export const SLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;

  width: fit-content;

  font-size: 12px;
  line-height: 22px;

  color: ${theme.colors.primary300};

  border-bottom: 1px solid ${theme.colors.primary300};

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`
