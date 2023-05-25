import styled from "@emotion/styled"
import { motion } from "framer-motion"
import { theme } from "theme"

export const SButton = styled(motion.div)`
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
