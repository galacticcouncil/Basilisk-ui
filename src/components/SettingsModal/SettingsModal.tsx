import { Modal } from "components/Modal/Modal"
import { useTranslation } from "react-i18next"
import { Text } from "components/Typography/Text/Text"
import { Switch } from "components/Switch/Switch"
import { useLocalStorage } from "react-use"
import { SLimitSwitch } from "components/SettingsModal/SettingsModal.styled"
import { BoxSwitch } from "components/BoxSwitch/BoxSwitch"
import { Input } from "components/Input/Input"
import { Button } from "components/Button/Button"
import { ReactComponent as ChevronRight } from "assets/icons/ChevronRight.svg"
import { Controller, useForm } from "react-hook-form"
import BN from "bignumber.js"
import { useAccountStore } from "state/store"

type Props = { isOpen: boolean; onClose: (newSettings?: Settings) => void }

export const SettingsModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation()
  const { account } = useAccountStore()

  const [settings, setSettings] = useLocalStorage<Settings>(
    `settings_${account?.address}`,
    DEFAULT_SETTINGS,
  )
  const form = useForm<Settings>({
    defaultValues: settings ?? DEFAULT_SETTINGS,
  })

  const onSubmit = (values: Settings) => {
    setSettings(values)
    onClose(values)
  }

  return (
    <Modal
      title={t("settings.modal.title")}
      open={isOpen}
      onClose={onClose}
      withoutClose
      secondaryIcon={{
        icon: <ChevronRight css={{ transform: "rotate(180deg)" }} />,
        name: "Back",
        onClick: onClose,
      }}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        sx={{
          flex: "column",
          justify: "space-between",
          pt: 20,
          height: "calc(100% - var(--modal-header-title-height))",
          minHeight: "50vh",
        }}
      >
        <div>
          <div sx={{ flex: "row", justify: "space-between" }}>
            <Text fw={500} fs={16} lh={22} color="white">
              {t("settings.modal.tradeLimit.auto")}
            </Text>
            <Controller
              name="tradeLimitAuto"
              control={form.control}
              render={({ field }) => (
                <Switch
                  disabled
                  value={field.value}
                  onCheckedChange={field.onChange}
                  label=""
                  name={field.name}
                  size="small"
                />
              )}
            />
          </div>
          <SLimitSwitch>
            <Controller
              name="tradeLimit"
              control={form.control}
              rules={{
                validate: {
                  validNumber: (value) => {
                    try {
                      if (!new BN(value).isNaN()) return true
                    } catch {}
                    return t("error.validNumber")
                  },
                  positive: (value) =>
                    new BN(value).gt(0) || t("error.positive"),
                  maxlimit: (value) =>
                    !BN(value).gt(100) || t("error.maxPercentage"),
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <BoxSwitch
                    selected={field.value}
                    options={TRADE_LIMIT_OPTS}
                    onSelect={field.onChange}
                  />
                  <Input
                    value={field.value.toString()}
                    onChange={field.onChange}
                    label=""
                    name={field.name}
                    placeholder={t("custom")}
                    error={error?.message}
                  />
                </>
              )}
            />
          </SLimitSwitch>
        </div>
        <div sx={{ flex: "row", justify: "space-between" }}>
          <Button variant="secondary" onClick={() => onClose()}>
            {t("settings.modal.cancel")}
          </Button>
          <Button variant="primary" type="submit">
            {t("settings.modal.confirm")}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

const TRADE_LIMIT_OPTS = [
  { label: "0.1%", value: 0.1 },
  { label: "0.5%", value: 0.5 },
  { label: "1%", value: 1 },
  { label: "3%", value: 3 },
]
export type Settings = { tradeLimit: number; tradeLimitAuto: boolean }
export const DEFAULT_TRADE_LIMIT = 3
export const DEFAULT_SETTINGS = {
  tradeLimit: DEFAULT_TRADE_LIMIT,
  tradeLimitAuto: false,
}
