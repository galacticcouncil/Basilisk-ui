import { Modal } from "components/Modal/Modal"
import { Trans, useTranslation } from "react-i18next"
import {
  SFarm,
  SFarmIcon,
  SFarmRow,
  SMaxButton,
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
import { css } from "styled-components"
import { AssetInput } from "components/AssetInput/AssetInput"
import { DualAssetIcons } from "components/DualAssetIcons/DualAssetIcons"
import { Button } from "components/Button/Button"
import { useStore } from "state/store"
import { useApiPromise } from "utils/network"
import { usePoolShareToken } from "api/pools"
import { useTokenBalance } from "api/balances"
import { useForm } from "react-hook-form"

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

const PoolJoinFarmDeposit = (props: {
  poolId: string
  assetIn: PoolToken
  assetOut: PoolToken
  farm: AprFarm
}) => {
  const { t } = useTranslation()
  const { createTransaction } = useStore()
  const api = useApiPromise()

  const [value, setValue] = useState("")

  const assetA = useAsset(props.assetIn.id)
  const assetB = useAsset(props.assetOut.id)

  const shareToken = usePoolShareToken(props.poolId)

  const { account } = useStore()
  const shareTokenBalance = useTokenBalance(shareToken.data, account?.address)

  const form = useForm()

  async function handleSubmit() {
    const tx = api.tx.liquidityMining.depositShares(
      props.farm.globalFarm.id,
      props.farm.yieldFarm.id,
      {
        assetIn: props.assetIn.id,
        assetOut: props.assetOut.id,
      },
      value,
    )

    return await createTransaction({
      hash: tx.hash.toString(),
      tx,
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Box
        bg="backgroundGray800"
        p={20}
        mt={20}
        css={css`
          border-radius: 12px;
        `}
      >
        <Box flex acenter spread mb={11}>
          <Text fw={600} lh={22} color="primary200">
            Amount to deposit
          </Text>
          <Box flex acenter>
            <Text fs={12} lh={16} mr={5} color="white">
              <span css={{ opacity: 0.7 }}>Share token balance: </span>
              {shareTokenBalance.data?.balance?.toFixed()}
            </Text>
            <SMaxButton
              size="micro"
              text={t("selectAsset.button.max")}
              capitalize
              onClick={() => {
                const balance = shareTokenBalance.data?.balance

                if (balance != null) {
                  setValue(balance.toString())
                }
              }}
            />
          </Box>
        </Box>
        <Box flex acenter>
          <DualAssetIcons
            firstIcon={{ icon: assetA.data?.icon }}
            secondIcon={{ icon: assetB.data?.icon }}
          />
          <Box
            flex
            column
            mr={20}
            css={css`
              flex-shrink: 0;
            `}
          >
            <Text fw={700} fs={16}>
              {assetA.data?.name.toString()}/{assetB.data?.name.toString()}
            </Text>
            <Text fw={500} fs={12} color="neutralGray500">
              Token/Token
            </Text>
          </Box>

          <AssetInput
            value={value}
            css={css`
              flex-grow: 1;
            `}
            dollars="200"
            label="dd"
            name="tet"
            onChange={setValue}
          />
        </Box>
      </Box>

      <Box
        flex
        css={css`
          justify-content: flex-end;
        `}
      >
        <Button type="submit" variant="primary" mt={20}>
          Join farm
        </Button>
      </Box>
    </form>
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

          <PoolJoinFarmDeposit
            poolId={props.poolId}
            assetIn={props.assetA}
            assetOut={props.assetB}
            farm={selectedFarm}
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
