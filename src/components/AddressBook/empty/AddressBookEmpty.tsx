// import { ReactComponent as IconAddressBook } from "assets/icons/IconAddressBook.svg"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"

type Props = { canAdd: boolean }

export const AddressBookEmpty = ({ canAdd }: Props) => {
  const { t } = useTranslation()

  return (
    <div sx={{ flex: "column", align: "center" }}>
      <Spacer size={56} />
      {/* <IconAddressBook /> */}
      <div>icon</div>
      <Spacer size={16} />
      <Text lh={22}>{t("addressbook.list.empty.notFound")}</Text>
      {canAdd && <Text lh={22}>{t("addressbook.list.empty.canAdd")}</Text>}
    </div>
  )
}
