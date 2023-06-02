import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"
import { ReactComponent as IconEdit } from "assets/icons/IconEdit.svg"
import { ReactComponent as IconRemove } from "assets/icons/IconRemove.svg"
import { AccountAvatar } from "components/AccountAvatar/AccountAvatar"
import { useState } from "react"
import { BASILISK_ADDRESS_PREFIX } from "utils/api"
import { isBsxAddress } from "utils/formatting"
import {
  SAddress,
  SAddressContainer,
  SButton,
  SItem,
  SName,
  SNameContainer,
} from "./AddressBookItem.styled"
import { AddressBookItemEdit } from "./edit/AddressBookItemEdit"
import { AddressBookItemRemove } from "./remove/AddressBookItemRemove"

type Props = {
  address: string
  name: string
  provider: string
  onSelect: (address: string) => void
}

export const AddressBookItem = ({
  address,
  name,
  provider,
  onSelect,
}: Props) => {
  const [editting, setEditting] = useState(false)
  const [removing, setRemoving] = useState(false)

  const bsxAddress = isBsxAddress(address)
    ? address
    : encodeAddress(decodeAddress(address), BASILISK_ADDRESS_PREFIX)

  if (editting)
    return (
      <AddressBookItemEdit
        address={address}
        name={name}
        provider={provider}
        onEdit={() => setEditting(false)}
      />
    )

  return (
    <>
      <SItem onClick={() => onSelect(bsxAddress)}>
        <SNameContainer>
          <AccountAvatar address={bsxAddress} size={30} />
          <SName>{name}</SName>
        </SNameContainer>
        <SAddressContainer>
          <SAddress>{bsxAddress}</SAddress>
          {provider === "external" && (
            <div sx={{ flex: "row" }}>
              <SButton
                onClick={(e) => {
                  e.stopPropagation()
                  setEditting(true)
                }}
              >
                <IconEdit />
              </SButton>
              <SButton
                onClick={(e) => {
                  e.stopPropagation()
                  setRemoving(true)
                }}
              >
                <IconRemove />
              </SButton>
            </div>
          )}
        </SAddressContainer>
      </SItem>
      {removing && (
        <AddressBookItemRemove
          address={address}
          onDone={() => setRemoving(false)}
        />
      )}
    </>
  )
}
