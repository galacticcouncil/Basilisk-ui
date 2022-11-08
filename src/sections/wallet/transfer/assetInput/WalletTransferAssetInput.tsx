import { u32 } from "@polkadot/types"
import { useAsset } from "api/asset"
import { useTokenBalance } from "api/balances"
import { AssetSelect } from "components/AssetSelect/AssetSelect"
import { useAccountStore } from "state/store"

export const WalletTransferAssetInput = (props: {
  name: string

  value: string
  onChange: (value: string) => void

  asset: u32 | string
  onAssetChange: (asset: u32 | string) => void

  title?: string
  className?: string
}) => {
  const { account } = useAccountStore()

  const asset = useAsset(props.asset)

  const balance = useTokenBalance(props.asset, account?.address)

  console.log("assetInput", props.asset, asset.data)

  return (
    <>
      <AssetSelect
        name={props.name}
        title={props.title}
        className={props.className}
        value={props.value}
        onChange={props.onChange}
        asset={props.asset}
        assetIcon={asset.data?.icon}
        decimals={asset.data?.decimals?.toNumber()}
        balance={balance.data?.balance}
        assetName={asset.data?.name?.toString()}
        onSelectAssetClick={() => console.log("Asset Select")}
      />
    </>
  )
}
