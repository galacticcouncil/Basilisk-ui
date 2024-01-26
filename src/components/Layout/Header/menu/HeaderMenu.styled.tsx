import styled from "@emotion/styled"
import { theme } from "theme"

export const SList = styled.nav`
  display: none;

  @media ${theme.viewport.gte.sm} {
    display: flex;
  }
`
export const SItem = styled.span<{ isActive?: boolean; disabled?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 18px;
  margin-right: 32px;

  color: ${({ isActive, disabled }) =>
    isActive
      ? theme.colors.white
      : disabled
      ? theme.colors.neutralGray500
      : theme.colors.neutralGray300};

  &:hover {
    color: ${({ disabled }) =>
      disabled ? theme.colors.neutralGray500 : theme.colors.primary100};
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  }
`
