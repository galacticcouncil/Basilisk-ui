import styled from "styled-components/macro"
import { Color, MarginProps, margins } from "common/styles"
import { theme } from "theme"

export const StyledDivider = styled.div<
  { height?: number; color?: Color } & MarginProps
>`
  width: 100%;
  height: ${({ height }) => height ?? 2}px;

  background-color: ${({ color }) => color ?? theme.colors.backgroundGray800};

  ${margins};
`
