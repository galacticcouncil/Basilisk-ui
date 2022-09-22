import { FC, useState } from "react"
import { Modal } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import {
  SSlippage,
  STradingPairContainer,
} from "sections/pools/pool/modals/removeLiquidity/PoolRemoveLiquidity.styled"
import { Button } from "components/Button/Button"
import { Heading } from "components/Typography/Heading/Heading"
import { Slider } from "components/Slider/Slider"
import { BoxSwitch } from "components/BoxSwitch/BoxSwitch"
import { Input } from "components/Input/Input"
import { Text } from "components/Typography/Text/Text"
import { Box } from "components/Box/Box"
import { PoolRemoveLiquidityReward } from "sections/pools/pool/modals/removeLiquidity/reward/PoolRemoveLiquidityReward"
import { Separator } from "components/Separator/Separator"
import { useForm, Controller } from "react-hook-form"
import { useStore } from "state/store"
import { WalletConnectButton } from "sections/wallet/connect/modal/WalletConnectButton"
import { FormValues } from "utils/types"
import { PoolBase } from "@galacticcouncil/sdk"

const options = [
  { label: "24%", value: 24 },
  { label: "50%", value: 50 },
  { label: "75%", value: 75 },
  { label: "MAX", value: 100 },
]

type Props = {
  isOpen: boolean
  onClose: () => void
  pool: PoolBase
}

const PoolRemoveLiquidityInput = (props: {
  value: number
  onChange: (value: number) => void
}) => {
  const [input, setInput] = useState("")

  const onChange = (value: string) => {
    setInput(value)

    const parsedValue = Number.parseFloat(value)
    if (!Number.isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      props.onChange(parsedValue)
    }
  }

  const onSelect = (value: number) => {
    setInput("")
    props.onChange(value)
  }

  return (
    <>
      <Slider
        value={[props.value]}
        onChange={([val]) => onSelect(val)}
        min={0}
        max={100}
        step={1}
      />

      <SSlippage>
        <BoxSwitch
          options={options}
          selected={props.value}
          onSelect={onSelect}
        />
        <Input
          value={input}
          onChange={onChange}
          name="custom"
          label="Custom"
          placeholder="Custom"
        />
      </SSlippage>
    </>
  )
}

export const PoolRemoveLiquidity: FC<Props> = ({ isOpen, onClose, pool }) => {
  const { t } = useTranslation()
  const form = useForm<{ value: number }>({ defaultValues: { value: 25 } })
  const { account } = useStore()

  async function handleSubmit(data: FormValues<typeof form>) {
    if (!account) throw new Error("Missing account")
  }

  return (
    <Modal
      title={t("pools.removeLiquidity.modal.title")}
      open={isOpen}
      onClose={onClose}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Heading fs={42} lh={52} mb={16} mt={16}>
          {form.watch("value")}%
        </Heading>

        <Controller
          name="value"
          control={form.control}
          render={({ field }) => (
            <PoolRemoveLiquidityInput
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <STradingPairContainer>
          <Text color="neutralGray400">
            {t("pools.removeLiquidity.modal.receive")}
          </Text>

          <PoolRemoveLiquidityReward
            name="Token"
            symbol={pool.tokens[0].symbol}
            amount={1000000.579187897408}
          />
          <PoolRemoveLiquidityReward
            name="Token"
            symbol={pool.tokens[1].symbol}
            amount={34456.56}
          />
        </STradingPairContainer>

        <Box mb={32} mt={16}>
          <Box flex acenter justify="space-between">
            <Text color="neutralGray500" fs={15}>
              {t("pools.removeLiquidity.modal.cost")}
            </Text>
            <Box flex acenter gap={4}>
              <Text fs={14}>≈ 12 BSX</Text>
              <Text fs={14} color="primary400">
                (2%)
              </Text>
            </Box>
          </Box>
          <Separator mt={8} mb={8} size={2} />
          <Box flex acenter justify="space-between">
            <Text fs={15} color="neutralGray500">
              {t("pools.removeLiquidity.modal.price")}
            </Text>
            <Text fs={14}>1 BSX = 225 KAR</Text>
          </Box>
        </Box>

        {account ? (
          <Button type="submit" variant="primary" fullWidth>
            {t("pools.removeLiquidity.modal.confirm")}
          </Button>
        ) : (
          <WalletConnectButton css={{ marginTop: 20, width: "100%" }} />
        )}
      </form>
    </Modal>
  )
}
