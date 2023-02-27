import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { SCardContainer, SLink } from "./PoolAddLiquidityInformationCard.styled"
import { ReactComponent as LinkIcon } from "assets/icons/LinkIcon.svg"
import { ReactComponent as InfoIcon } from "assets/icons/LPInfoIcon.svg"
import { Icon } from "components/Icon/Icon"

export const PoolAddLiquidityInformationCard = () => {
  const { t } = useTranslation()

  return (
    <SCardContainer>
      <Icon size={24} icon={<InfoIcon />} />
      <div>
        <Text fs={12}>{t("pools.addLiquidity.modal.information.text")}</Text>
        <SLink
          href="https://docs.bsx.fi/howto_snek_swap_provide_liquidity/"
          target="_blank"
        >
          {t("pools.addLiquidity.modal.information.linkText")}
          <Icon size={9} icon={<LinkIcon />} />
        </SLink>
      </div>
    </SCardContainer>
  )
}
