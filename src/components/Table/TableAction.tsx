import { Button } from "components/Button/Button"
import { ReactNode } from "react"

type Props = { icon: ReactNode; onClick: () => void; children: ReactNode }

export const TableAction = ({ icon, onClick, children }: Props) => {
  return (
    <Button size="small" sx={{ p: "9px 12px" }} onClick={onClick}>
      <div sx={{ flex: "row", align: "center" }}>
        {icon}
        {children}
      </div>
    </Button>
  )
}
