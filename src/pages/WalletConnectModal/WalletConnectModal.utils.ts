export const PROVIDERS = ["polkadot-js", "talisman"] as const
export type ProviderType = typeof PROVIDERS[number]
