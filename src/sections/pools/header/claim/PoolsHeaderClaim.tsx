import { Content, Portal, Root } from "@radix-ui/react-tooltip"
import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-use"
import { useAccountStore } from "state/store"
import { theme } from "theme"
import { SButton, SContent, STrigger } from "./PoolsHeaderClaim.styled"
import { PoolsHeaderClaimContent } from "./content/PoolsHeaderClaimContent"
import { useApiPromise } from "utils/api"
import { isApiLoaded } from "utils/helpers"

export const PoolsHeaderClaim = () => {
  const { t } = useTranslation()
  const { account } = useAccountStore()
  const api = useApiPromise()
  const [open, setOpen] = useState(false)
  const isDesktop = useMedia(theme.viewport.gte.sm)

  if (!account || !isApiLoaded(api)) return null

  return (
    <div sx={{ m: ["16px 0", "auto 0"] }}>
      {isDesktop ? (
        <Root delayDuration={0} open={open} onOpenChange={setOpen}>
          <STrigger
            open={open}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen(true)
            }}
          >
            {t("pools.header.claim.check")}
            <ChevronDown />
          </STrigger>
          <Portal>
            <Content asChild side="bottom" align="end" sideOffset={8}>
              <SContent>
                <PoolsHeaderClaimContent onClaim={() => setOpen(false)} />
              </SContent>
            </Content>
          </Portal>
        </Root>
      ) : (
        <>
          <SButton
            variant="gradient"
            onClick={() => setOpen((prev) => !prev)}
            isOpen={open}
          >
            {t("pools.header.claim.check")}
            <ChevronDown />
          </SButton>
          {open && (
            <SContent>
              <PoolsHeaderClaimContent onClaim={() => setOpen(false)} />
            </SContent>
          )}
        </>
      )}
    </div>
  )
}
