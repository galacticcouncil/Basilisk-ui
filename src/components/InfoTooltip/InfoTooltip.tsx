import * as Tooltip from "@radix-ui/react-tooltip"
import { ReactComponent as InfoIcon } from "assets/icons/InfoIcon.svg"
import { Text } from "components/Typography/Text/Text"
import { ReactNode } from "react"
import { STrigger } from "./InfoTooltip.styled"

export function InfoTooltip(props: { text: ReactNode }) {
  return (
    <Tooltip.Root delayDuration={0}>
      <STrigger>
        <InfoIcon />
      </STrigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sx={{ bg: "black", p: 16 }}
          css={{ borderRadius: 6, maxWidth: "80vw" }}
          side="bottom"
          align="start"
          sideOffset={3}
          alignOffset={-10}
        >
          <Text sx={{ fontSize: 12, fontWeight: 400 }}>{props.text}</Text>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
