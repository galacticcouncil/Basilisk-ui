import styled from "@emotion/styled"
import { theme } from "theme"

export const SContainer = styled.div<{ isMultiple?: boolean }>`
  display: flex;
  justify-content: flex-end;
  grid-column-gap: 8px;

  ${({ isMultiple }) => {
    if (isMultiple) {
      return {
        marginTop: 12,
        gridColumn: "1 / span 4",
      }
    }

    return { gridColumnStart: "4" }
  }}
`

export const SInnerContainer = styled.div<{ isMultiple?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr 120px;
  border-radius: 12px;
  align-items: center;
  background: rgba(${theme.rgbColors.primary100}, 0.06);

  padding: 8px 12px;
  gap: 8px;

  ${({ isMultiple }) => {
    if (!isMultiple) return { flexGrow: 1 }
    return null
  }}
`
