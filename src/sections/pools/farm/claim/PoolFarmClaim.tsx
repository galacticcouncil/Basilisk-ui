import { Trans, useTranslation } from "react-i18next"
import { Text } from "components/Typography/Text/Text"
import { Button } from "components/Button/Button"
import { css } from "@emotion/react"
import { theme } from "theme"
import { SContainer } from "./PoolFarmClaim.styled"
import { PoolBase } from "@galacticcouncil/sdk"
import { useClaimableAmount, useClaimAllMutation } from "utils/farms/claiming"
import { separateBalance } from "utils/balance"
import { DepositNftType } from "api/deposits"
import { useMedia } from "react-use"
import { useAssetMetaList } from "api/assetMeta"
import { Fragment, useMemo } from "react"
import { Separator } from "components/Separator/Separator"
import { useAccountStore } from "state/store"

export function PoolFarmClaim(props: {
  pool: PoolBase
  depositNft?: DepositNftType
}) {
  const { t } = useTranslation()
  const { account } = useAccountStore()
  const isDesktop = useMedia(theme.viewport.gte.sm)

  const claimable = useClaimableAmount(props.pool, props.depositNft)
  const assetsMeta = useAssetMetaList(Object.keys(claimable.data?.assets || {}))

  const { claimableAssets, toastValue } = useMemo(() => {
    if (!assetsMeta.data) return { claimableAssets: [], toastValue: undefined }

    let claimableAssets = []

    for (let key in claimable.data?.assets) {
      const { decimals, symbol } =
        assetsMeta.data?.find((meta) => meta.id === key) || {}

      const balance = separateBalance(claimable.data?.assets[key], {
        fixedPointScale: decimals?.toString() || 12,
        type: "token",
      })

      claimableAssets.push({ ...balance, symbol })
    }

    const toastValue = claimableAssets.map((asset, index) => {
      return (
        <Fragment key={index}>
          {index > 0 && <span> {t("and")} </span>}
          <Trans
            t={t}
            i18nKey="pools.allFarms.claim.toast.asset"
            tOptions={asset}
          >
            <span />
            <span className="highlight" />
          </Trans>
        </Fragment>
      )
    })

    return { claimableAssets, toastValue }
  }, [assetsMeta.data, claimable.data?.assets, t])

  const toast = {
    onLoading: (
      <>
        <Trans i18nKey={"pools.allFarms.claim.toast.onLoading"}>
          <span />
        </Trans>
        {toastValue}
      </>
    ),
    onSuccess: (
      <>
        <Trans i18nKey={"pools.allFarms.claim.toast.onSuccess"}>
          <span />
        </Trans>
        {toastValue}
      </>
    ),
    onError: (
      <>
        <Trans i18nKey={"pools.allFarms.claim.toast.onLoading"}>
          <span />
        </Trans>
        {toastValue}
      </>
    ),
  }

  const claimAll = useClaimAllMutation(
    props.pool.address,
    props.depositNft,
    toast,
  )

  return (
    <SContainer>
      <div css={{ flexShrink: 1 }}>
        <Text color="primary200" fs={16} sx={{ mb: 6 }}>
          {t("pools.allFarms.modal.claim.title")}
        </Text>
        {claimableAssets.map((claimableAsset) => (
          <Fragment key={claimableAsset.symbol}>
            <Text
              fw={900}
              sx={{ mb: 4, fontSize: [24, 28] }}
              css={{ wordBreak: "break-all" }}
            >
              <Trans
                t={t}
                i18nKey={"pools.allFarms.modal.claim.asset"}
                tOptions={claimableAsset ?? {}}
              >
                <span
                  css={css`
                    color: rgba(${theme.rgbColors.white}, 0.4);
                    font-size: 18px;
                  `}
                />
              </Trans>
            </Text>
            <Separator />
          </Fragment>
        ))}
        <Text
          css={css`
            margin-top: 6px;
            color: rgba(255, 255, 255, 0.4);
            word-break: break-all;
          `}
        >
          {t("pools.allFarms.modal.claim.usd", {
            amount: claimable.data?.usd,
            fixedPointScale: 12,
          })}
        </Text>
      </div>

      <Button
        variant={isDesktop ? "primary" : "gradient"}
        sx={{
          ml: [0, 32],
          flexShrink: 0,
          p: ["10px 16px", "16px 36px"],
          width: ["100%", "max-content"],
        }}
        disabled={
          !claimableAssets.length ||
          !!claimable.data?.usd.isZero() ||
          account?.isExternalWalletConnected
        }
        isLoading={claimAll.mutation.isLoading}
        onClick={() => claimAll.mutation.mutate()}
      >
        {t("pools.allFarms.modal.claim.submit")}
      </Button>
    </SContainer>
  )
}
