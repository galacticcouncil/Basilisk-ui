import styled from "@emotion/styled"
import { theme } from "theme"
import { IconButton } from "components/IconButton/IconButton"

export const SHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${theme.zIndices.header};

  width: 100%;

  padding: 6px 12px;

  backdrop-filter: blur(16px);
  background: rgba(${theme.rgbColors.backgroundGray1000}, 0.2);

  @media ${theme.viewport.gte.sm} {
    padding: 6px 30px;
  }
`

export const SIconButton = styled(IconButton)<{ isLoading: boolean }>`
  color: ${theme.colors.neutralGray300};

  ${({ isLoading }) =>
    isLoading && {
      position: "absolute",
      top: "3px",
      left: "3px",
      backgroundColor: theme.colors.backgroundGray900,
    }};
`

export const STooltip = styled.div`
  background: ${theme.gradients.primaryGradient};
  color: ${theme.colors.black};

  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;

  padding: 5px 9px;

  border-radius: 38px;
`
