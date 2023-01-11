import { TypeRegistry } from "@polkadot/types"
import { test, expect } from "vitest"
import { getAccountResolver } from "./accountResolver"

const registry = new TypeRegistry()
test("account resolver", () => {
  const accountResolver = getAccountResolver(registry)

  expect([
    accountResolver(0).toString(), // general pot
    accountResolver(10).toString(), // global farm id: 10
    accountResolver(14).toString(), // yield farm id: 14 (global farm: 10, ammId: bXjaGnLVKE3auHRwYWn6eGQSTcRLwrMVX7paepZhb6tgy28tY)
    accountResolver(12).toString(), // global farm id: 12
    accountResolver(15).toString(), // yield farm id: 15 (global farm: 12, ammId: bXjaGnLVKE3auHRwYWn6eGQSTcRLwrMVX7paepZhb6tgy28tY)
  ]).toEqual([
    "5EYCAe5diR59yJu1zi5jdbXWTzCk5nbR65wdmsWerp64Meis",
    "5EYCAe5diR59yJu1zi8T3ryPavxifKcASoLjHJP1V4qM3zvk",
    "5EYCAe5diR59yJu1zi9Y1y9k2ufWVY1fPV6mV58MLNLG8Ku6",
    "5EYCAe5diR59yJu1zi8zXv4ZovK7aRouv9DkPBkgQiaob13o",
    "5EYCAe5diR59yJu1zi9okzhL9QLhx67Y8A3H31pBoCCzProS",
  ])
})
