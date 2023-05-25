import { useAddressStore } from "components/AddressBook/AddressBook.utils"
import { Button } from "components/Button/Button"
import { Spacer } from "components/Spacer/Spacer"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { SButtons, SContainer } from "./AddressBookItemRemove.styled"

type Props = { address: string; onDone: () => void }

export const AddressBookItemRemove = ({ address, onDone }: Props) => {
  const { t } = useTranslation()
  const { remove } = useAddressStore()

  const onRemove = () => {
    remove(address)
    onDone()
  }

  return (
    <SContainer>
      <GradientText fs={24} lh={32} fw={500}>
        {t("addressbook.remove.title")}
      </GradientText>
      <Spacer size={4} />
      <Text
        color="neutralGray400"
        fs={16}
        lh={22}
        tAlign="center"
        sx={{ maxWidth: 280 }}
      >
        {t("addressbook.remove.subtitle")}
      </Text>
      <Spacer size={40} />
      <SButtons>
        <Button onClick={onDone}>{t("addressbook.remove.cancel")}</Button>
        <Button onClick={onRemove} variant="primary">
          {t("addressbook.remove.submit")}
        </Button>
      </SButtons>
    </SContainer>
  )
}
