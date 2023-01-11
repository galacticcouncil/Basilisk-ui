import { Button } from "components/Button/Button"
import styled from "@emotion/styled"
import { theme } from "theme"

export const SSelectAssetButton = styled(Button)`
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 10px;
  text-transform: none;

  padding: 5px;
  margin-right: 18px;

  :hover {
    background: rgba(${theme.rgbColors.white}, 0.15);
  }
`
