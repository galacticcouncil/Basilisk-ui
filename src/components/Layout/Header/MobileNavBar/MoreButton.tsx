import { Icon } from "components/Icon/Icon"
import { useState } from "react"
import { ReactComponent as MoreTabIcon } from "assets/icons/MoreTabIcon.svg"
import { STabButton, SFundButtonWrapper } from "./MobileNavBar.styled"
import { TabMenuModal } from "./TabMenuModal/TabMenuModal"
import { useTranslation } from "react-i18next"
import { FundWalletMobileButton } from 'components/FundWallet/FundWalletMobileButton'
import { FundWalletModal } from '../../../FundWallet/FundWalletModal'

type MoreButtonProps = {
  tabs: React.ReactNode[]
}

export const MoreButton = ({ tabs }: MoreButtonProps) => {
  const { t } = useTranslation()
  const [openModal, setOpenModal] = useState(false)
  const [isFundModalOpen, setIsFundModalOpen] = useState(false)

  return (
    <>
      <STabButton active={openModal} onClick={() => setOpenModal(true)}>
        <Icon size={20} icon={<MoreTabIcon />} />
        {t("header.more")}
      </STabButton>
      <TabMenuModal open={openModal} onClose={() => setOpenModal(false)}>
        <SFundButtonWrapper>
          <FundWalletMobileButton onClick={() => setIsFundModalOpen(true) }/>
          <FundWalletModal open={isFundModalOpen} onClose={() => setIsFundModalOpen(false)} />
        </SFundButtonWrapper>
        <div sx={{ flex: "column" }}>{tabs}</div>
      </TabMenuModal>
    </>
  )
}
