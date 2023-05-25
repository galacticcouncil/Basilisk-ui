import styled from "@emotion/styled"
import { theme } from "theme"

export const SCircleDot = styled.span`
  display: block;

  border-radius: 9999px;

  background: ${theme.colors.primary500};

  width: 100%;
  height: 100%;
`

export const SCircle = styled.div`
  width: 16px;
  height: 16px;

  border-radius: 9999px;
  border: 1px solid ${theme.colors.backgroundGray700};

  background: ${theme.colors.backgroundGray1000};

  transition: all ${theme.transitions.default};

  padding: 3px;
`
export const SItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "name url" "status url";
  gap: 24px;
  row-gap: 8px;

  padding: 21px var(--modal-body-padding-x);

  cursor: pointer;

  border-bottom: 1px solid ${theme.colors.backgroundGray800};

  &:hover {
    background: rgba(${theme.rgbColors.primary100}, 0.06);
  }

  @media ${theme.viewport.gte.sm} {
    grid-template-columns: 2fr 1fr 3fr;
    grid-template-areas: "name status url";
  }
`
