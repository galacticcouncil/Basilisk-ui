import { Modal } from "../Modal/Modal"
import { ComponentProps } from "react"
import { GradientText } from "components/Typography/GradientText/GradientText"

type Props = Pick<ComponentProps<typeof Modal>, "open" | "onClose">

export const FundWalletModal = ({ open, onClose }: Props) => {
  return (
    <>
      <Modal
        width={460}
        open={open}
        onClose={onClose}
        withoutCloseOutside={true}
      >
        <GradientText fs={20} fw={600} lh={20}>
          Fund your wallet
        </GradientText>
        <p>
          Purchase BSX through very convenient solutions allowing to buy it
          through FIAT or from your exchange account, Find currently available
          solutions below.
        </p>
        <div>
          <div>
            <div>
              Banxa is the leading global Web3 on-and-off ramp solution.
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
