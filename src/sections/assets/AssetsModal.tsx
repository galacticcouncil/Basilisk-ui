import { Modal } from "../../components/Modal/Modal"
import { FC } from "react"
import { AssetsModalRow } from "./AssetsModalRow"
import { SAssetsModalHeader } from "./AssetsModal.styled"
import { u32 } from "@polkadot/types"
import { Text } from "../../components/Typography/Text/Text"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-use"
import { theme } from "theme"
import { Maybe } from "utils/helpers"
import { useAccountStore } from "state/store"
import { useAssetAccountDetails } from "api/assetDetails"

interface AssetsModalProps {
  allowedAssets?: Maybe<u32 | string>[]
  hiddenAssets?: Maybe<u32 | string>[]
  onSelect?: (id: u32 | string) => void
  onClose: () => void
}

type AccountDetailsType = NonNullable<
  ReturnType<typeof useAssetAccountDetails>["data"]
>

export const AssetsModal: FC<AssetsModalProps> = ({
  onClose,
  allowedAssets,
  hiddenAssets,
  onSelect,
}) => {
  const { t } = useTranslation()
  const isDesktop = useMedia(theme.viewport.gte.sm)
  const { account } = useAccountStore()

  const assetsRows = useAssetAccountDetails(account?.address)

  const { isPair, notPair } = assetsRows.data?.reduce(
    (acc, item) => {
      if (!allowedAssets || hiddenAssets?.includes(item.id)) {
        acc.isPair.push(item)
        return acc
      }

      if (allowedAssets.includes(item.id)) {
        acc.isPair.push(item)
      } else {
        acc.notPair.push(item)
      }

      return acc
    },
    { isPair: [] as AccountDetailsType, notPair: [] as AccountDetailsType },
  ) ?? {
    isPair: [],
    notPair: [],
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      isDrawer={!isDesktop}
      titleDrawer={t("selectAsset.title")}
    >
      {!!isPair?.length && (
        <>
          <SAssetsModalHeader sx={{ m: ["0 -14px", "0 -30px"] }}>
            <Text
              color="neutralGray300"
              fw={500}
              fs={12}
              tTransform="uppercase"
            >
              {t("selectAssets.asset")}
            </Text>
            <Text
              color="neutralGray300"
              fw={500}
              fs={12}
              tTransform="uppercase"
            >
              {t("selectAssets.your_balance")}
            </Text>
          </SAssetsModalHeader>
          {isPair?.map((asset) => (
            <AssetsModalRow
              key={asset.id}
              id={asset.id}
              onClick={() => onSelect?.(asset.id)}
            />
          ))}
        </>
      )}
      {!!notPair?.length && (
        <>
          <SAssetsModalHeader shadowed sx={{ m: ["0 -14px", "0 -30px"] }}>
            <Text
              color="neutralGray300"
              fw={500}
              fs={12}
              tTransform="uppercase"
            >
              {t("selectAssets.asset_without_pair")}
            </Text>
          </SAssetsModalHeader>
          {notPair?.map((asset) => (
            <AssetsModalRow key={asset.id} id={asset.id} notPair />
          ))}
        </>
      )}
    </Modal>
  )
}
