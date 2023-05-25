import styled from "@emotion/styled"
import { theme } from "theme"

export const SContainer = styled.div`
  min-height: 400px;
`

export const SItems = styled.div`
  margin: 0 -30px -30px;
`

export const SHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-column-gap: 8px;
  align-items: center;

  padding: 6px 20px;
  border-top: 1px solid ${theme.colors.backgroundGray800};
  border-bottom: 1px solid ${theme.colors.backgroundGray800};
`
