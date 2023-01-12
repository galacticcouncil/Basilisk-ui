import { Text } from "components/Typography/Text/Text"
import styled from "@emotion/styled"
import { theme } from "theme"
import { ButtonTransparent } from "components/Button/Button"

export const SContainer = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin: 0px -30px -30px;
  width: calc(100% + 30px * 2);

  border-radius: 16px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;

  padding: 10px 30px;

  @media ${theme.viewport.gte.sm} {
    padding: 20px 30px;
    background: ${theme.colors.backgroundGray1000};
  }
`

export const SLogoutContainer = styled.div`
  display: flex;

  gap: 2px;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutralGray500};
  transition: color ${theme.transitions.default};

  &:hover {
    color: ${theme.colors.neutralGray400};
  }
`

export const SSwitchButton = styled(ButtonTransparent)`
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.backgroundGray800};
  transition: ${theme.transitions.default};

  &:hover {
    background-color: ${theme.colors.backgroundGray800};
    border: 1px solid ${theme.colors.backgroundGray700};
  }
`

export const SSwitchText = styled(Text)`
  color: ${theme.colors.primary450};
  display: flex;
  align-items: center;
  justify-content: center;
`
