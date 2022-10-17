import { Trans, useTranslation } from "react-i18next"
import { useAPR } from "utils/apr"
import { useMemo, useState } from "react"
import { Text } from "components/Typography/Text/Text"
import { Button } from "components/Button/Button"
import { css } from "@emotion/react"
import { theme } from "theme"
import { useApiPromise } from "utils/network"
import { useMutation } from "@tanstack/react-query"
import { useStore } from "state/store"
import { SContainer } from "./PoolJoinFarmClaim.styled"
import { getFormatSeparators } from "utils/formatting"
import { PoolBase } from "@galacticcouncil/sdk"
import { Modal } from "components/Modal/Modal"
import { ReactComponent as WalletIcon } from "assets/icons/Wallet.svg"
import { PoolPositionMobile } from "../../position/PoolPositionMobile"
import { useClaimableAmount } from "utils/totals"
import { useUserDeposits } from "utils/deposits"

export function PoolJoinFarmClaim(props: { pool: PoolBase }) {
  const { t, i18n } = useTranslation()
  const [openMyPositions, setOpenMyPositions] = useState(false)

  const positions = useUserDeposits(props.pool.address)
  const claimable = useClaimableAmount(props.pool)

  let index = 0
  const separators = getFormatSeparators(i18n.languages[0])
  const [num, denom] = t("value", {
    value: claimable.data?.bsx,
    fixedPointScale: 12,
    numberPrefix: "≈",
    decimalPlaces: 4,
  }).split(separators.decimal ?? ".")

  const api = useApiPromise()
  const { createTransaction } = useStore()

  const claimMutation = useMutation(async () => {
    const txs =
      positions.data
        ?.map((i) =>
          i.deposit.yieldFarmEntries.map((entry) => {
            return api.tx.liquidityMining.claimRewards(i.id, entry.yieldFarmId)
          }),
        )
        .flat(2) ?? []

    if (txs.length) {
      return await createTransaction({
        tx: api.tx.utility.batch(txs),
      })
    }
  })

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
            i18nKey="pools.allFarms.modal.claim.bsx"
            tOptions={{ num, denom }}
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
          {t("value.usd", { amount: claimable.data?.ausd })}
        </Text>
      </div>
      <div
        sx={{
          flex: "row",
          justify: "space-between",
        }}
      >
        <Button
          variant="secondary"
          sx={{
            p: "10px 16px",
            display: ["inherit", "none"],
          }}
          disabled={!!rewards?.bsx.isZero()}
          isLoading={claimMutation.isLoading}
          onClick={() => setOpenMyPositions(true)}
        >
          <WalletIcon />
          {t("pools.allFarms.modal.myPositions")}
        </Button>
        <Button
          variant="primary"
          sx={{
            ml: [0, 32],
            flexShrink: 0,
            p: ["10px 16px", "16px 36px"],
            width: "max-content",
          }}
          disabled={!!claimable.data?.bsx.isZero()}
          isLoading={claimMutation.isLoading}
          onClick={() => claimMutation.mutate()}
        >
          {t("pools.allFarms.modal.claim.submit")}
        </Button>
      </div>
      <Modal
        open={openMyPositions}
        isDrawer
        titleDrawer={t("pools.allFarms.modal.list.positions")}
        onClose={() => setOpenMyPositions(false)}
      >
        <div sx={{ flex: "column", gap: 10 }}>
          {positions?.map((deposit, indexA) =>
            deposit.deposit.yieldFarmEntries.map((entry) => {
              index++
              return (
                <PoolPositionMobile
                  key={index}
                  pool={props.pool}
                  position={entry}
                  index={index}
                />
              )
            }),
          )}
        </div>
      </Modal>
    </SContainer>
  )
}
