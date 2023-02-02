import styled from "@emotion/styled"
import { theme } from "theme"

export const SContainer = styled.div<{ isMultiple?: boolean }>`
  display: flex;
  justify-content: space-between;
  grid-column-gap: 8px;

  ${({ isMultiple }) => {
    if (isMultiple) {
      return {
        marginTop: 12,
        gridColumn: "1 / span 4",
        justifySelf: "end",
      }
    }

    return { gridColumnStart: "4" }
  }}
`

export const SInnerContainer = styled.div<{ isMultiple?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  border-radius: 12px;

  background: rgba(${theme.rgbColors.primary100}, 0.06);

  padding: 8px 12px;

  ${({ isMultiple }) => {
    if (!isMultiple) return { flexGrow: 1 }
    return null
  }}
`
