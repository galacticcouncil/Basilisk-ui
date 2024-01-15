import { create } from "zustand"
import { persist } from "zustand/middleware"

type TWarningStore = {
  warnings: {
    depeg: { visible?: boolean }
  }
  setWarnings: (key: TWarningsType, isOpen: boolean) => void
}

export type TWarningsType = keyof TWarningStore["warnings"]

export const useWarningsStore = create(
  persist<TWarningStore>(
    (set) => ({
      warnings: {
        depeg: {
          visible: true,
        },
      },
      setWarnings: (key, isOpen) =>
        set(({ warnings }) => ({
          warnings: {
            ...warnings,
            [key]: { ...warnings[key], visible: isOpen },
          },
        })),
    }),
    {
      name: "warnings",
      version: 0.1,
      getStorage: () => window.sessionStorage,
    },
  ),
)
