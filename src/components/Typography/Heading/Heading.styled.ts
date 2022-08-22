import { colors, fonts, margins } from "common/styles"
import styled from "styled-components"
import { HeadingProps } from "./Heading"

export const SH1 = styled.h1<HeadingProps>`
  ${fonts};
  ${margins};
  ${colors};
`
