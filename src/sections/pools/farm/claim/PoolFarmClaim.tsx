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

export function PoolFarmClaim(props: {
  pool: PoolBase
  depositNft?: DepositNftType
}) {
  const { t } = useTranslation()

  const isDesktop = useMedia(theme.viewport.gte.sm)

  const claimable = useClaimableAmount(props.pool, props.depositNft)
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
        <Text
          fw={900}
          sx={{ mb: 4, fontSize: [24, 28] }}
          css={{ wordBreak: "break-all" }}
        >
          <Trans
            t={t}
            i18nKey={
              !claimable.data?.bsx.isNaN()
                ? "pools.allFarms.modal.claim.bsx"
                : "pools.allFarms.modal.claim.bsx.nan"
            }
            tOptions={balance ?? {}}
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
          {t("value.usd", { amount: claimable.data?.usd, fixedPointScale: 12 })}
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
        disabled={!!claimable.data?.bsx.isZero()}
        isLoading={claimAll.mutation.isLoading}
        onClick={() => claimAll.mutation.mutate()}
      >
        {t("pools.allFarms.modal.claim.submit")}
      </Button>
    </SContainer>
  )
}
