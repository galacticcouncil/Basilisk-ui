import styled from "@emotion/styled"
import { theme } from "theme"

export const SContainer = styled.div`
  width: 100%;
  background: ${theme.gradients.cardGradient};
  overflow: hidden;
  border-radius: 20px;
`

export const SGridContainer = styled.div`
  display: grid;
  grid-column-gap: 0px;
  grid-row-gap: 18px;

  grid-template-areas: "details" "incentives" "values" "actions";

  padding: 16px;

  @media ${theme.viewport.gte.sm} {
    grid-template-areas:
      "details actions"
      "incentives actions"
      "values actions";

    grid-template-columns: 1fr auto;
    grid-column-gap: 48px;
    grid-row-gap: 16px;

    padding: 24px;
  }

  @media ${theme.viewport.gte.md} {
    grid-template-areas:
      "details incentives actions"
      "values incentives actions";

    grid-template-columns: 1fr 256px min-content;
    grid-template-rows: repeat(2, 1fr);
    grid-row-gap: 0px;
  }
`
