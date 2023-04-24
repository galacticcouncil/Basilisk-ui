import { Text } from "components/Typography/Text/Text"
import { Trans, useTranslation } from "react-i18next"
import { useAPR, getMinAndMaxAPR } from "utils/farms/apr"
import { Fragment, useMemo } from "react"
import { usePoolShareToken } from "api/pools"
import { useTokenBalance } from "api/balances"
import { useAccountStore } from "state/store"
import { useCurrentSharesValue } from "../../shares/value/PoolSharesValue.utils"
import { PoolBase } from "@galacticcouncil/sdk"
import { Separator } from "components/Separator/Separator"
import { useClaimAllMutation, useClaimableAmount } from "utils/farms/claiming"
import { SClaimAllCard } from "./MyPositions.styled"
import { theme } from "theme"
import { css } from "@emotion/react"
import { separateBalance } from "utils/balance"
import { Button } from "components/Button/Button"
import { ReactComponent as FlagIcon } from "assets/icons/FlagIcon.svg"
import Skeleton from "react-loading-skeleton"
import { useAssetMeta, useAssetMetaList } from "api/assetMeta"
import { NATIVE_ASSET_ID } from "utils/api"

export const MyPositionsHeader = ({
  pool,
  arePositions,
}: {
  pool: PoolBase
  arePositions: boolean
}) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  const { data: meta } = useAssetMeta(NATIVE_ASSET_ID)

  const shareToken = usePoolShareToken(pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

  const APRs = useAPR(pool.address)

  const { dollarValue, assetA, assetB } = useCurrentSharesValue({
    shareToken: shareToken.data?.token,
    pool,
    shareTokenBalance: balance.data?.balance,
  })

  const claimable = useClaimableAmount(pool)

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

  const claimAll = useClaimAllMutation(pool.address, undefined, toast)

  const sortedAPR = useMemo(() => {
    if (!APRs.data) return undefined

    return APRs.data.sort((a, b) => a.apr.minus(b.apr).toNumber())
  }, [APRs.data])

  return (
    <>
      <div sx={{ flex: "row", justify: "space-between" }}>
        <Text fs={12} lh={16} fw={400} color="neutralGray500">
          {t("pools.pool.liquidity.unstakedShares")}
        </Text>
        <Text fs={14} lh={18} color="white">
          {t("value", {
            value: balance.data?.balance,
            fixedPointScale: 12,
            type: "token",
          })}
        </Text>
      </div>
      <Separator
        sx={{ my: 12 }}
        css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
      />
      <div sx={{ flex: "row", justify: "space-between" }}>
        <Text fs={12} lh={16} fw={400} color="neutralGray500">
          {t("pools.pool.liquidity.value")}
        </Text>
        <div sx={{ flex: "column", gap: 2, align: "end" }}>
          <Text fs={14} lh={18} color="white">
            {t("pools.pool.liquidity.amounts", {
              amountA: assetA?.amount,
              symbolA: assetA?.symbol,
              amountB: assetB?.amount,
              symbolB: assetB?.symbol,
            })}
          </Text>
          <Text fs={12} lh={16} color="neutralGray500">
            {t("value.usd", { amount: dollarValue })}
          </Text>
        </div>
      </div>
      <Separator
        sx={{ my: 12 }}
        css={{ background: `rgba(${theme.rgbColors.white}, 0.06)` }}
      />
      <div sx={{ flex: "row", justify: "space-between" }}>
        <Text fs={12} lh={16} fw={400} color="neutralGray500">
          {t("pools.pool.liquidity.apr.title")}
        </Text>
        {!!sortedAPR?.length && (
          <Text fs={14} lh={18} color="white">
            {sortedAPR.length > 1
              ? t("value.multiAPR.short", getMinAndMaxAPR(sortedAPR))
              : t("value.APR.range", {
                  from: sortedAPR[0].minApr,
                  to: sortedAPR[0].apr,
                })}
          </Text>
        )}
      </div>
      {arePositions && (
        <SClaimAllCard>
          <Text color="primary200">
            {t("pools.allFarms.modal.claim.title")}
          </Text>
          {claimable.data ? (
            <>
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
                  color: rgba(255, 255, 255, 0.4);
                  word-break: break-all;
                `}
              >
                {t("pools.allFarms.modal.claim.usd", {
                  amount: claimable.data?.usd,
                  fixedPointScale: meta?.decimals.toNumber() ?? 12,
                })}
              </Text>
            </>
          ) : (
            <>
              <Skeleton width={150} height={28} />
              <Skeleton width={100} height={18} />
            </>
          )}

          <Button
            variant="gradient"
            size="small"
            sx={{ p: "12px 21px", mt: 22 }}
            isLoading={claimAll.isLoading}
            onClick={() => claimAll.mutation.mutate()}
            disabled={
              !claimableAssets.length ||
              claimable?.data?.usd.isZero() ||
              account?.isExternalWalletConnected
            }
          >
            <FlagIcon />
            {t("pools.pool.claim.button")}
          </Button>
        </SClaimAllCard>
      )}
    </>
  )
}
