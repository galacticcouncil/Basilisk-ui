import * as Tooltip from "@radix-ui/react-tooltip"
import { Text } from "components/Typography/Text/Text"
import { ReactNode, useState } from "react"
import { STrigger } from "./InfoTooltip.styled"

type InfoTooltipProps = {
  text: ReactNode
  textOnClick?: ReactNode
  children: ReactNode
  side?: Tooltip.TooltipContentProps["side"]
}

export function InfoTooltip({
  text,
  textOnClick,
  children,
  side,
}: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState(text)
  return (
    <Tooltip.Root
      delayDuration={0}
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        // reset state of the content
        textOnClick && !isOpen && setContent(text)
      }}
    >
      <STrigger
        onClick={(e) => {
          if (textOnClick) {
            e.preventDefault()
            e.stopPropagation()
            // change the content on the click if the text is provided
            setContent(textOnClick)
          }

          setOpen(true)
        }}
        onPointerDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        {children}
      </STrigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sx={{ bg: "black", p: 16 }}
          css={{
            borderRadius: 6,
            maxWidth: "calc(100vw - 12px * 2)",
            zIndex: 10,
          }}
          side={side}
          align="start"
          sideOffset={3}
          alignOffset={-10}
          collisionPadding={12}
        >
          <Text sx={{ fontSize: 12, fontWeight: 400 }}>
            {textOnClick != null ? content : text}
          </Text>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
