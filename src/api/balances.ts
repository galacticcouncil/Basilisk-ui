import { useApiPromise } from "utils/network"

import { useEffect, useState } from "react"
import BN from "bn.js"

export function useBalances(address: string) {
  const api = useApiPromise()

  const [value, setValue] = useState<BN | null>(null)

  useEffect(() => {
    let cancel: () => void | undefined
    let cancelled = false
    const callback = api.query.system.account(address, (res) => {
      if (!cancelled) {
        const freeBalance = new BN(res.data.free)
        const miscFrozenBalance = new BN(res.data.miscFrozen)
        const feeFrozenBalance = new BN(res.data.feeFrozen)
        const maxFrozenBalance = miscFrozenBalance.gt(feeFrozenBalance)
          ? miscFrozenBalance
          : feeFrozenBalance

        setValue(freeBalance.sub(maxFrozenBalance))
      }
    })

    callback.then((res) => (cancel = res))
    return () => {
      cancelled = true
      cancel?.()
    }
  }, [api, address])

  return value
}
