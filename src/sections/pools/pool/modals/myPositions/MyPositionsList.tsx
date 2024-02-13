import { useAccountDepositIds, useDeposits } from "api/deposits"
import { useMemo } from "react"
import { useAccountStore } from "state/store"
import { MyPosition } from "./MyPosition"
import { PoolBase } from "@galacticcouncil/sdk"

type Props = { pool: PoolBase; onClose: () => void }

export const MyPositionsList = ({ pool, onClose }: Props) => {
  const { account } = useAccountStore()

  const deposits = useDeposits(pool.address)
  const accountDepositIds = useAccountDepositIds(account?.address)
  const depositNftList = deposits.data?.filter((deposit) =>
    accountDepositIds.data?.some((ad) => ad.instanceId.eq(deposit.id)),
  )

  const positionsList = useMemo(() => {
    if (!depositNftList?.length) return []

    return depositNftList.map((depositNft, index) => (
      <MyPosition
        key={index}
        pool={pool}
        depositNft={depositNft}
        index={index + 1}
        onClose={onClose}
      />
    ))
  }, [depositNftList, onClose, pool])
  return <div sx={{ flex: "column", gap: 8 }}>{positionsList}</div>
}
