import { Modal } from "../Modal/Modal"
import { ComponentProps } from "react"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Text } from "components/Typography/Text/Text"
import {
  SBanxaBlock,
  SCryptoBlock,
  SKrakenBlock,
  SBlocks,
} from "./FundWalletModal.styled"
import { ReactComponent as KrakenLogo } from "assets/icons/KrakenLogo.svg"
import BanxaLogo from "assets/icons/BanxaLogo.png"
import { CryptoBlockTitle } from "./components/CryptoBlockTitle"
import { BlockContent } from "./components/BlockContent"
import { useTranslation } from "react-i18next"
import { LINKS } from "utils/navigation"
import { useMedia } from "react-use"
import { theme } from "theme"

type Props = Pick<ComponentProps<typeof Modal>, "open" | "onClose">

export const FundWalletModal = ({ open, onClose }: Props) => {
  const { t } = useTranslation()
  const isDesktop = useMedia(theme.viewport.gte.sm)

  return (
    <>
      <Modal
        width={610}
        open={open}
        onClose={onClose}
        withoutCloseOutside={true}
      >
        <GradientText fs={20} fw={600}>
          {t("fund.modal.title")}
        </GradientText>
        <Text
          fw={400}
          lh={24}
          color="neutralGray400"
          css={{ marginBottom: "28px", marginTop: "8px" }}
        >
          {t("fund.modal.description")}
        </Text>
        <SBlocks>
          <SBanxaBlock>
            <BlockContent
              title={<img alt="Banxa" width={100} src={BanxaLogo} />}
              description={t("fund.modal.banxa.description")}
              linkText={t("fund.modal.banxa.buy")}
              link="https://banxa.com/"
              onLinkClick={onClose}
            />
          </SBanxaBlock>
          <SKrakenBlock>
            <BlockContent
              title={<KrakenLogo />}
              description={t("fund.modal.kraken.description")}
              linkText={t("fund.modal.kraken.buy")}
              link="https://kraken.com/"
              onLinkClick={onClose}
            />
          </SKrakenBlock>
          <Text fw={400} tAlign="center" color="neutralGray400">
            or
          </Text>
          <SCryptoBlock>
            <BlockContent
              title={<CryptoBlockTitle />}
              description={t("fund.modal.crypto.description")}
              linkText={t(isDesktop ? "fund.modal.crypto.buy" : "go")}
              link={LINKS.cross_chain}
              onLinkClick={onClose}
            />
          </SCryptoBlock>
        </SBlocks>
      </Modal>
    </>
  )
}
