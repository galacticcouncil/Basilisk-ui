import { Text } from "components/Typography/Text/Text"
import { ReactComponent as Wormhole } from "assets/icons/crosschains/Wormhole.svg"
import { ReactComponent as Karura } from "assets/icons/crosschains/Karura.svg"
import { ReactNode } from "react"
import { ExternalLink } from "components/Link/ExternalLink"

export const CROSSCHAINS: Array<{
  icon: ReactNode
  guide?: ReactNode
  name: string
  type: "ingoing" | "outgoing" | "both"
  url: string
}> = [
  {
    icon: <Karura />,
    name: "Karura",
    type: "both",
    url: "https://apps.karura.network/bridge",
    guide: (
      <div sx={{ flex: "column", align: "center", gap: 16 }}>
        <Text tAlign="center" fw={400} sx={{ maxWidth: 400 }}>
          1. First you will have to use the Bridge App to move them from
          Kusama's chain to Karura's
        </Text>

        <Text tAlign="center" fw={400} sx={{ maxWidth: 400 }}>
          2. Once your KSM are in Karura's network.
        </Text>

        <Text tAlign="center" fw={400} sx={{ maxWidth: 400 }}>
          3. You should be able to trade them in Basilisk.
        </Text>

        <Text tAlign="center" fw={400} sx={{ color: "yellow300" }}>
          IMPORTANT: Any assets must first be sent to Kusama, then to Karura.
        </Text>

        <Text tAlign="center" fw={400} sx={{ maxWidth: 500 }}>
          Below you will find step by step instructions on how to move your KSM
          from Karura to Kusama.
        </Text>

        <ExternalLink
          href="https://docs.bsx.fi/howto_bridge/#karura"
          sx={{ color: "primary450" }}
        >
          Go to full instructions
        </ExternalLink>
      </div>
    ),
  },
  {
    icon: <Wormhole />,
    name: "Wormhole",
    type: "both",
    url: "https://www.portalbridge.com/#/transfer",
  },
]
