import { PROVIDERS, useProviderRpcUrlStore } from "api/provider"
import { Button } from "components/Button/Button"
import { Modal } from "components/Modal/Modal"
import { Text } from "components/Typography/Text/Text"
import { Fragment, useEffect, useState } from "react"
import { theme } from "theme"

import { ApiPromise, WsProvider } from "@polkadot/api"
import { u32, u64 } from "@polkadot/types"
import { useBestNumber } from "api/chain"
import { ReactComponent as ChevronRightIcon } from "assets/icons/ChevronRight.svg"
import { Separator } from "components/Separator/Separator"
import { useTranslation } from "react-i18next"
import {
  SButton,
  SCircle,
  SCircleDot,
  SContainer,
  SHeader,
  SItem,
  SName,
} from "./ProviderSelectModal.styled"
import { ProviderStatus } from "./ProviderStatus"

function ProviderSelectItemExternal(props: {
  url: string
  className?: string
}) {
  const [bestNumberState, setBestNumberState] = useState<
    { relaychainBlockNumber: u32; timestamp: u64 } | undefined
  >(undefined)

  useEffect(() => {
    const rpc = props.url
    const provider = new WsProvider(rpc)

    let cancel: () => void

    async function load() {
      const api = await ApiPromise.create({ provider })

      async function onNewBlock() {
        const [relay, timestamp] = await Promise.all([
          api.query.parachainSystem.validationData(),
          api.query.timestamp.now(),
        ])

        setBestNumberState({
          relaychainBlockNumber: relay.unwrap().relayParentNumber,
          timestamp: timestamp,
        })
      }

      api.on("connected", onNewBlock)
      api.rpc.chain
        .subscribeNewHeads(onNewBlock)
        .then((newCancel) => (cancel = newCancel))
    }

    load()

    return () => {
      cancel?.()
      provider.disconnect()
    }
  }, [props.url])

  return (
    <>
      {bestNumberState != null ? (
        <ProviderStatus
          timestamp={bestNumberState.timestamp}
          relaychainBlockNumber={bestNumberState.relaychainBlockNumber}
          className={props.className}
          side="left"
        />
      ) : (
        <span className={props.className} />
      )}
    </>
  )
}

function ProviderSelectItemLive(props: { className?: string }) {
  const number = useBestNumber()

  return (
    <>
      {number.data?.relaychainBlockNumber != null ? (
        <ProviderStatus
          timestamp={number.data.timestamp}
          relaychainBlockNumber={number.data?.relaychainBlockNumber}
          className={props.className}
          side="left"
        />
      ) : (
        <span className={props.className} />
      )}
    </>
  )
}

function ProviderSelectItem(props: {
  name: string
  url: string
  isActive?: boolean
  onClick: () => void
}) {
  const store = useProviderRpcUrlStore()
  const rpcUrl = store.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL

  const isLive = props.url === rpcUrl

  return (
    <SItem onClick={props.onClick}>
      <Text
        fs={14}
        color={props.isActive ? "primary400" : "white"}
        css={{
          gridArea: "name",
          transition: `all ${theme.transitions.default}`,
        }}
      >
        {props.name}
      </Text>
      {isLive ? (
        <ProviderSelectItemLive css={{ gridArea: "status" }} />
      ) : (
        <ProviderSelectItemExternal
          url={props.url}
          css={{ gridArea: "status" }}
        />
      )}
      <div
        css={{ gridArea: "url" }}
        sx={{
          textAlign: "right",
          flex: "row",
          align: "center",
          justify: "flex-end",
          gap: 16,
        }}
      >
        <Text
          fs={14}
          fw={500}
          tAlign="right"
          color={props.isActive ? "primary300" : "white"}
          sx={{ width: ["min-content", "auto"] }}
          css={{
            transition: `all ${theme.transitions.default}`,
          }}
        >
          {new URL(props.url).hostname}
        </Text>

        <SCircle>{props.isActive && <SCircleDot />}</SCircle>
      </div>
    </SItem>
  )
}

export function ProviderSelectModal(props: {
  open: boolean
  onClose: () => void
}) {
  const preference = useProviderRpcUrlStore()
  const activeRpcUrl = preference.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL
  const [userRpcUrl, setUserRpcUrl] = useState(activeRpcUrl)
  const { t } = useTranslation()

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title={t("rpc.change.modal.title")}
      width={620}
      gradientBg
    >
      <SContainer>
        <SHeader>
          <div css={{ gridArea: "name" }}>
            {t("rpc.change.modal.column.name")}
          </div>
          <div css={{ gridArea: "status" }}>
            {t("rpc.change.modal.column.status")}
          </div>
          <div css={{ gridArea: "url" }} sx={{ textAlign: "right" }}>
            {t("rpc.change.modal.column.rpc")}
          </div>
        </SHeader>

        {PROVIDERS.filter(
          (provider) => provider.env === import.meta.env.VITE_ENV,
        ).map((provider) => {
          return (
            <Fragment key={provider.url}>
              <ProviderSelectItem
                name={provider.name}
                url={provider.url}
                isActive={provider.url === userRpcUrl}
                onClick={() => setUserRpcUrl(provider.url)}
              />
            </Fragment>
          )
        })}
      </SContainer>

      <Button
        variant="primary"
        fullWidth
        sx={{ mt: 64 }}
        onClick={() => {
          preference.setRpcUrl(userRpcUrl)

          if (activeRpcUrl !== userRpcUrl) {
            window.location.reload()
          } else {
            props.onClose()
          }
        }}
      >
        {t("rpc.change.modal.save")}
      </Button>
    </Modal>
  )
}

export function ProviderSelectButton() {
  const [open, setOpen] = useState(false)
  const store = useProviderRpcUrlStore()

  const rpcUrl = store.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL
  const selectedProvider = PROVIDERS.find((provider) => provider.url === rpcUrl)
  const number = useBestNumber()

  return (
    <>
      <SButton tabIndex={0} onClick={() => setOpen(true)} whileHover="animate">
        <SName
          variants={{
            initial: { width: 0 },
            animate: { width: "auto" },
            exit: { width: 0 },
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          <Text fs={11} fw={500} css={{ whiteSpace: "nowrap" }}>
            {selectedProvider?.name}
          </Text>
          <ChevronRightIcon />
          <Separator
            orientation="vertical"
            sx={{ height: 14, mr: 10, opacity: 0.2 }}
            color="primary200"
          />
        </SName>
        <ProviderStatus
          relaychainBlockNumber={number.data?.relaychainBlockNumber}
          timestamp={number.data?.timestamp}
        />
      </SButton>
      {open && (
        <ProviderSelectModal open={open} onClose={() => setOpen(false)} />
      )}
    </>
  )
}
