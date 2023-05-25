import { u32 } from "@polkadot/types"
import { Modal } from "components/Modal/Modal"
import { PillSwitch } from "components/PillSwitch/PillSwitch"
import { useState } from "react"

import { useTranslation } from "react-i18next"

import { AccountId32 } from "@polkadot/types/interfaces"
import { AddressBook } from "components/AddressBook/AddressBook"
import { useForm } from "react-hook-form"
import { WalletTransferSectionCrosschain } from "sections/wallet/transfer/crosschain/WalletTransferSectionCrosschain"
import { WalletTransferSectionOnchain } from "sections/wallet/transfer/onchain/WalletTransferSectionOnchain"
import { SPillContainer } from "./WalletTransferModal.styled"
import { WalletTransferSectionLiquidityPositions } from "./liquidityPositions/WalletTransferSectionLiquidityPositions"

type Props = {
  open: boolean
  onClose: () => void
  value:
    | { type: "liquidityPositions"; poolAddress: string | AccountId32 }
    | { type: "asset"; asset: string | u32 }
}

export const WalletTransferModal = (props: Props) => {
  const { t } = useTranslation()
  const [chain, setChain] = useState<"onchain" | "crosschain">("onchain")
  const [addressBook, setAddressBook] = useState(false)

  const form = useForm<{ dest: string; amount: string }>({})

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      topContent={
        <SPillContainer>
          <PillSwitch
            options={[
              {
                value: "onchain" as const,
                label: t("wallet.assets.transfer.switch.onchain"),
              },
              {
                value: "crosschain" as const,
                label: t("wallet.assets.transfer.switch.crosschain"),
              },
            ]}
            value={chain}
            onChange={setChain}
          />
        </SPillContainer>
      }
    >
      {addressBook ? (
        <AddressBook
          onSelect={(address) => {
            form.setValue("dest", address)
            setAddressBook(false)
          }}
        />
      ) : (
        <>
          {chain === "onchain" && (
            <>
              {props.value.type === "asset" && (
                <WalletTransferSectionOnchain
                  initialAsset={props.value.asset}
                  onClose={props.onClose}
                  form={form}
                  openAddressBook={() => setAddressBook(true)}
                />
              )}

              {props.value.type === "liquidityPositions" && (
                <WalletTransferSectionLiquidityPositions
                  poolAddress={props.value.poolAddress}
                  onClose={props.onClose}
                />
              )}
            </>
          )}

          {chain === "crosschain" && (
            <WalletTransferSectionCrosschain onClose={props.onClose} />
          )}
        </>
      )}
    </Modal>
  )
}
