import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useAssetMetaList } from "api/assetMeta"
import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { Separator } from "components/Separator/Separator"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useAccountStore } from "state/store"
import { useClaimAllMutation, useClaimableAmount } from "utils/farms/claiming"
import { SButton, SContent, STrigger } from "./PoolsHeaderClaim.styled"

export const PoolsHeaderClaim = () => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  const claimable = useClaimableAmount()
  const assetsMeta = useAssetMetaList(Object.keys(claimable.data?.assets || {}))

  const { claimableAssets } = useMemo(() => {
    const claimableAssets = []

    if (assetsMeta.data) {
      for (let key in claimable.data?.assets) {
        const asset = assetsMeta.data?.find((meta) => meta.id === key)

        claimableAssets.push({
          value: claimable.data?.assets[key],
          symbol: asset?.symbol,
          decimals: asset?.decimals ?? 12,
        })
      }
    }

    return { claimableAssets }
  }, [assetsMeta.data, claimable.data?.assets])

  // TODO: add toast
  const claimAll = useClaimAllMutation(undefined, undefined, undefined)

  return (
    <div sx={{ m: "auto 0" }}>
      <DropdownMenu.Root>
        <STrigger>
          {t("pools.header.claim.check")}
          <ChevronDown css={{ margin: -4 }} />
        </STrigger>

        <DropdownMenu.Portal>
          <SContent sideOffset={8} align="end">
            <Text fs={14} lh={26} color="neutralGray400">
              {t("pools.header.claim.claimable")}
            </Text>

            <Spacer size={18} />

            <div>
              {claimableAssets.map((claimableAsset, index) => (
                <div key={claimableAsset.symbol}>
                  <Text fs={18} lh={26}>
                    {t("value", {
                      value: claimableAsset.value,
                      fixedPointScale: claimableAsset.decimals,
                      numberSuffix: ` ${claimableAsset.symbol}`,
                      type: "token",
                    })}
                  </Text>
                  {index < claimableAssets.length - 1 && (
                    <Separator sx={{ my: 12 }} />
                  )}
                </div>
              ))}
            </div>

            <Spacer size={12} />

            <Text fs={12} lh={14} color="primary200">
              {t("pools.header.claim.total", {
                total: claimable.data?.usd,
                type: "dollar",
                fixedPointScale: 12,
              })}
            </Text>

            <Spacer size={26} />

            <SButton
              variant="gradient"
              disabled={
                !claimable.data ||
                claimable.data.usd.isZero() ||
                account?.isExternalWalletConnected ||
                claimAll.isLoading
              }
              onClick={() => claimAll.mutation.mutate()}
            >
              {t("pools.header.claim.button")}
            </SButton>
          </SContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  )
}
