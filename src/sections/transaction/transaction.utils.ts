import { useStore } from "state/store"

export function useTransaction() {
  const { createTransaction } = useStore()

  return {
    create: createTransaction,
  }
}
