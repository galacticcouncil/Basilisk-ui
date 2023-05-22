import styled from "@emotion/styled"
import { theme } from "theme"
import { SItem } from "./components/ProviderItem/ProviderItem.styled"

export const SHeader = styled(SItem)`
  color: ${theme.colors.neutralGray300};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 6px var(--modal-body-padding-x);

  border-top: 1px solid ${theme.colors.backgroundGray800};
  border-bottom: 1px solid ${theme.colors.backgroundGray800};

  cursor: initial;

  &:hover {
    background: none;
  }
`

export const SContainer = styled.div`
  margin: 0 calc(-1 * var(--modal-body-padding-x));
  margin-top: 20px;
`
