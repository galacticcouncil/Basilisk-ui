import styled from "@emotion/styled"
import { theme } from "theme"

export const SContainer = styled.div<{ isHighlighted?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr 120px;
  grid-column-gap: 8px;
  align-items: center;

  padding: 10px 12px;

  border-radius: 12px;
  ${({ isHighlighted }) =>
    isHighlighted &&
    `background-color: rgba(${theme.rgbColors.primary100}, 0.12);`}
`

export const SAssetContainer = styled.div`
  position: relative;
  display: flex;

  > div:not(:first-of-type) {
    margin-left: -12px;
  }
`

export const SAssetIcon = styled.div`
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${theme.colors.backgroundGray900};
`
