import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"
import { useAssetMeta } from "api/assetMeta"
import { useTokenBalance } from "api/balances"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { WalletConnectAccountSelectAddress } from "sections/wallet/connect/accountSelect/item/address/WalletConnectAccountSelectAddress"
import { BASILISK_ADDRESS_PREFIX, NATIVE_ASSET_ID } from "utils/api"
import {
  SContainer,
  SSelectItem,
} from "./WalletConnectAccountSelectItem.styled"

type Props = {
  isActive: boolean
  address: string
  name: string
  provider: string
  setAccount?: () => void
  isProxy?: boolean
}

export const WalletConnectAccountSelectItem: FC<Props> = ({
  isActive,
  address,
  name,
  provider,
  setAccount,
  isProxy,
}) => {
  const isBasiliskAddress = address[0] === "b"
  const basiliskAddress = isBasiliskAddress
    ? address
    : encodeAddress(decodeAddress(address), BASILISK_ADDRESS_PREFIX)
  const kusamaAddress = isBasiliskAddress
    ? encodeAddress(decodeAddress(address))
    : address
  const { data } = useTokenBalance(NATIVE_ASSET_ID, kusamaAddress)
  const { data: meta } = useAssetMeta(NATIVE_ASSET_ID)

  const { t } = useTranslation()

  return (
    <SContainer isActive={isActive}>
      <SSelectItem isActive={isActive} isProxy={!!isProxy} onClick={setAccount}>
        <div sx={{ flex: "row", align: "center", justify: "space-between" }}>
          <Text>{name}</Text>
          <Text>
            {t("value.bsx", {
              value: data?.balance,
              fixedPointScale: meta?.decimals.toString(),
              type: "token",
            })}
          </Text>
        </div>

        <div sx={{ flex: "column", mt: 12, gap: 12 }}>
          <WalletConnectAccountSelectAddress
            name={t("walletConnect.accountSelect.asset.network")}
            address={basiliskAddress}
            theme="substrate"
          />
          <Separator
            color={isActive ? "primary200" : "backgroundGray700"}
            opacity={isActive ? 0.1 : 1}
          />
          <WalletConnectAccountSelectAddress
            name={t("walletConnect.accountSelect.asset.parachain")}
            address={kusamaAddress}
            theme={provider}
          />
        </div>
      </SSelectItem>
    </SContainer>
  )
}
