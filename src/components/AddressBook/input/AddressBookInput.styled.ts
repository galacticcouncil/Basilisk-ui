import styled from "@emotion/styled"
import { ReactComponent as IconSearch } from "assets/icons/IconSearch.svg"
import { Button } from "components/Button/Button"
import { theme } from "theme"

export const SContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 14px;
  align-items: center;

  padding: 8px;
  margin: 16px -10px;

  background-color: ${theme.colors.backgroundGray800};
  border: 1px solid ${theme.colors.backgroundGray600};
  border-radius: 8px;
`

export const SIcon = styled(IconSearch)`
  color: ${theme.colors.backgroundGray500};
  margin-left: 6px;
`

export const SInput = styled.input`
  all: unset;

  color: ${theme.colors.white} !important;
  font-size: 14px;
  font-weight: 500;
`

export const SButton = styled(Button)`
  padding: 8px 16px;
  font-size: 12px;
  line-height: 18px;
`
