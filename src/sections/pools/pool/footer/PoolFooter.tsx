import { PoolBase } from "@galacticcouncil/sdk"
import { useAssetMetaList } from "api/assetMeta"
import { ReactComponent as FlagIcon } from "assets/icons/FlagIcon.svg"
import { Button } from "components/Button/Button"
import { Text } from "components/Typography/Text/Text"
import { Fragment, useMemo } from "react"
import { Trans, useTranslation } from "react-i18next"
import { separateBalance } from "utils/balance"
import { useClaimableAmount, useClaimAllMutation } from "utils/farms/claiming"
import { SContainer } from "./PoolFooter.styled"
import { usePoolFooterValues } from "./PoolFooter.utils"
import { useAccountStore } from "state/store"

type Props = { pool: PoolBase }

export const PoolFooter = ({ pool }: Props) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  const claimable = useClaimableAmount(pool)
  const assetsMeta = useAssetMetaList(Object.keys(claimable.data?.assets || {}))
  const { locked, available } = usePoolFooterValues(pool)

  const toastValue = useMemo(() => {
    if (!assetsMeta.data || !claimable.data) return undefined

    let claimableAssets = []

    for (let key in claimable.data?.assets) {
      const index = Object.keys(claimable.data?.assets).indexOf(key)
      const { decimals, symbol } =
        assetsMeta.data?.find((meta) => meta.id === key) || {}

      const balance = separateBalance(claimable.data?.assets[key], {
        fixedPointScale: decimals?.toString() || 12,
        type: "token",
      })

      claimableAssets.push(
        <Fragment key={index}>
          {index > 0 && <span> {t("and")} </span>}
          <Trans
            t={t}
            i18nKey="pools.allFarms.claim.toast.asset"
            tOptions={{ ...balance, symbol }}
          >
            <span />
            <span className="highlight" />
          </Trans>
        </Fragment>,
      )
    }

    return claimableAssets
  }, [assetsMeta.data, claimable.data, t])

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

  if (!locked || locked.isZero()) return null

  return (
    <SContainer>
      <div>
        <Text color="primary100" fs={16} fw={600} lh={22}>
          {t("pools.pool.claim.totals", { locked, available })}
        </Text>
      </div>
      <div sx={{ flex: "row", justify: "center" }}>
        {claimable.data?.usd && !claimable.data?.usd.isZero() && (
          <Text color="primary300" fs={16} fw={600} lh={22} tAlign="center">
            {t("pools.pool.claim.claimable", {
              claimable: claimable.data?.usd,
              fixedPointScale: 12,
            })}
          </Text>
        )}
      </div>
      <div sx={{ flex: "row", justify: "end" }}>
        {claimable.data?.usd && !claimable.data?.usd.isZero() && (
          <Button
            variant="gradient"
            size="small"
            sx={{ p: "12px 21px" }}
            isLoading={claimAll.mutation.isLoading}
            onClick={async () => claimAll.mutation.mutateAsync()}
            disabled={account?.isExternalWalletConnected}
          >
            <FlagIcon />
            {t("pools.pool.claim.button")}
          </Button>
        )}
      </div>
    </SContainer>
  )
}
