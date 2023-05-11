import { ReactComponent as IconBack } from "assets/icons/ChevronRight.svg"
import { Modal } from "components/Modal/Modal"
import React, { ComponentProps, useState } from "react"
import { useTranslation } from "react-i18next"
import { WalletUpgradeModal } from "sections/wallet/upgrade/WalletUpgradeModal"
import { Transaction } from "state/store"
import { useSendTransactionMutation } from "./ReviewTransaction.utils"
import { ReviewTransactionError } from "./ReviewTransactionError"
import { ReviewTransactionForm } from "./ReviewTransactionForm"
import { ReviewTransactionPending } from "./ReviewTransactionPending"
import { ReviewTransactionSuccess } from "./ReviewTransactionSuccess"
import { ReviewTransactionToast } from "./ReviewTransactionToast"

export const ReviewTransaction: React.FC<Transaction> = (props) => {
  const { t } = useTranslation()
  const [minimizeModal, setMinimizeModal] = useState(false)

  const sendTx = useSendTransactionMutation()

  const modalProps: Partial<ComponentProps<typeof Modal>> =
    sendTx.isLoading || sendTx.isSuccess || sendTx.isError
      ? {
          width: 460,
          title: undefined,
          variant: sendTx.isError ? "error" : "default",
          withoutClose: sendTx.isLoading,
        }
      : {
          title: t("pools.reviewTransaction.modal.title"),
        }

  const handleTxOnClose = () => {
    if (sendTx.isLoading) {
      setMinimizeModal(true)
      return
    }

    if (sendTx.isSuccess) {
      props.onSuccess?.(sendTx.data)
    } else {
      props.onError?.()
    }
  }

  const onClose = () => {
    handleTxOnClose()
    props.onClose?.()
  }

  const onBack = props.onBack
    ? () => {
        handleTxOnClose()
        props.onBack?.()
      }
    : undefined

  const onReview = () => {
    sendTx.reset()
    setMinimizeModal(false)
  }

  return (
    <>
      {minimizeModal && (
        <ReviewTransactionToast
          id={props.id}
          mutation={sendTx}
          link={sendTx.data?.transactionLink}
          onReview={onReview}
          onClose={onClose}
          toastMessage={props.toastMessage}
        />
      )}
      <Modal
        open={!minimizeModal}
        onClose={onClose}
        secondaryIcon={
          onBack
            ? {
                icon: <IconBack css={{ transform: "rotate(180deg)" }} />,
                onClick: onBack,
                name: "Back",
              }
            : undefined
        }
        {...modalProps}
      >
        <WalletUpgradeModal />
        {sendTx.isLoading ? (
          <ReviewTransactionPending
            txState={sendTx.txState}
            onClose={onClose}
          />
        ) : sendTx.isSuccess ? (
          <ReviewTransactionSuccess onClose={onClose} />
        ) : sendTx.isError ? (
          <ReviewTransactionError onClose={onClose} onReview={onReview} />
        ) : (
          <ReviewTransactionForm
            tx={props.tx}
            hash={props.hash}
            title={props.title}
            onCancel={onClose}
            onSigned={(signed) => sendTx.mutateAsync(signed)}
            overrides={props.overrides}
            isProxy={props.isProxy}
          />
        )}
      </Modal>
    </>
  )
}
