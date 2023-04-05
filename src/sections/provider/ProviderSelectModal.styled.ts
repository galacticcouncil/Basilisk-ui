import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { theme } from "theme"

export const SCircleDot = styled.span`
  display: block;

  border-radius: 9999px;

  background: ${theme.colors.primary500};

  width: 100%;
  height: 100%;
`

export const SCircle = styled.div`
  width: 16px;
  height: 16px;

  border-radius: 9999px;
  border: 1px solid ${theme.colors.backgroundGray700};

  background: ${theme.colors.backgroundGray1000};

  transition: all ${theme.transitions.default};

  padding: 3px;
`
export const SItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "name url" "status url";
  gap: 24px;
  row-gap: 8px;

  padding: 21px var(--modal-body-padding-x);

  cursor: pointer;

  border-bottom: 1px solid ${theme.colors.backgroundGray800};

  &:hover {
    background: rgba(${theme.rgbColors.primary100}, 0.06);
  }

  @media ${theme.viewport.gte.sm} {
    grid-template-columns: 2fr 1fr 3fr;
    grid-template-areas: "name status url";
  }
`
export const SHeader = styled(SItem)`
  color: ${theme.colors.neutralGray300};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 6px var(--modal-body-padding-x);

  border-top: 1px solid ${theme.colors.backgroundGray800};
  border-bottom: 1px solid ${theme.colors.backgroundGray800};

  cursor: initial;

  &:hover {
    background: none;
  }
`

export const SContainer = styled.div`
  margin: 0 calc(-1 * var(--modal-body-padding-x));
  margin-top: 20px;
`

export const SButton = styled(motion.button)`
  all: unset;

  position: relative;
  display: flex;
  align-items: center;

  margin-left: auto;
  margin-bottom: 16px;

  padding: 4px 10px;

  border-radius: 8px;

  background: rgba(${theme.rgbColors.backgroundGray1000}, 0.3);
  backdrop-filter: blur(20px);

  cursor: pointer;

  @media ${theme.viewport.gte.sm} {
    position: fixed;
    bottom: 16px;
    right: 16px;

    margin: 0;
  }
`

export const SName = styled(motion.div)`
  display: flex;
  align-items: center;

  width: 0;
  overflow: hidden;

  color: ${theme.colors.white};
`
