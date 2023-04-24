export const LINKS = {
  home: "/",
  pools_and_farms: "/pools-and-farms",
  trade: "/trade",
  wallet: "/wallet",
  walletAssets: "/wallet/assets",
  walletTransactions: "/wallet/transactions",
  walletVesting: "/wallet/vesting",
  cross_chain: "/cross-chain",
}

export const EXTERNAL_LINKS = {
  lbp: `${import.meta.env.VITE_DOMAIN_URL}/#/lbp`,
  swap: `${import.meta.env.VITE_DOMAIN_URL}/#/swap`,
  wallet: `${import.meta.env.VITE_DOMAIN_URL}/#/wallet`,
  bridge: `https://docs.bsx.fi/howto_bridge/`,
} as const

const isXcmPageEnabled = import.meta.env.VITE_FF_XCM_ENABLED === "true"

export const MENU_ITEMS = [
  {
    key: "trade",
    translationKey: "header.trade",
    href: LINKS.trade,
    enabled: true,
    external: false,
    mobVisible: true,
  },
  {
    key: "pools",
    translationKey: "header.pools",
    href: LINKS.pools_and_farms,
    enabled: true,
    external: false,
    mobVisible: true,
  },
  {
    key: "wallet",
    translationKey: "header.wallet",
    href: LINKS.wallet,
    enabled: true,
    external: false,
    mobVisible: true,
  },
  {
    key: "cross-chain",
    translationKey: "header.xcm",
    href: LINKS.cross_chain,
    enabled: isXcmPageEnabled,
    external: false,
    mobVisible: false,
  },
] as const

export type TabKeys = (typeof MENU_ITEMS)[number]["key"]
export type TabObject = (typeof MENU_ITEMS)[number]
