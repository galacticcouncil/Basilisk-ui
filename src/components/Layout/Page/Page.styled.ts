import styled from "@emotion/styled"
import { theme } from "theme"

export const SPage = styled.div`
  --mobile-nav-height: calc(54px + env(safe-area-inset-bottom));
  --nav-height: 65px;

  position: relative;

  display: flex;
  flex-direction: column;

  height: 100vh;
  padding-bottom: var(--mobile-nav-height);

  background: ${theme.gradients.verticalGradient};

  overflow-y: auto;
  overflow-x: hidden;

  @media ${theme.viewport.gte.sm} {
    padding-bottom: 0;
  }
`

export const SPageContent = styled.main`
  padding: 0 12px;

  ::-webkit-scrollbar {
    width: 0px;
  }

  @media ${theme.viewport.gte.sm} {
    padding: 0 20px;

    ::-webkit-scrollbar {
      width: 6px;
    }
  }
`

export const SPageInner = styled.div`
  padding: 16px 0;
  max-width: 1109px;
  margin: 0 auto;

  @media ${theme.viewport.gte.sm} {
    padding: 44px 0;
  }
`
