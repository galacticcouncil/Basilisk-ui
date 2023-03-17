import { GradientText } from "../../../components/Typography/GradientText/GradientText"
import { useTranslation } from "react-i18next"
import { useAccountStore } from "../../../state/store"
import { Text } from "../../../components/Typography/Text/Text"
import { useCopyToClipboard, useMedia } from "react-use"
import { ReactComponent as CopyIcon } from "../../../assets/icons/CopyIcon.svg"
import { Button, ButtonTransparent } from "../../../components/Button/Button"
import { Separator } from "../../../components/Separator/Separator"
import { WalletConnectModal } from "../connect/modal/WalletConnectModal"
import { useState } from "react"
import { WalletInactiveButton } from "../connect/modal/WalletConnectButton"
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto"
import { BASILISK_ADDRESS_PREFIX } from "utils/api"
import { shortenAccountAddress } from "utils/formatting"
import { theme } from "theme"

export const WalletHeader = () => {
  const { t } = useTranslation()
  const { account } = useAccountStore()
  const [, copy] = useCopyToClipboard()
  const [open, setOpen] = useState(false)

  const isDesktop = useMedia(theme.viewport.gte.sm)

  const basiliskAddress = account
    ? encodeAddress(decodeAddress(account?.address), BASILISK_ADDRESS_PREFIX)
    : ""

  return (
    <>
      <div
        sx={{
          flex: ["column", "row"],
          justify: "space-between",
          align: ["start", "center"],
          gap: 6,
          pb: 16,
        }}
      >
        <GradientText fs={20} fw={600} lh={20}>
          {account?.name ?? t("wallet.header.noAccountSelected")}
        </GradientText>
        {account?.address ? (
          <div sx={{ flex: "row", align: "center" }}>
            <div
              sx={{
                flex: "row",
                align: "center",
                gap: 8,
                mr: 50,
              }}
            >
              <Text
                color="primary300"
                fs={14}
                fw={500}
                sx={{ maxWidth: ["calc(100vw - 60px)", "fit-content"] }}
                css={{ wordWrap: "break-word" }}
              >
                {isDesktop
                  ? basiliskAddress
                  : shortenAccountAddress(basiliskAddress, 16)}
              </Text>
              <ButtonTransparent
                onClick={() => copy(basiliskAddress.toString())}
              >
                <CopyIcon
                  sx={{
                    color: "primary300",
                  }}
                />
              </ButtonTransparent>
            </div>
            <Button
              size="small"
              onClick={() => setOpen(true)}
              sx={{ display: ["none", "inherit"] }}
            >
              {t("wallet.header.switchAccount")}
            </Button>
          </div>
        ) : (
          <WalletInactiveButton size="small" onOpen={() => setOpen(true)} />
        )}
      </div>
      <Separator color="white" opacity={0.12} />

      <WalletConnectModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
