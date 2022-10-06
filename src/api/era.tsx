import BN from "bignumber.js"
import { addSeconds } from "date-fns"
import { ExtrinsicEra } from "@polkadot/types/interfaces/extrinsics"
import { bnToBn } from "@polkadot/util"
import { useApiPromise } from "../utils/network"
import { getTimestamp } from "./timestamp"
import { useEffect, useState } from "react"
import { BLOCK_TIME } from "../utils/constants"

export const useEra = (
  era: ExtrinsicEra,
  hexBlockNumber?: string,
  enabled = true,
) => {
  const [blocks, setBlocks] =
    useState<{
      birth: BN
      death: BN
    }>()

  const [blocksDates, setBlocksDates] =
    useState<{
      birth: Date
      death: Date
    }>()

  const api = useApiPromise()

  useEffect(() => {
    if (era.isMortalEra && enabled) {
      const mortal = era.asMortalEra
      const period = new BN(mortal.period.toHex()) // Blocks validity
      const blockNumber = bnToBn(hexBlockNumber)
      if (hexBlockNumber) {
        const birth = new BN(mortal.birth(blockNumber))
        const death = new BN(mortal.death(blockNumber))
        setBlocks({
          birth,
          death,
        })
        getTimestamp(api, birth).then((birthTimestamp) => {
          const birthDate = new Date(birthTimestamp)
          setBlocksDates({
            birth: birthDate,
            death: addSeconds(birthDate, period.times(BLOCK_TIME).toNumber()),
          })
        })
      }
    }

    return () => {
      setBlocksDates(undefined)
      setBlocks(undefined)
    }
  }, [enabled, api, era, hexBlockNumber])

  return {
    blocksDates,
    blocks,
  }
}
