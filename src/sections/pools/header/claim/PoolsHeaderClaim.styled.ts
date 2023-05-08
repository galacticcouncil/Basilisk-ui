import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { Trigger } from "@radix-ui/react-tooltip"
import { Button } from "components/Button/Button"
import { fadeInKeyframes } from "components/Dropdown/Dropdown.styled"
import { theme } from "theme"

const openStyles = css`
  background: linear-gradient(
      180deg,
      rgba(35, 56, 55, 0.3) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    linear-gradient(0deg, #16171c, #16171c),
    linear-gradient(359.21deg, #111320 -1.12%, #f6297c 77.53%, #fc3f8c 94.14%),
    #111320;
  color: ${theme.colors.primary400};

  svg {
    transform: rotate(180deg);
  }

  &::after {
    display: none;
  }
`

export const STrigger = styled(Trigger)<{ open: boolean }>`
  all: unset;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  position: relative;
  overflow: hidden;

  width: 100%;
  padding: 16px 0;

  background: ${theme.gradients.primaryGradient};
  border-radius: 9999px;

  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: ${theme.colors.backgroundGray800};
  text-transform: uppercase;

  cursor: pointer;

  :hover {
    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(${theme.rgbColors.white}, 0.2);
    }
  }
  :active {
    &::after {
      background: rgba(${theme.rgbColors.black}, 0.2);
    }
  }

  svg {
    margin: -4px;
    transition: all 0.15s ease-in-out;
  }

  ${({ open }) => open && openStyles}

  @media ${theme.viewport.gte.sm} {
    width: auto;
    padding: 16px 32px;
  }
`

export const SButton = styled(Button)<{ isOpen?: boolean }>`
  width: 100%;
  padding: 14px 0;
  font-weight: 700;

  svg {
    margin: -4px;
    transition: all 0.15s ease-in-out;
  }

  ${({ isOpen }) => isOpen && openStyles}

  @media ${theme.viewport.gte.sm} {
    padding: 14px 76px;
  }
`

export const SContent = styled.div`
  margin-top: 8px;
  padding: 20px 32px;

  background: linear-gradient(
      180deg,
      rgba(35, 56, 55, 0.3) 0%,
      rgba(0, 0, 0, 0) 100%
    ),
    linear-gradient(0deg, #16171c, #16171c),
    linear-gradient(359.21deg, #111320 -1.12%, #f6297c 77.53%, #fc3f8c 94.14%),
    #111320;
  box-shadow: 0px 55px 49px -6px rgba(1, 2, 5, 0.65);
  border-radius: 20px;

  transform-origin: top center;
  animation: 0.15s ease-in-out ${fadeInKeyframes};
  z-index: ${theme.zIndices.toast};

  @media ${theme.viewport.gte.sm} {
    margin-top: 0;
    padding: 32px;
  }
`
