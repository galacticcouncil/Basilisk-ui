import { useStore } from "state/store"

export function useTransaction() {
  const { createTransaction, transactions } = useStore()

  return {
    create: createTransaction,
    pendingTransactions: transactions,
  }
}
