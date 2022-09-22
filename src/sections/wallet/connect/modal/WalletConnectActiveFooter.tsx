import { Box } from "components/Box/Box"
import { css } from "styled-components"
import { theme } from "theme"
import { Text } from "components/Typography/Text/Text"
import { ButtonTransparent } from "components/Button/Button"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { ReactComponent as LogoutIcon } from "assets/icons/LogoutIcon.svg"
import { getProviderMeta, ProviderType } from "./WalletConnectModal.utils"
import { Account } from "state/store"
import { useTranslation } from "react-i18next"

export function WalletConnectActiveFooter(props: {
  account: Account | undefined
  provider: ProviderType
  onSwitch: () => void
  onLogout: () => void
}) {
  const { name, logo } = getProviderMeta(props.provider, { size: 30 })
  const { t } = useTranslation()

  return (
    <Box
      flex
      css={css`
        align-items: center;
        justify-content: space-between;

        background: ${theme.colors.backgroundGray1000};

        margin: 0px -30px -30px;
        width: calc(100% + 30px * 2);

        border-radius: 16px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;

        padding: 20px 30px;
      `}
    >
      {props.account ? (
        <ButtonTransparent onClick={props.onLogout}>
          <Box
            flex
            css={css`
              gap: 2px;
              align-items: center;
              justify-content: center;
              color: ${theme.colors.neutralGray500};
            `}
          >
            <LogoutIcon />
            <Text css={{ color: "currentColor" }} fs={14} fw={500}>
              {t("walletConnect.logout")}
            </Text>
          </Box>
        </ButtonTransparent>
      ) : (
        <span />
      )}

      <ButtonTransparent
        css={css`
          padding: 12px;
          border-radius: 12px;
          border: 1px solid ${theme.colors.backgroundGray800};
        `}
        onClick={props.onSwitch}
      >
        <Box flex css={{ gap: 22, alignItems: "center" }}>
          <Box flex css={{ gap: 4, alignItems: "center" }}>
            {logo}
            <Text fs={14} fw={600} css={{ color: theme.colors.neutralGray100 }}>
              {name}
            </Text>
          </Box>
          <Text
            fs={14}
            fw={500}
            css={css`
              color: ${theme.colors.primary450};
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <span>{t("walletConnect.switch")}</span>
            <ChevronRight css={{ marginLeft: -3 }} />
          </Text>
        </Box>
      </ButtonTransparent>
    </Box>
  )
}
