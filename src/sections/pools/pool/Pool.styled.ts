import styled from "@emotion/styled"
import { theme } from "theme"

export const SContainer = styled.div`
  width: 100%;
  background: ${theme.gradients.cardGradient};
  overflow: hidden;
  border-radius: 20px;
`

export const SGridContainer = styled.div`
  padding: 16px;
  display: grid;
  grid-column-gap: 0px;
  grid-row-gap: 18px;

  grid-template-areas: "details" "incentives" "values" "actions";

  @media ${theme.viewport.gte.sm} and ${theme.viewport.lt.md} {
    padding: 24px;
    display: grid;

    grid-template-areas:
      "details actions"
      "incentives actions"
      "values actions";

    grid-template-columns: 1fr auto;

    grid-column-gap: 48px;
    grid-row-gap: 16px;
  }

  @media ${theme.viewport.gte.md} {
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr 256px min-content;
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 48px;
    grid-row-gap: 0px;

    grid-template-areas:
      "details incentives actions"
      "values incentives actions";
  }
`
