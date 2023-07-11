import { Modal } from "../Modal/Modal"
import { ComponentProps } from "react"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Text } from "components/Typography/Text/Text"
import { Heading } from "components/Typography/Heading/Heading"
import { SBanxaBlock, SCryptoBlock, SKrakenBlock, SBlocks, SLinkText } from './FundWalletModal.styled'

type Props = Pick<ComponentProps<typeof Modal>, "open" | "onClose">

export const FundWalletModal = ({ open, onClose }: Props) => {
  return (
    <>
      <Modal
        width={610}
        open={open}
        onClose={onClose}
        withoutCloseOutside={true}
      >
        <GradientText fs={20} fw={600}>
          Fund your wallet
        </GradientText>
        <Text fw={400} lh={24} color="neutralGray400"  css={{ marginBottom: '28px', marginTop: '8px' }}>
          Purchase BSX through very convenient solutions allowing to buy it
          through FIAT or from your exchange account, Find currently available
          solutions below.
        </Text>
        <SBlocks>
          <SBanxaBlock>
            <div>
              Banxa
              <Text fw={400} color="neutralGray400" lh={20}>
                Banxa is the leading global Web3 on-and-off ramp solution.
              </Text>
            </div>
            <SLinkText fw={400} color="primary100">Buy on Banxa</SLinkText>
          </SBanxaBlock>
          <SKrakenBlock>
            <div>
              Kraken
              <Text fw={400} color="neutralGray400" lh={20}>
                One of most popular US based cryptocurrency exchange.
              </Text>
            </div>
            <SLinkText fw={400} color="primary100">Buy on Kraken</SLinkText>
          </SKrakenBlock>
          <Text fw={400} tAlign="center" color="neutralGray400">or</Text>
          <SCryptoBlock>
            <div>
              <Heading as="h2" fs={20}>Fund with crypto</Heading>
              <Text fw={400} color="neutralGray400" lh={20}>
                Looking to fund your wallet with crypto? Head to our cross-chain UI.
              </Text>
            </div>
            <SLinkText fw={400} color="primary100">Use cross-chain</SLinkText>
          </SCryptoBlock>
        </SBlocks>
      </Modal>
    </>
  )
}
