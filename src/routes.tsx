import { TradePage } from "sections/trade/TradePage"
import { XcmPage } from "sections/xcm/XcmPage"
import { PoolsPage } from "./sections/pools/PoolsPage"
import { WalletPage } from "./sections/wallet/WalletPage"

import { Navigate } from "@tanstack/react-location"

export const routes = [
  {
    path: "/",
    element: <Navigate to="/pools-and-farms" search />,
  },
  { path: "pools-and-farms", element: <PoolsPage /> },
  { path: "trade", element: <TradePage /> },
  {
    path: "wallet",
    children: [
      {
        path: "/",
        element: <Navigate to="assets" search />,
      },
      {
        path: "assets",
        element: <WalletPage />,
      },
      {
        path: "transactions",
        element: <WalletPage />,
      },
      {
        path: "vesting",
        element: <WalletPage />,
      },
    ],
  },
  {
    path: "cross-chain",
    element: <XcmPage />,
  },
  {
    path: "*",
    element: <Navigate to="/pools-and-farms" search />,
  },
]
