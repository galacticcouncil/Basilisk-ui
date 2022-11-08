import { u32 } from "@polkadot/types"
import { AccountAvatar } from "components/AccountAvatar/AccountAvatar"
import { AddressInput } from "components/AddressInput/AddressInput"
import { Button } from "components/Button/Button"
import { Modal } from "components/Modal/Modal"
import { PillSwitch } from "components/PillSwitch/PillSwitch"
import { Separator } from "components/Separator/Separator"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { FormValues, Maybe } from "utils/helpers"
import { WalletTransferAssetInput } from "sections/wallet/transfer/assetInput/WalletTransferAssetInput"
import { useAccountStore, useStore } from "state/store"
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"

import { ReactComponent as GuestIcon } from "assets/icons/GuestIcon.svg"
import { NATIVE_ASSET_ID, useApiPromise } from "utils/api"
import BigNumber from "bignumber.js"
import { BN_10 } from "utils/constants"
import { useAssetMeta } from "api/assetMeta"

const WalletTransferAccountSelect = (props: {
  name: string
  value: Maybe<string>
  onChange?: (value: string) => void
}) => {
  let validAddress: string | null = null
  try {
    validAddress = encodeAddress(decodeAddress(props.value))
  } catch {}

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        sx={{ bg: "black", flex: "column", align: "center", p: 8 }}
        css={{ borderRadius: 9999 }}
      >
        {validAddress ? (
          <AccountAvatar address={validAddress} size={42} theme="basilisk" />
        ) : (
          <GuestIcon />
        )}
      </div>

      <AddressInput
        disabled={!props.onChange}
        name={props.name}
        label={props.name}
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  )
}

export function WalletTransferModal(props: {
  open: boolean
  onClose: () => void
  initialAsset: u32 | string
}) {
  const [chain, setChain] = useState<"onchain" | "crosschain">("onchain")
  const [asset, setAsset] = useState(props.initialAsset)

  const api = useApiPromise()
  const { createTransaction } = useStore()
  const { account } = useAccountStore()

  const form = useForm<{
    dest: string
    amount: string
  }>({})

  const assetMeta = useAssetMeta(asset)

  const onSubmit = async (values: FormValues<typeof form>) => {
    if (assetMeta.data?.data?.decimals == null)
      throw new Error("Missing asset meta")

    const amount = new BigNumber(values.amount).multipliedBy(
      BN_10.pow(assetMeta.data?.data?.decimals?.toString()),
    )

    return await createTransaction({
      tx:
        asset === NATIVE_ASSET_ID
          ? api.tx.balances.transferKeepAlive(values.dest, amount.toFixed())
          : api.tx.tokens.transferKeepAlive(
              values.dest,
              asset,
              amount.toFixed(),
            ),
    })
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title="Transfer asset within Basilisk"
      topContent={
        <div sx={{ flex: "column", align: "center", mb: 16 }}>
          <PillSwitch
            options={[
              { value: "onchain" as const, label: "On Basilisk" },
              { value: "crosschain" as const, label: "Cross-chain" },
            ]}
            value={chain}
            onChange={setChain}
          />
        </div>
      }
    >
      <Spacer size={26} />

      <form onSubmit={form.handleSubmit(onSubmit)} sx={{ flex: "column" }}>
        <div sx={{ bg: "backgroundGray1000" }} css={{ borderRadius: 12 }}>
          <div sx={{ flex: "column", gap: 8, p: 20 }}>
            <Text fw={500}>From</Text>

            <WalletTransferAccountSelect
              name="from"
              value={account?.address?.toString()}
            />
          </div>

          <Separator color="backgroundGray900" />

          <div sx={{ flex: "column", gap: 8, p: 20 }}>
            <Text fw={500}>To Basilisk Address</Text>

            <Controller
              name="dest"
              control={form.control}
              render={({ field: { name, onChange, value } }) => {
                return (
                  <WalletTransferAccountSelect
                    name={name}
                    value={value}
                    onChange={onChange}
                  />
                )
              }}
            />
          </div>
        </div>

        <Spacer size={10} />

        <Controller
          name="amount"
          control={form.control}
          render={({ field: { name, value, onChange } }) => (
            <WalletTransferAssetInput
              title="Asset to transfer"
              name={name}
              value={value}
              onChange={onChange}
              asset={asset}
              onAssetChange={setAsset}
            />
          )}
        />

        <Spacer size={20} />

        <div sx={{ flex: "row", justify: "space-between" }}>
          <Button onClick={props.onClose}>Cancel</Button>
          <Button type="submit" variant="primary">
            Review & Send
          </Button>
        </div>
      </form>
    </Modal>
  )
}
