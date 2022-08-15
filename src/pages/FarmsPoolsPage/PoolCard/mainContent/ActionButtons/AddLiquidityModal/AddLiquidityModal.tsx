import { Button } from "components/Button/Button"
import { Modal } from "components/Modal/Modal"
import { Row } from "components/Row/Row"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { Conversion } from "./Conversion/Conversion"
import { SelectAsset } from "./SelectAsset/SelectAsset"

type AddLiquidityModalProps = {
  isOpen: boolean
  close: () => void
}

export const AddLiquidityModal: FC<AddLiquidityModalProps> = ({
  isOpen,
  close,
}) => {
  const { t } = useTranslation()
  return (
    <Modal open={isOpen} title={t("addLiquidityModal.title")} close={close}>
      <SelectAsset balance={123456789.124} usd={2456} mt={16} />
      <Conversion
        firstValue={{ amount: 1, currency: "BSX" }}
        secondValue={{ amount: 123455, currency: "KAR" }}
      />
      <SelectAsset balance={123456789} usd={2456} />

      <Row left={t("addLiquidityModal.row.apr")} right="5%" />
      <Separator />
      <Row
        left={t("addLiquidityModal.row.transactionCost")}
        right={
          <>
            <Text mr={4}>≈ 12 BSX</Text>
            <Text color="primary400">(2%)</Text>
          </>
        }
      />
      <Separator />
      <Row left={t("addLiquidityModal.row.sharePool")} right="5%" />
      <Separator />
      <Row
        left={t("addLiquidityModal.row.shareTokens")}
        right={<Text color="primary400">3000</Text>}
      />
      <Button
        text={t("addLiquidityModal.confirmButton")}
        variant="primary"
        fullWidth
        mt={30}
      />
    </Modal>
  )
}
