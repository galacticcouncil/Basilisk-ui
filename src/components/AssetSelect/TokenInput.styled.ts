import { Button } from "components/Button/Button"
import styled from "@emotion/styled"
import { theme } from "theme"
import { css } from "@emotion/react"

export const SContainer = styled.div`
  border-radius: 12px;
  background: rgba(${theme.rgbColors.primary100}, 0.06);
  padding: 14px;

  grid-row-gap: 5px;
  display: grid;

  grid-template-areas: "title title" "input input" "balance balance";

  @media ${theme.viewport.gte.sm} {
    padding: 20px;
    grid-row-gap: 11px;

    grid-template-areas: "title balance" "input input";
  }
`

export const SMaxButton = styled(Button)`
  background: rgba(${theme.rgbColors.white}, 0.06);
  color: ${theme.colors.white};
  font-weight: 600;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
    `}

  :hover {
    background: rgba(${theme.rgbColors.white}, 0.15);
  }
`
