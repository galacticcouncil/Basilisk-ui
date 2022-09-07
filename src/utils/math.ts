import { useEffect, useState } from "react"

export const loadMath = () => {
  return {
    xyk: import('@galacticcouncil/math/build/xyk/bundler'),
    lbp: import('@galacticcouncil/math/build/lbp/bundler')
  }
}

export const useMath = () => {
  const [wasm, setWasm] = useState<{
    instance: any | undefined,
    loading: boolean
  } | undefined>({
    instance: undefined,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      setWasm({
        instance: loadMath(),
        loading: false,
      });
    })();
  }, [setWasm])

  return { math: wasm?.instance, loading: wasm?.loading };
}
