import styled, { css } from "styled-components/macro"
import { ReactComponent as PolkadotLogo } from "assets/icons/PolkadotLogo.svg"
import { ReactComponent as TalismanLogo } from "assets/icons/TalismanLogo.svg"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { ReactComponent as DownloadIcon } from "assets/icons/DownloadIcon.svg"
import { ReactNode } from "react"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"

const StyledWalletButton = styled.button<{ variant: "polkadot" | "talisman" }>`
  display: flex;
  align-items: center;

  gap: 16px;
  padding: 16px;

  border: none;
  border-radius: 12px;

  transition: background 0.2s ease-in-out;
  cursor: pointer;

  ${({ variant }) => {
    if (variant === "polkadot") {
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
  }}
`
function WalletButton(props: {
  variant: "polkadot" | "talisman"
  status?: ReactNode
}) {
  let logo: ReactNode = null
  let title: ReactNode = null

  if (props.variant === "polkadot") {
    logo = <PolkadotLogo />
    title = "Polkadot"
  } else if (props.variant === "talisman") {
    logo = <TalismanLogo />
    title = "Talisman"
  }

  return (
    <StyledWalletButton variant={props.variant}>
      {logo}
      <Text fs={18} css={{ flexGrow: 1 }}>
        {title}
      </Text>
      {props.status && (
        <Text
          color="neutralGray300"
          fs={14}
          tAlign="right"
          css={css`
            display: flex;
            align-items: center;
            gap: 4px;
          `}
        >
          {props.status}
        </Text>
      )}
    </StyledWalletButton>
  )
}

export function WalletButtonList() {
  const { t } = useTranslation("translation")
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 8px;

        margin-top: 8px;
      `}
    >
      <WalletButton
        variant="polkadot"
        status={
          <>
            {t("walletConnectModal.continue")}
            <ChevronRight />
          </>
        }
      />
      <WalletButton
        variant="talisman"
        status={
          <>
            {t("walletConnectModal.download")}
            <DownloadIcon />
          </>
        }
      />
    </div>
  )
}
