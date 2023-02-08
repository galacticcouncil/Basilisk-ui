import { PoolAddLiquidityAssetSelect } from "./assetSelect/PoolAddLiquidityAssetSelect"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { PoolAddLiquidityConversion } from "./conversion/PoolAddLiquidityConversion"
import { BN_1, BN_10, BN_100, DEFAULT_DECIMALS } from "utils/constants"
import { Row } from "components/Row/Row"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { Button, ButtonTransparent } from "components/Button/Button"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { usePools, usePoolShareToken } from "api/pools"
import { FC, useCallback, useMemo, useState } from "react"
import {
  useAddLiquidityMutation,
  useAddLiquidityPaymentInfo,
} from "api/addLiquidity"
import { useTotalIssuance } from "api/totalIssuance"
import { useTokensBalances } from "api/balances"
import { useSpotPrice } from "api/spotPrice"
import { getFixedPointAmount, getFloatingPointAmount } from "utils/balance"
import BigNumber from "bignumber.js"
import { PoolBase, PoolFee, PoolToken } from "@galacticcouncil/sdk"
import { useAccountStore } from "state/store"
import { Trans, useTranslation } from "react-i18next"
import { u32 } from "@polkadot/types"
import { getTradeFee } from "sections/pools/pool/Pool.utils"
import { useAssetMeta } from "api/assetMeta"
import { useAccountCurrency } from "api/payments"
import * as xyk from "@galacticcouncil/math-xyk"
import { Controller, useForm } from "react-hook-form"
import { BN_0 } from "../../../../../utils/constants"
import { useLocalStorage } from "react-use"
import {
  DEFAULT_SETTINGS,
  DEFAULT_TRADE_LIMIT,
  Settings,
  SettingsModal,
} from "components/SettingsModal/SettingsModal"

type AssetMetaType = NonNullable<ReturnType<typeof useAssetMeta>["data"]>
interface PoolAddLiquidityModalProps {
  tradeFee?: PoolFee
  setPoolAddress: (address: string) => void
  assetA: PoolToken | AssetMetaType
  assetB: PoolToken | undefined
  poolAddress: string
}

const getAllowedTokensId = (
  pools: PoolBase[] | undefined,
  pairedTokenId: string,
) =>
  pools?.reduce((acc, item) => {
    if (item.tokens.some((token) => token.id === pairedTokenId)) {
      const allowedTokenId = item.tokens.find(
        (token) => token.id !== pairedTokenId,
      )?.id
      if (allowedTokenId) acc.push(allowedTokenId)
    }
    return acc
  }, [] as string[])

const opposite = (value: "assetA" | "assetB") =>
  value === "assetA" ? "assetB" : "assetA"

export const PoolAddLiquidityModal: FC<PoolAddLiquidityModalProps> = ({
  tradeFee,
  poolAddress,
  assetA,
  assetB,
  setPoolAddress,
}) => {
  const { t } = useTranslation()
  const pools = usePools()

  const { account } = useAccountStore()
  const { data: shareToken } = usePoolShareToken(poolAddress)
  const { data: shareTokenMeta } = useAssetMeta(shareToken?.token)

  const accountCurrency = useAccountCurrency(account?.address)
  const feeMeta = useAssetMeta(accountCurrency.data)
  const [openSettings, setOpenSettings] = useState(false)
  const [settings, setSettings] = useLocalStorage<Settings>(
    `settings_${account?.address}`,
    DEFAULT_SETTINGS,
  )

  const [assets, setAssets] = useState({
    assetA,
    assetB: assetB ?? { id: "", symbol: "", decimals: 12 },
  })

  const form = useForm<{
    assetA: string
    assetB: string
    lastUpdated: "assetA" | "assetB"
  }>({
    defaultValues: { assetA: "", assetB: "", lastUpdated: "assetA" },
  })

  const [assetValueA, assetValueB] = form.watch(["assetA", "assetB"])

  const assetValues = useMemo(
    () => ({ assetA: assetValueA, assetB: assetValueB }),
    [assetValueA, assetValueB],
  )

  const paymentInfo = useAddLiquidityPaymentInfo(
    assets.assetA.id,
    assets.assetB.id,
  )

  const handleAddLiquidity = useAddLiquidityMutation()

  const shareIssuance = useTotalIssuance(shareToken?.token)
  const spotPrice = useSpotPrice(assets.assetA.id, assets.assetB.id)

  const reserves = useTokensBalances(
    [assets.assetA.id, assets.assetB.id],
    poolAddress,
  )

  const [{ data: assetABalance }, { data: assetBBalance }] = useTokensBalances(
    [assets.assetA.id, assets.assetB.id],
    account?.address,
  )

  const shareTokenDecimals = useMemo(() => {
    if (shareTokenMeta?.decimals) {
      return shareTokenMeta.decimals.toNumber()
    }

    return DEFAULT_DECIMALS.toNumber()
  }, [shareTokenMeta])

  const calculatedShares = useMemo(() => {
    if (
      xyk &&
      reserves[0].data &&
      shareIssuance.data &&
      shareTokenDecimals &&
      assetValues.assetA &&
      assets.assetA
    ) {
      return new BigNumber(
        xyk.calculate_shares(
          getFixedPointAmount(
            reserves[0].data.balance,
            assets.assetA.decimals.toString(),
          ).toFixed(),
          getFixedPointAmount(
            new BigNumber(assetValues.assetA),
            assets.assetA.decimals.toString(),
          ).toFixed(),
          getFixedPointAmount(
            shareIssuance.data.total,
            shareTokenDecimals,
          ).toFixed(),
        ),
      )
    }

    return null
  }, [reserves, shareIssuance.data, shareTokenDecimals, assetValues, assets])

  let calculatedRatio =
    shareIssuance.data &&
    calculatedShares &&
    calculatedShares.div(shareIssuance.data.total).multipliedBy(100)

  if (calculatedRatio && !calculatedRatio.isFinite()) {
    calculatedRatio = BN_100
  }

  const handleChange = useCallback(
    (value: string, currPosition: 0 | 1, name: "assetA" | "assetB") => {
      const nextPosition = currPosition === 0 ? 1 : 0

      const assetDecimals = assets[name].decimals

      const currReserves = reserves[currPosition].data
      const nextReserves = reserves[nextPosition].data

      if (currReserves && nextReserves && xyk) {
        const pairTokenValue = getFloatingPointAmount(
          xyk.calculate_liquidity_in(
            currReserves.balance.toFixed(),
            nextReserves.balance.toFixed(),
            getFixedPointAmount(
              new BigNumber(value),
              assetDecimals.toString(),
            ).toFixed(),
          ),
          assetDecimals.toString(),
        ).toFixed(4)

        form.setValue(name, value)
        form.setValue(opposite(name), pairTokenValue)
        form.setValue("lastUpdated", name)
      }
    },
    [assets, reserves, form],
  )

  const handleSelectAsset = useCallback(
    (assetId: u32 | string, name: "assetA" | "assetB") => {
      const pairTokenId = assets[opposite(name)].id

      const nextPool = pools.data?.find(
        (nextPool) =>
          nextPool.tokens.some((token) => token.id === assetId) &&
          nextPool.tokens.some((token) => token.id === pairTokenId),
      )

      if (nextPool) {
        setPoolAddress(nextPool.address)
        const newTokens = {
          assetA: nextPool.tokens[0],
          assetB: nextPool.tokens[1],
        }

        // set assets in correct order
        if (newTokens[name].id === assetId) {
          setAssets(newTokens)
        } else {
          setAssets({ assetA: newTokens.assetB, assetB: newTokens.assetA })
        }
      }

      form.reset()
    },
    [assets, pools, setPoolAddress, form],
  )

  async function handleSubmit() {
    const lastUpdated = form.watch("lastUpdated")

    handleAddLiquidity.mutate({
      assetA: {
        id: assets[lastUpdated].id,
        amount: getFixedPointAmount(
          new BigNumber(assetValues[lastUpdated]),
          assets[lastUpdated].decimals.toString(),
        ),
      },
      assetB: {
        id: assets[opposite(lastUpdated)].id,
        amount: getFixedPointAmount(
          new BigNumber(assetValues[lastUpdated]),
          assets[opposite(lastUpdated)].decimals.toString(),
        ).times(
          BigNumber(settings?.tradeLimit ?? DEFAULT_TRADE_LIMIT)
            .dividedBy(100)
            .plus(1),
        ),
      },
      toast: {
        onLoading: (
          <Trans
            t={t}
            i18nKey="liquidity.add.modal.toast.onLoading"
            tOptions={{
              shares: calculatedShares,
              fixedPointScale: shareTokenDecimals,
            }}
          >
            <span />
            <span className="highlight" />
          </Trans>
        ),
        onSuccess: (
          <Trans
            t={t}
            i18nKey="liquidity.add.modal.toast.onSuccess"
            tOptions={{
              shares: calculatedShares,
              fixedPointScale: shareTokenDecimals,
            }}
          >
            <span />
            <span className="highlight" />
          </Trans>
        ),
        onError: (
          <Trans
            t={t}
            i18nKey="liquidity.add.modal.toast.onLoading"
            tOptions={{
              shares: calculatedShares,
              fixedPointScale: shareTokenDecimals,
            }}
          >
            <span />
            <span className="highlight" />
          </Trans>
        ),
      },
    })
  }

  const getValidationRules = (balance: BigNumber, decimals: string) => ({
    required: t("error.required"),
    validate: {
      validNumber: (value: string) => {
        try {
          if (!new BigNumber(value).isNaN()) return true
        } catch {}
        return t("error.validNumber")
      },
      positive: (value: string) =>
        new BigNumber(value).gt(0) || t("error.positive"),
      maxBalance: (value: string) => {
        try {
          if (!balance) throw new Error("Missing asset meta")
          if (balance.gte(BigNumber(value).multipliedBy(BN_10.pow(decimals))))
            return true
        } catch {}
        return t("liquidity.add.modal.validation.notEnoughBalance")
      },
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      sx={{
        flex: "column",
        justify: "space-between",
        height: "calc(100% - var(--modal-header-title-height))",
      }}
    >
      <div>
        <Controller
          name="assetA"
          control={form.control}
          rules={getValidationRules(
            assetABalance?.balance ?? BN_0,
            assets.assetA.decimals.toString(),
          )}
          render={({ field: { name, value }, fieldState: { error } }) => (
            <PoolAddLiquidityAssetSelect
              name={name}
              allowedAssets={getAllowedTokensId(pools.data, assets.assetB.id)}
              hiddenAssets={[assets.assetA.id, assets.assetB.id]}
              asset={assets.assetA.id}
              balance={assetABalance?.balance}
              decimals={BigNumber(assets.assetA.decimals.toString()).toNumber()}
              assetIcon={getAssetLogo(assets.assetA.symbol)}
              value={value}
              onChange={(value) => {
                handleChange(value, 0, name)
              }}
              onSelectAsset={(assetId) => handleSelectAsset(assetId, name)}
              error={error?.message}
              sx={{ mt: 16 }}
            />
          )}
        />

        {assetB ? (
          <PoolAddLiquidityConversion
            firstValue={{ amount: BN_1, currency: assets.assetA.symbol }}
            secondValue={{
              amount: spotPrice.data?.spotPrice ?? BN_1,
              currency: assets.assetB.symbol,
            }}
          />
        ) : (
          <Separator color="backgroundGray800" sx={{ my: 29 }} />
        )}
        <Controller
          name="assetB"
          control={form.control}
          rules={getValidationRules(
            assetBBalance?.balance ?? BN_0,
            assets.assetB.decimals.toString(),
          )}
          render={({ field: { name, value }, fieldState: { error } }) => (
            <PoolAddLiquidityAssetSelect
              name={name}
              disabled={!assets.assetB.id}
              allowedAssets={getAllowedTokensId(pools.data, assets.assetA.id)}
              hiddenAssets={[assets.assetA.id, assets.assetB.id]}
              asset={assets.assetB.id}
              balance={assetBBalance?.balance}
              decimals={BigNumber(assets.assetB.decimals.toString()).toNumber()}
              assetIcon={getAssetLogo(assets.assetB.symbol)}
              value={value}
              onChange={(value) => handleChange(value, 1, name)}
              onSelectAsset={(assetId) => handleSelectAsset(assetId, name)}
              error={error?.message}
            />
          )}
        />
        <Row
          left={t("pools.addLiquidity.modal.row.tradeLimit")}
          right={
            <div sx={{ flex: "row", align: "center", gap: 4 }}>
              <Text fs={14}>
                {t("value.percentage", {
                  value: settings?.tradeLimit ?? DEFAULT_TRADE_LIMIT,
                })}
              </Text>
              <ButtonTransparent onClick={() => setOpenSettings(true)}>
                <Text fs={14} color="primary300">
                  {t("edit")}
                </Text>
              </ButtonTransparent>
            </div>
          }
        />
        <Separator />
        <Row
          left={t("pools.addLiquidity.modal.row.tradeFee")}
          right={t("value.percentage", { value: getTradeFee(tradeFee) })}
        />
        <Separator />
        <Row
          left={t("pools.addLiquidity.modal.row.transactionCost")}
          right={
            paymentInfo && (
              <Text>
                {t("pools.addLiquidity.modal.row.transactionCostValue", {
                  amount: paymentInfo.data?.partialFee,
                  symbol: feeMeta.data?.symbol,
                  fixedPointScale: feeMeta.data?.decimals ?? 12,
                })}
              </Text>
            )
          }
        />
        <Separator />
        <Row
          left={t("pools.addLiquidity.modal.row.sharePool")}
          right={t("value.percentage", {
            value: calculatedRatio,
          })}
        />
        <Separator />
        <Row
          left={t("pools.addLiquidity.modal.row.shareTokens")}
          right={
            calculatedShares && (
              <Text color="primary400">
                {t("value", {
                  value: calculatedShares,
                  fixedPointScale: shareTokenDecimals,
                  type: "token",
                })}
              </Text>
            )
          }
        />
      </div>
      {account ? (
        <Button
          disabled={!assetB}
          text={t("pools.addLiquidity.modal.confirmButton")}
          variant="primary"
          type="submit"
          fullWidth
          sx={{ mt: 30 }}
        />
      ) : (
        <WalletConnectButton css={{ marginTop: 30, width: "100%" }} />
      )}
      {openSettings && (
        <SettingsModal
          isOpen={openSettings}
          onClose={(newSettings) => {
            setOpenSettings(false)
            if (newSettings) setSettings(newSettings)
          }}
        />
      )}
    </form>
  )
}
