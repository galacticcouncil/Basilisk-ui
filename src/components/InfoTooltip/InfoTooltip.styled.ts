import styled from "@emotion/styled"
import * as Tooltip from "@radix-ui/react-tooltip"
import { ReactComponent as InfoIcon } from "assets/icons/InfoIcon.svg"
import { theme } from "theme"

export const STrigger = styled(Tooltip.Trigger)`
  all: unset;
`

export const SInfoIcon = styled(InfoIcon)`
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;
  flex-shrink: 0;

  color: ${theme.colors.neutralGray300};
  background: rgba(${theme.rgbColors.white}, 0.06);
  border: 1px solid ${theme.colors.backgroundGray600};

  transition: all ${theme.transitions.default};

  border-radius: 9999px;

  cursor: pointer;

  [data-state*="open"] > & {
    color: ${theme.colors.primary400};
    background: rgba(${theme.rgbColors.primary450}, 0.38);
    border-color: rgba(${theme.rgbColors.primary400}, 0.41);
  }
`
