import { Text } from "components/Typography/Text/Text"
import { Trans, useTranslation } from "react-i18next"
import { useAPR } from "utils/farms/apr"
import { useMemo } from "react"
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

export const MyPositionsHeader = ({ pool }: { pool: PoolBase }) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  const shareToken = usePoolShareToken(pool.address)
  const balance = useTokenBalance(shareToken.data?.token, account?.address)

  const APRs = useAPR(pool.address)

  const { dollarValue, assetA, assetB } = useCurrentSharesValue({
    shareToken: shareToken.data?.token,
    pool,
    shareTokenBalance: balance.data?.balance,
  })

  const claimAll = useClaimAllMutation(pool.address)
  const claimable = useClaimableAmount(pool)

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
              ? t("pools.pool.liquidity.apr.value", {
                  min: sortedAPR[0].apr,
                  max: sortedAPR[sortedAPR.length - 1].apr,
                })
              : t("value.APR", { apr: sortedAPR[0].apr })}
          </Text>
        )}
      </div>
      <SClaimAllCard>
        <Text color="primarySuccess200">
          {t("pools.allFarms.modal.claim.title")}
        </Text>
        {claimable.data ? (
          <>
            <Text
              fw={900}
              sx={{ mt: 4, fontSize: 24 }}
              css={{ wordBreak: "break-all" }}
            >
              <Trans
                t={t}
                i18nKey={"pools.allFarms.modal.claim.bsx"}
                tOptions={{
                  ...separateBalance(claimable.data?.bsx, {
                    fixedPointScale: 12,
                    type: "token",
                  }),
                }}
              >
                <span
                  css={css`
                    color: rgba(${theme.rgbColors.white}, 0.4);
                    font-size: 18px;
                  `}
                />
              </Trans>
            </Text>
            <Text
              css={css`
                color: rgba(255, 255, 255, 0.4);
                word-break: break-all;
              `}
            >
              {t("value.usd", {
                amount: claimable.data?.usd,
                fixedPointScale: 12,
                type: "dollar",
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
          disabled={claimable?.data?.bsx.isZero()}
        >
          <FlagIcon />
          {t("pools.pool.claim.button")}
        </Button>
      </SClaimAllCard>
    </>
  )
}
