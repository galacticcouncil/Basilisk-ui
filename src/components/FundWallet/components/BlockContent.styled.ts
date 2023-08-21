import styled from "@emotion/styled"
import { Text } from "components/Typography/Text/Text"
import { theme } from "theme"

export const SBlockDescription = styled(Text)`
  grid-column: span 2;

  @media ${theme.viewport.gte.sm} {
    grid-column: initial;
  }
`
export const SBlockContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  row-gap: 10px;
`
export const SLinkText = styled(Text)`
  white-space: nowrap;
`

export const SBlockLink = styled.div`
  justify-self: end;

  @media ${theme.viewport.gte.sm} {
    align-self: center;
    grid-row: span 2;
  }
`

export const SLinkContent = styled.div`
  display: flex;
  color: ${theme.colors.white};
  align-items: center;
  column-gap: 3px;
`
