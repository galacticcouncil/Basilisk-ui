import { Separator } from "@radix-ui/react-separator"
import { useAssetMetaList } from "api/assetMeta"
import { Spacer } from "components/Spacer/Spacer"
import { Text } from "components/Typography/Text/Text"
import { useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import { ToastMessage, useAccountStore } from "state/store"
import { TOAST_MESSAGES } from "state/toasts"
import { useClaimAllMutation, useClaimableAmount } from "utils/farms/claiming"
import { SButton } from "../PoolsHeaderClaim.styled"

type Props = { onClaim: () => void }

export const PoolsHeaderClaimContent = ({ onClaim }: Props) => {
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

  const toast = TOAST_MESSAGES.reduce((memo, type) => {
    const msType = type === "onError" ? "onLoading" : type
    memo[type] = (
      <>
        <Trans i18nKey={`pools.allFarms.claim.toast.${msType}`}>
          <span />
        </Trans>
        {t("value", {
          value: claimable.data?.usd,
          type: "token",
          numberPrefix: "$",
          fixedPointScale: 12,
        })}
      </>
    )
    return memo
  }, {} as ToastMessage)

  const claimAll = useClaimAllMutation(undefined, undefined, toast)

  return (
    <>
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
                fixedPointScale: claimableAsset.decimals?.toString(),
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
        onClick={() => {
          claimAll.mutation.mutate()
          onClaim()
        }}
      >
        {t("pools.header.claim.button")}
      </SButton>
    </>
  )
}
