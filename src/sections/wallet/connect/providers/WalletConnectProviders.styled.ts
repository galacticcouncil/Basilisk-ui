import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { theme } from "theme"

export const SWalletButton = styled.button<{
  variant: string
}>`
  display: flex;
  align-items: center;

  gap: 16px;
  padding: 16px;

  border: none;
  border-radius: 12px;

  transition: background ${theme.transitions.default};
  cursor: pointer;

  ${({ variant }) => {
    if (variant === "polkadot-js") {
      return css`
        background: hsla(33, 100%, 50%, 0.05);

        :hover {
          background: hsla(33, 100%, 50%, 0.1);
        }

        :active {
          background: hsla(33, 100%, 50%, 0.12);
        }
      `
    }

    if (variant === "nova-wallet") {
      return css`
        background: hsla(214, 65%, 64%, 0.05);

        :hover {
          background: hsla(214, 65%, 64%, 0.1);
        }

        :active {
          background: hsla(214, 65%, 64%, 0.12);
        }
      `
    }

    if (variant === "talisman") {
      return css`
        background: hsla(75, 100%, 68%, 0.05);

        :hover {
          background: hsla(75, 100%, 68%, 0.1);
        }

        :active {
          background: hsla(75, 100%, 68%, 0.12);
        }
      `
    }

    if (variant === "subwallet-js") {
      return css`
        background: hsla(222, 100%, 50%, 0.05);

        :hover {
          background: hsla(222, 100%, 50%, 0.1);
        }

        :active {
          background: hsla(222, 100%, 50%, 0.12);
        }
      `
    }

    if (variant === "enkrypt") {
      return css`
        background: hsla(282, 100%, 50%, 0.05);

        :hover {
          background: hsla(282, 100%, 50%, 0.1);
        }

        :active {
          background: hsla(282, 100%, 50%, 0.12);
        }
      `
    }

    if (variant === "external") {
      return css`
        background: hsla(360, 100%, 100%, 0.05);

        :hover {
          background: hsla(360, 100%, 100%, 0.1);
        }

        :active {
          background: hsla(360, 100%, 100%, 0.12);
        }
      `
    }
  }}
`
