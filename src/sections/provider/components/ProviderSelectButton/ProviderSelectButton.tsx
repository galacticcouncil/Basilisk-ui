import { useBestNumber } from "api/chain"
import { PROVIDERS, useProviderRpcUrlStore } from "api/provider"
import { Separator } from "components/Separator/Separator"
import { Text } from "components/Typography/Text/Text"
import { useState } from "react"
import { ReactComponent as ChevronRightIcon } from "assets/icons/ChevronRight.svg"
import { ProviderSelectModal } from "sections/provider/ProviderSelectModal"
import { ProviderStatus } from "sections/provider/ProviderStatus"
import { SButton, SName } from "./ProviderSelectButton.styled"
import { useRpcStore } from "state/store"

export const ProviderSelectButton = () => {
  const [open, setOpen] = useState(false)
  const store = useProviderRpcUrlStore()
  const { rpcList } = useRpcStore()

  const rpcUrl = store.rpcUrl ?? import.meta.env.VITE_PROVIDER_URL
  const selectedProviderName =
    rpcList.find((provider) => provider.url === rpcUrl)?.name ??
    PROVIDERS.find((provider) => provider.url === rpcUrl)?.name
  const number = useBestNumber()

  return (
    <>
      <SButton
        tabIndex={0}
        role="button"
        onClick={() => setOpen(true)}
        whileHover="animate"
      >
        <SName
          variants={{
            initial: { width: 0 },
            animate: { width: "auto" },
            exit: { width: 0 },
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          <Text fs={11} fw={500} css={{ whiteSpace: "nowrap" }}>
            {selectedProviderName}
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
