import styled from "@emotion/styled"
import { fadeInKeyframes } from "components/Dropdown/Dropdown.styled"
import { theme } from "theme"

export const SContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: ${theme.zIndices.modal};

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: rgba(28, 26, 31, 0.98);
  color: ${theme.colors.white};
  border-radius: 16px;

  animation: ${fadeInKeyframes} 0.15s ease-in-out;
`

export const SButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;

  width: 100%;
  max-width: 400px;
`
