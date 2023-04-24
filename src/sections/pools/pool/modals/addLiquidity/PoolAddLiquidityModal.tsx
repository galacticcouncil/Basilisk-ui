import { PoolAddLiquidityAssetSelect } from "./assetSelect/PoolAddLiquidityAssetSelect"
import { getAssetLogo } from "components/AssetIcon/AssetIcon"
import { PoolAddLiquidityConversion } from "./conversion/PoolAddLiquidityConversion"
import { BN_1, BN_100, DEFAULT_DECIMALS } from "utils/constants"
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
import { PoolFee, PoolToken } from "@galacticcouncil/sdk"
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
import {
  getAllowedTokensId,
  getValidationRules,
  opposite,
} from "./PoolAddLiquidity.utils"
import { NATIVE_ASSET_ID } from "utils/api"
import { PoolAddLiquidityInformationCard } from "./information/PoolAddLiquidityInformationCard"

type AssetMetaType = NonNullable<ReturnType<typeof useAssetMeta>["data"]>
interface PoolAddLiquidityModalProps {
  tradeFee?: PoolFee
  setPoolAddress: (address: string) => void
  assetA: PoolToken | AssetMetaType
  assetB: PoolToken | undefined
  poolAddress: string
}

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
  const feeSpotPrice = useSpotPrice(NATIVE_ASSET_ID, feeMeta.data?.id)
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

  const [{ data: assetAReserve }, { data: assetBReserve }] = useTokensBalances(
    [assets.assetA.id, assets.assetB.id],
    poolAddress,
  )

  const reserves = useMemo(
    () => ({
      assetA: assetAReserve,
      assetB: assetBReserve,
    }),
    [assetAReserve, assetBReserve],
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
      reserves.assetA &&
      shareIssuance.data &&
      shareTokenDecimals &&
      assetValues.assetA &&
      assets.assetA
    ) {
      return new BigNumber(
        xyk.calculate_shares(
          getFixedPointAmount(
            reserves.assetA.balance,
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
    (value: string, name: "assetA" | "assetB") => {
      const assetDecimals = assets[name].decimals
      const pairAssetDecimals = assets[opposite(name)].decimals

      const currReserves = reserves[name]
      const nextReserves = reserves[opposite(name)]

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
          pairAssetDecimals.toString(),
        ).toString()

        form.setValue(name, value, { shouldValidate: true, shouldTouch: true })
        form.setValue(opposite(name), pairTokenValue, {
          shouldValidate: true,
          shouldTouch: true,
        })
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
          new BigNumber(assetValues[opposite(lastUpdated)]),
          assets[opposite(lastUpdated)].decimals.toString(),
        )
          .times(
            BigNumber(settings?.tradeLimit ?? DEFAULT_TRADE_LIMIT)
              .dividedBy(100)
              .plus(1),
          )
          .decimalPlaces(0),
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
            t,
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
                handleChange(value, name)
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
            t,
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
              onChange={(value) => handleChange(value, name)}
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
                  amount: paymentInfo.data?.partialFee
                    .toBigNumber()
                    .multipliedBy(feeSpotPrice.data?.spotPrice ?? BN_1),
                  symbol: feeMeta.data?.symbol,
                  fixedPointScale: feeMeta.data?.decimals.toString() ?? 12,
                  type: "token",
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
        <PoolAddLiquidityInformationCard />
      </div>
      {account ? (
        <Button
          disabled={
            !assetB ||
            !!form.formState.errors.assetA ||
            !!form.formState.errors.assetB ||
            !form.formState.touchedFields.assetA
          }
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
