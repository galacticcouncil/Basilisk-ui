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
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [deathDate, setDeathDate] = useState<Date | null>(null)
  const [birthBlock, setBirthBlock] = useState<BN | null>(null)
  const [deathBlock, setDeathBlock] = useState<BN | null>(null)

  const api = useApiPromise()

  useEffect(() => {
    if (era.isMortalEra && enabled) {
      const mortal = era.asMortalEra
      const period = new BN(mortal.period.toHex()) // Blocks validity
      const blockNumber = bnToBn(hexBlockNumber)
      if (hexBlockNumber) {
        const birth = new BN(mortal.birth(blockNumber))
        const death = new BN(mortal.death(blockNumber))
        setBirthBlock(birth)
        setDeathBlock(death)
        getTimestamp(api, birth).then((birthTimestamp) => {
          const birthDate = new Date(birthTimestamp)
          setBirthDate(birthDate)
          setDeathDate(
            addSeconds(birthDate, period.times(BLOCK_TIME).toNumber()),
          )
        })
      }
    }
  }, [enabled, api, era, hexBlockNumber])

  return {
    birthDate,
    deathDate,
    birthBlock,
    deathBlock,
  }
}
