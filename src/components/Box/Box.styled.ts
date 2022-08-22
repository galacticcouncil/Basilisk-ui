import { colors, flex, margins, paddings, size } from "common/styles"
import styled from "styled-components"
import { BoxProps } from "./Box"

export const SBox = styled.div<BoxProps>`
  ${flex};
  ${margins};
  ${paddings};
  ${size};
  ${colors};
`
