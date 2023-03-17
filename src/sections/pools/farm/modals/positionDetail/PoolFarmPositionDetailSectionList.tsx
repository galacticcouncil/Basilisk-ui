import { ModalMeta } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import { useAPR } from "utils/farms/apr"
import { u128, u32 } from "@polkadot/types"
import { PoolBase } from "@galacticcouncil/sdk"
import { Fragment } from "react"
import { DepositNftType } from "api/deposits"
import { useAccountStore } from "state/store"
import { PoolFarmClaim } from "sections/pools/farm/claim/PoolFarmClaim"
import { PoolFarmWithdraw } from "sections/pools/farm/withdraw/PoolFarmWithdraw"
import { PoolFarmRedeposit } from "sections/pools/farm/deposit/PoolFarmRedeposit"
import { PoolFarmDetail } from "sections/pools/farm/detail/PoolFarmDetail"
import {
  PalletLiquidityMiningDepositData,
  PalletLiquidityMiningYieldFarmEntry,
} from "@polkadot/types/lookup"
import { GradientText } from "components/Typography/GradientText/GradientText"
import { useUserDeposits } from "utils/farms/deposits"

export function PoolFarmPositionDetailSectionList(props: {
  pool: PoolBase
  depositNft?: DepositNftType
  onSelect: (
    value: {
      yieldFarmId: u32
      globalFarmId: u32
      yieldFarmEntry?: PalletLiquidityMiningYieldFarmEntry
      depositNft?: { id: u128; deposit: PalletLiquidityMiningDepositData }
    } | null,
  ) => void
}) {
  const { t } = useTranslation()

  const { account } = useAccountStore()
  const apr = useAPR(props.pool.address)
  const userDeposits = useUserDeposits(props.pool.address)
  const depositNfts = props.depositNft ? [props.depositNft] : userDeposits.data

  const availableYieldFarms = apr.data?.filter(
    (farm) =>
      !depositNfts?.find((deposit) =>
        deposit.deposit.yieldFarmEntries.find(
          (entry) =>
            entry.globalFarmId.eq(farm.globalFarm.id) &&
            entry.yieldFarmId.eq(farm.yieldFarm.id),
        ),
      ),
  )

  const [assetIn, assetOut] = props.pool.tokens

  return (
    <Fragment key="list">
      <ModalMeta
        title={t("pools.allFarms.modal.title", {
          symbol1: assetIn.symbol,
          symbol2: assetOut.symbol,
        })}
      />

      {account && (
        <>
          <div>
            <GradientText fs={18} fw={700} sx={{ mb: 16 }}>
              {t("pools.allFarms.modal.list.positions")}
            </GradientText>
          </div>

          <PoolFarmClaim pool={props.pool} depositNft={props.depositNft} />

          {depositNfts?.map((deposit) => {
            return (
              <Fragment key={deposit.id.toString()}>
                {deposit.deposit.yieldFarmEntries.map((entry) => {
                  const farm = apr.data?.find(
                    (i) =>
                      entry.globalFarmId.eq(i.globalFarm.id) &&
                      entry.yieldFarmId.eq(i.yieldFarm.id),
                  )

                  if (farm == null) return null
                  return (
                    <PoolFarmDetail
                      key={farm.yieldFarm.id.toString()}
                      farm={farm}
                      pool={props.pool}
                      depositNft={deposit}
                      onSelect={() =>
                        props.onSelect({
                          globalFarmId: farm.globalFarm.id,
                          yieldFarmId: farm.yieldFarm.id,
                          yieldFarmEntry: entry,
                          depositNft: deposit,
                        })
                      }
                    />
                  )
                })}
              </Fragment>
            )
          })}

          {!!depositNfts?.length && (
            <div sx={{ flex: "row", justify: "center", width: "100%" }}>
              <PoolFarmWithdraw
                pool={props.pool}
                depositNft={props.depositNft}
              />
            </div>
          )}
        </>
      )}

      {depositNfts != null &&
        availableYieldFarms &&
        availableYieldFarms.length > 0 && (
          <>
            <div>
              <GradientText fs={18} fw={700} sx={{ mt: 20, mb: 16 }}>
                {t("pools.allFarms.modal.list.availableFarms")}
              </GradientText>
            </div>

            <div sx={{ flex: "column", gap: 28 }}>
              <div sx={{ flex: "column", gap: 12 }}>
                {availableYieldFarms?.map((farm) => (
                  <PoolFarmDetail
                    key={[farm.globalFarm.id, farm.yieldFarm.id].join(",")}
                    farm={farm}
                    pool={props.pool}
                    onSelect={() =>
                      props.onSelect({
                        globalFarmId: farm.globalFarm.id,
                        yieldFarmId: farm.yieldFarm.id,
                      })
                    }
                  />
                ))}
              </div>

              <PoolFarmRedeposit
                pool={props.pool}
                availableYieldFarms={availableYieldFarms}
                depositNfts={depositNfts}
              />
            </div>
          </>
        )}
    </Fragment>
  )
}
