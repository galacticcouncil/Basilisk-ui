import { css } from "styled-components/macro"
import { Text } from "components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { Separator } from "components/Separator/Separator"
import { ProviderType } from "./WalletConnectModal.utils"
import { Box } from "components/Box/Box"
import { encodeAddress, decodeAddress } from "@polkadot/util-crypto"
import Identicon from "@polkadot/react-identicon"
import { web3Accounts } from "@polkadot/extension-dapp"
import { useQuery } from "@tanstack/react-query"
import { BASILISK_ADDRESS_PREFIX } from "utils/network"
import { useBalances } from "api/balances"

function WalletAccountAddress(props: { name: string; address: string }) {
  return (
    <Box flex align="center" gap={10}>
      <Box
        flex
        align="center"
        justify="align"
        bg="backgroundGray1000"
        p={5}
        css={css`
          border-radius: 9999px;
        `}
      >
        <Identicon size={32} value={props.address} />
      </Box>

      <Box
        flex
        column
        gap={3}
        css={css`
          overflow: hidden;
        `}
      >
        <Text fw={600} fs={12}>
          {props.name}
        </Text>
        <Text
          fw={600}
          fs={14}
          color="neutralGray300"
          css={css`
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `}
        >
          {props.address}
        </Text>
      </Box>
    </Box>
  )
}

function WalletAccountItem(props: { address: string; name: string }) {
  const basiliskAddress = encodeAddress(
    decodeAddress(props.address),
    BASILISK_ADDRESS_PREFIX,
  )
  const kuramaAddress = props.address
  const native = useBalances(kuramaAddress)

  const { t } = useTranslation()

  return (
    <Box
      flex
      column
      p={16}
      gap={20}
      bg="backgroundGray800"
      css={css`
        border-radius: 12px;
      `}
    >
      <Box flex align="center" justify="space-between">
        <Text>{props.name}</Text>
        <Text>{t("value.bsx", { amount: native })}</Text>
      </Box>

      <Box flex column gap={12}>
        <WalletAccountAddress name="Basilisk" address={basiliskAddress} />
        <Separator />
        <WalletAccountAddress name="Kurama" address={kuramaAddress} />
      </Box>
    </Box>
  )
}

export function WalletAccountSelectSection(props: { provider: ProviderType }) {
  const accounts = useQuery(["web3Accounts", props.provider], () => {
    return web3Accounts({ extensions: [props.provider] })
  })

  return (
    <>
      <Text fw={400} mt={6} color="neutralGray200">
        Pick one of your account to connect to Basilisk
      </Text>

      <Box
        flex
        column
        gap={10}
        mt={10}
        css={css`
          overflow-x: hidden;
          overflow-y: auto;
          max-height: 450px;
        `}
      >
        {accounts.data?.map((account) => (
          <WalletAccountItem
            key={account.address}
            name={account.meta.name ?? account.address}
            address={account.address}
          />
        ))}
      </Box>
    </>
  )
}
