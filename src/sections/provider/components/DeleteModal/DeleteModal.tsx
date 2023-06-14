import { Text } from "components/Typography/Text/Text"
import { Button } from "components/Button/Button"
import { Spacer } from "components/Spacer/Spacer"
import { useTranslation } from "react-i18next"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { SModalContainer, SModalOverlay } from "./DeleteModal.styled"

type DeleteModalProps = {
  onBack: () => void
  onConfirm: () => void
}

export const DeleteModal = ({ onBack, onConfirm }: DeleteModalProps) => {
  const { t } = useTranslation()
  return (
    <SModalOverlay>
      <SModalContainer>
        <GradientText fs={24} fw={500} tTransform="uppercase">
          {t("rpc.change.modal.removeRpc.title")}
        </GradientText>
        <Text
          color="neutralGray400"
          fw={400}
          sx={{ width: 240 }}
          tAlign="center"
        >
          {t("rpc.change.modal.removeRpc.desc")}
        </Text>
        <Spacer size={36} />
        <div sx={{ flex: "row", gap: 18 }}>
          <Button variant="secondary" sx={{ width: 169 }} onClick={onBack}>
            {t("back")}
          </Button>
          <Button variant="primary" sx={{ width: 212 }} onClick={onConfirm}>
            {t("rpc.change.modal.removeRpc.confirm")}
          </Button>
        </div>
      </SModalContainer>
    </SModalOverlay>
  )
}
