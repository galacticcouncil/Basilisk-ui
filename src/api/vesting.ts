import { AccountId32 } from "@polkadot/types/interfaces"
import { useApiPromise } from "../utils/network"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "../utils/queryKeys"
import { undefinedNoop } from "../utils/helpers"
import { ApiPromise } from "@polkadot/api"
import { Maybe } from "../utils/types"
import { useBestNumber } from "./chain"
import { u32 } from "@polkadot/types"
import BigNumber from "bignumber.js"
import { useAccountStore } from "../state/store"
import { BN_0 } from "../utils/constants"

export const useVestingSchedules = (address: Maybe<AccountId32 | string>) => {
  const api = useApiPromise()
  return useQuery(
    QUERY_KEYS.vestingSchedules(address),
    address != null ? getVestingSchedules(api, address) : undefinedNoop,
    { enabled: !!address },
  )
}

export const useVestingLockBalance = (address: Maybe<AccountId32 | string>) => {
  const api = useApiPromise()
  return useQuery(
    QUERY_KEYS.vestingLockBalance(address),
    address != null ? getVestingLockBalance(api, address) : undefinedNoop,
  )
}

const getVestingLockBalance =
  (api: ApiPromise, address: AccountId32 | string) => async () => {
    const data = await api.query.balances.locks(address)
    return (
      data
        .find((lock) => lock.id.toString() === "ormlvest")
        ?.amount.toBigNumber() ?? BN_0
    )
  }

export const getVestingSchedules =
  (api: ApiPromise, address: AccountId32 | string) => async () => {
    const data = await api.query.vesting.vestingSchedules(address)
    return data.map((value) => {
      return {
        start: value.start,
        period: value.period,
        periodCount: value.periodCount,
        perPeriod: new BigNumber(value.perPeriod.toHex()),
      }
    })
  }

export type ScheduleType = Awaited<
  ReturnType<ReturnType<typeof getVestingSchedules>>
>[number]

const getScheduleClaimableBalance = (
  schedule: ScheduleType,
  blockNumber: u32,
) => {
  const start = schedule.start.toBigNumber()
  const period = schedule.period.toBigNumber()
  const periodCount = schedule.periodCount.toBigNumber()
  const blockNumberAsBigNumber = blockNumber.toBigNumber()

  const numOfPeriods = blockNumberAsBigNumber.minus(start).div(period)
  const vestedOverPeriods = numOfPeriods.times(schedule.perPeriod)
  const originalLock = periodCount.times(schedule.perPeriod)

  return originalLock.minus(vestedOverPeriods)
}

export const useVestingClaimableBalance = () => {
  const { account } = useAccountStore()
  const vestingSchedulesQuery = useVestingSchedules(account?.address)
  const vestingLockBalanceQuery = useVestingLockBalance(account?.address)
  const bestNumberQuery = useBestNumber()

  if (
    vestingSchedulesQuery.data &&
    bestNumberQuery.data &&
    vestingLockBalanceQuery.data
  ) {
    const futureLocks = vestingSchedulesQuery.data.reduce((acc, cur) => {
      acc.plus(
        getScheduleClaimableBalance(
          cur,
          bestNumberQuery.data.relaychainBlockNumber,
        ),
      )
      return acc
    }, BN_0)

    return futureLocks.minus(vestingLockBalanceQuery.data)
  }

  return BN_0
}
