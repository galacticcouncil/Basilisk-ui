import { Text } from "components/Typography/Text/Text"
import { SContainer } from "sections/pools/pool/footer/PoolFooter.styled"
import { Trans, useTranslation } from "react-i18next"
import { usePoolFooterValues } from "sections/pools/pool/footer/PoolFooter.utils"
import { PoolBase } from "@galacticcouncil/sdk"
import { Button } from "components/Button/Button"
import { ReactComponent as FlagIcon } from "assets/icons/FlagIcon.svg"
import { useClaimableAmount } from "utils/farms/claiming"
import { separateBalance } from "utils/balance"
import { useAssetMetaList } from "api/assetMeta"
import { Fragment, useMemo } from "react"

type Props = { pool: PoolBase }

export const PoolFooter = ({ pool }: Props) => {
  const { t } = useTranslation()

  const claimable = useClaimableAmount(pool)

  const assetsMeta = useAssetMetaList(Object.keys(claimable.data?.assets || {}))

  const toastValue = useMemo(() => {
    if (!assetsMeta.data || !claimable.data) return undefined

    let claimableAssets = []

    for (let key in claimable.data?.assets) {
      const index = Object.keys(claimable.data?.assets).indexOf(key)
      const { decimals, symbol } =
        assetsMeta.data?.find((meta) => meta.id === key) || {}

      const balance = separateBalance(claimable.data?.assets[key], {
        fixedPointScale: decimals || 12,
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

  const { locked, available, claimAll } = usePoolFooterValues(pool, toast)

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
            isLoading={claimAll.isLoading}
            onClick={() => claimAll.mutate()}
          >
            <FlagIcon />
            {t("pools.pool.claim.button")}
          </Button>
        )}
      </div>
    </SContainer>
  )
}
