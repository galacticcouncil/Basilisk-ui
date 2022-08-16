import styled, { css } from "styled-components/macro"
import { ReactNode } from "react"
import { ColorProps, colors } from "common/styles"
import { ReactComponent as LinkIcon } from "assets/icons/LinkIcon.svg"

const ExternalLinkAdornment = () => (
  <span
    css={css`
      position: relative;
    `}
  >
    <LinkIcon
      css={css`
        position: absolute;
        bottom: 2px;
        right: 0;
      `}
    />
    &nbsp; &nbsp;
  </span>
)

const StyledExternalLink = styled.a`
  text-decoration: underline;
  text-underline-offset: 3px;
  ${colors}
`

export function ExternalLink(
  props: { href: string; children?: ReactNode } & ColorProps,
) {
  return (
    <StyledExternalLink href={props.href} color={props.color} bg={props.bg}>
      {props.children} <ExternalLinkAdornment />
    </StyledExternalLink>
  )
}
