import { Content, Portal, Root } from "@radix-ui/react-tooltip"
import { ReactComponent as ChevronDown } from "assets/icons/ChevronDown.svg"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMedia } from "react-use"
import { useAccountStore } from "state/store"
import { theme } from "theme"
import { SContent, STrigger } from "./PoolsHeaderClaim.styled"
import { PoolsHeaderClaimContent } from "./content/PoolsHeaderClaimContent"

export const PoolsHeaderClaim = () => {
  const { t } = useTranslation()
  const { account } = useAccountStore()
  const [open, setOpen] = useState(false)
  const isDesktop = useMedia(theme.viewport.gte.sm)

  if (!account) return null

  return (
    <div sx={{ m: ["16px 0", "auto 0"] }}>
      <Root delayDuration={0} open={open} onOpenChange={setOpen}>
        <STrigger
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(true)
          }}
        >
          {t("pools.header.claim.check")}
          <ChevronDown css={{ transform: `rotate(${open ? 180 : 0}deg)` }} />
        </STrigger>

        {isDesktop ? (
          <Portal>
            <Content asChild side="bottom" align="end" sideOffset={8}>
              <SContent>
                <PoolsHeaderClaimContent onClaim={() => setOpen(false)} />
              </SContent>
            </Content>
          </Portal>
        ) : (
          open && (
            <SContent>
              <PoolsHeaderClaimContent onClaim={() => setOpen(false)} />
            </SContent>
          )
        )}
      </Root>
    </div>
  )
}
