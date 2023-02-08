import styled from "@emotion/styled"
import { theme } from "../../theme"
import { css } from "@emotion/react"

export const SAssetRow = styled.div<{ notPair?: boolean }>`
  display: flex;
  cursor: pointer;
  padding: 9px 0px;

  justify-content: space-between;
  width: 100%;

  border-bottom: 1px solid ${theme.colors.backgroundGray800};

  @media ${theme.viewport.gte.sm} {
    margin: 0 -30px;
    padding: 15px 30px;
    box-sizing: content-box;
  }

  ${({ notPair }) =>
    notPair
      ? css`
          cursor: not-allowed;
          opacity: 0.3;
        `
      : css`
          &:hover {
            background: rgba(${theme.rgbColors.primary100}, 0.06);
          }
          &:active {
            background: rgba(${theme.rgbColors.primary100}, 0.07);
          }
        `}
`
