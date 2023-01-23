import { Text } from "components/Typography/Text/Text"
import { SContainer } from "sections/pools/pool/footer/PoolFooter.styled"
import { Trans, useTranslation } from "react-i18next"
import { usePoolFooterValues } from "sections/pools/pool/footer/PoolFooter.utils"
import { PoolBase } from "@galacticcouncil/sdk"
import { Button } from "components/Button/Button"
import { ReactComponent as FlagIcon } from "assets/icons/FlagIcon.svg"
import { useClaimableAmount } from "utils/farms/claiming"
import { separateBalance } from "utils/balance"

type Props = { pool: PoolBase }

export const PoolFooter = ({ pool }: Props) => {
  const { t } = useTranslation()

  const claimable = useClaimableAmount(pool)

  const balance = separateBalance(claimable.data?.bsx, {
    fixedPointScale: 12,
    numberPrefix: "≈",
    type: "token",
  })

  const toast = {
    onLoading: (
      <Trans
        t={t}
        i18nKey="pools.allFarms.claim.toast.onLoading"
        tOptions={balance ?? {}}
      >
        <span />
        <span className="highlight" />
      </Trans>
    ),
    onSuccess: (
      <Trans
        t={t}
        i18nKey="pools.allFarms.claim.toast.onSuccess"
        tOptions={balance ?? {}}
      >
        <span />
        <span className="highlight" />
      </Trans>
    ),
    onError: (
      <Trans
        t={t}
        i18nKey="pools.allFarms.claim.toast.onLoading"
        tOptions={balance ?? {}}
      >
        <span />
        <span className="highlight" />
      </Trans>
    ),
  }

  const { locked, claimAll } = usePoolFooterValues(pool, toast)

  if (!locked || locked.isZero()) return null

  return (
    <SContainer>
      <div>
        <Text color="primary100" fs={16} fw={600} lh={22}>
          {t("pools.pool.claim.total", { locked })}
        </Text>
      </div>
      <div sx={{ flex: "row", justify: "center" }}>
        {!claimable.data?.usd.isZero() && (
          <Text color="primary300" fs={16} fw={600} lh={22} tAlign="center">
            {t("pools.pool.claim.claimable", {
              claimable: claimable.data?.usd,
              fixedPointScale: 12,
            })}
          </Text>
        )}
      </div>
      <div sx={{ flex: "row", justify: "end" }}>
        {!claimable.data?.bsx.isZero() && (
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
