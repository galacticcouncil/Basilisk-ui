import * as React from "react"
import { createComponent } from "@lit-labs/react"
import { AssetLogo, PlaceholderLogo } from "@galacticcouncil/ui"
import { assetPlaceholderCss } from "./AssetIcon.styled"

export const UigcAssetLogo = createComponent({
  tagName: "uigc-logo-asset",
  elementClass: AssetLogo,
  react: React,
})

export const UigcAssetPlaceholder = createComponent({
  tagName: "uigc-logo-placeholder",
  elementClass: PlaceholderLogo,
  react: React,
})

export function getAssetLogo(symbol: string | null | undefined) {
  return (
    <UigcAssetLogo
      ref={(el) => el && el.setAttribute("fit", "")}
      asset={symbol}
    >
      <UigcAssetPlaceholder
        css={assetPlaceholderCss}
        ref={(el) => el && el.setAttribute("fit", "")}
        slot="placeholder"
      ></UigcAssetPlaceholder>
    </UigcAssetLogo>
  )
}
