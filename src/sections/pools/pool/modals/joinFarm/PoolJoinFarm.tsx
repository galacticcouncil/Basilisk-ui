import { Modal } from "components/Modal/Modal"
import { Trans, useTranslation } from "react-i18next"
import {
  SFarm,
  SFarmIcon,
  SFarmRow,
} from "sections/pools/pool/modals/joinFarm/PoolJoinFarm.styled"
import { Box } from "components/Box/Box"
import { Text } from "components/Typography/Text/Text"
import { FillBar } from "components/FillBar/FillBar"
import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { AprFarm, useAPR } from "utils/apr"
import { useAsset } from "api/asset"
import { u32 } from "@polkadot/types"
import { addSeconds } from "date-fns"
import BN from "bignumber.js"
import { BLOCK_TIME } from "utils/constants"
import { useBestNumber } from "api/chain"
import { PoolToken } from "@galacticcouncil/sdk"
import { ComponentProps, useState } from "react"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"

const PoolJoinFarmItem = (props: {
  farm: AprFarm
  onSelect: () => void
  variant: "list" | "detail"
}) => {
  const asset = useAsset(props.farm.assetId)
  const { t } = useTranslation()

  const bestNumber = useBestNumber()
  if (!bestNumber?.data) return null

  const blockDurationToEnd = props.farm.estimatedEndBlock.minus(
    new BN(bestNumber.data.toHex()),
  )

  const secondsDurationToEnd = blockDurationToEnd.times(BLOCK_TIME)

  return (
    <SFarm
      as={props.variant === "detail" ? "div" : "button"}
      variant={props.variant}
      onClick={props.onSelect}
    >
      <Box flex column gap={8}>
        <Box flex acenter gap={8}>
          {asset.data?.icon}
          <Text fw={700}>{asset.data?.name}</Text>
        </Box>
        <Text fs={20} lh={28} fw={600} color="primary200">
          {t("pools.allFarms.modal.apr.single", {
            value: props.farm.apr.toFixed(),
          })}
        </Text>
      </Box>
      <Box flex column>
        <SFarmRow>
          <FillBar
            percentage={props.farm.distributedRewards
              .div(props.farm.maxRewards)
              .times(100)
              .toNumber()}
          />
          <Text>
            <Trans
              t={t}
              i18nKey="pools.allFarms.modal.distribution"
              tOptions={{
                distributed: props.farm.distributedRewards,
                max: props.farm.maxRewards,
                formatParams: {
                  distributed: { precision: 12 },
                  max: { precision: 12 },
                },
              }}
            >
              <Text as="span" fs={14} color="neutralGray100" />
              <Text as="span" fs={14} color="neutralGray300" />
            </Trans>
          </Text>
        </SFarmRow>
        <SFarmRow>
          <FillBar percentage={props.farm.fullness.times(100).toNumber()} />
          <Text fs={14} color="neutralGray100">
            {t("pools.allFarms.modal.capacity", {
              capacity: props.farm.fullness.times(100).toNumber(),
            })}
          </Text>
        </SFarmRow>
        <Text fs={12} lh={16} fw={400} color="neutralGray500">
          {t("pools.allFarms.modal.end", {
            end: addSeconds(new Date(), secondsDurationToEnd.toNumber()),
          })}
        </Text>
      </Box>
      {props.variant === "list" && (
        <SFarmIcon>
          <ChevronDown />
        </SFarmIcon>
      )}
    </SFarm>
  )
}

export const PoolJoinFarm = (props: {
  poolId: string
  assetA: PoolToken
  assetB: PoolToken
  isOpen: boolean
  onClose: () => void
  onSelect: () => void
}) => {
  const { t } = useTranslation()
  const apr = useAPR(props.poolId)

  const [selectedYieldFarmId, setSelectedYieldFarmId] =
    useState<u32 | null>(null)

  const selectedFarm = selectedYieldFarmId
    ? apr.data.find((i) => i.yieldFarm.id.eq(selectedYieldFarmId))
    : null

  const modalProps: Partial<ComponentProps<typeof Modal>> =
    selectedYieldFarmId != null
      ? {
          title: t("pools.allFarms.detail.modal.title"),
          secondaryIcon: {
            icon: <ChevronRight css={{ transform: "rotate(180deg)" }} />,
            name: "Back",
            onClick: () => setSelectedYieldFarmId(null),
          },
        }
      : {
          title: t("pools.allFarms.modal.title", {
            symbol1: props.assetA.symbol,
            symbol2: props.assetB.symbol,
          }),
        }

  return (
    <Modal open={props.isOpen} onClose={props.onClose} {...modalProps}>
      {selectedFarm != null ? (
        <Box flex column gap={8} mt={24}>
          <PoolJoinFarmItem
            variant="detail"
            farm={selectedFarm}
            onSelect={() => console.log("test")}
          />
        </Box>
      ) : (
        <Box flex column gap={8} mt={24}>
          {apr.data.map((farm) => (
            <PoolJoinFarmItem
              variant="list"
              key={farm.toString()}
              farm={farm}
              onSelect={() => {
                setSelectedYieldFarmId(farm.yieldFarm.id)
              }}
            />
          ))}
        </Box>
      )}
    </Modal>
  )
}
