import { ModalMeta } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import { useAPR } from "utils/apr"
import { u32 } from "@polkadot/types"
import { PoolToken } from "@galacticcouncil/sdk"
import { Fragment } from "react"
import { PoolJoinFarmDeposit } from "./PoolJoinFarmDeposit"
import { PoolJoinFarmItem } from "./PoolJoinFarmItem"
import { Text } from "components/Typography/Text/Text"
import { useDeposits } from "api/deposits"
import { useStore } from "state/store"
import { PoolJoinFarmClaim } from "./PoolJoinFarmClaim"
import { Box } from "components/Box/Box"
import { PoolJoinFarmWithdraw } from "./PoolJoinFarmWithdraw"

export function PoolJoinFarmSectionList(props: {
  poolId: string
  assetIn: PoolToken
  assetOut: PoolToken
  onSelect: (yieldFarmId: u32 | null) => void
}) {
  const { t } = useTranslation()
  const apr = useAPR(props.poolId)
  const deposits = useDeposits(props.poolId)

  const { account } = useStore()

  return (
    <Fragment key="list">
      <ModalMeta
        title={t("pools.allFarms.modal.title", {
          symbol1: props.assetIn.symbol,
          symbol2: props.assetOut.symbol,
        })}
      />

      {account && (
        <>
          <Text fs={18} fw={700} mb={16}>
            {t("pools.allFarms.modal.list.positions")}
          </Text>
          <PoolJoinFarmClaim poolId={props.poolId} />
          {deposits.data?.map((deposit) => {
            return (
              <Fragment key={deposit.id.toString()}>
                {deposit.deposit.yieldFarmEntries.map((entry) => {
                  const farm = apr.data.find(
                    (i) =>
                      entry.globalFarmId.eq(i.globalFarm.id) &&
                      entry.yieldFarmId.eq(i.yieldFarm.id),
                  )

                  if (farm == null) return null
                  return (
                    <PoolJoinFarmItem
                      key={farm.yieldFarm.id.toString()}
                      farm={farm}
                      deposit={{
                        assetA: props.assetIn,
                        assetB: props.assetOut,
                        data: deposit,
                      }}
                    />
                  )
                })}
              </Fragment>
            )
          })}

          {!!deposits.data?.length && (
            <Box flex css={{ justifyContent: "center" }}>
              <PoolJoinFarmWithdraw
                poolId={props.poolId}
                assetIn={props.assetIn}
                assetOut={props.assetOut}
              />
            </Box>
          )}

          <Text fs={18} fw={700} mt={20} mb={16}>
            {t("pools.allFarms.modal.list.availableFarms")}
          </Text>
        </>
      )}

      {apr.data.map((farm) => (
        <PoolJoinFarmItem
          key={[farm.globalFarm.id, farm.yieldFarm.id].join(",")}
          farm={farm}
          onSelect={() => props.onSelect(farm.yieldFarm.id)}
        />
      ))}

      <PoolJoinFarmDeposit
        poolId={props.poolId}
        assetIn={props.assetIn}
        assetOut={props.assetOut}
      />
    </Fragment>
  )
}