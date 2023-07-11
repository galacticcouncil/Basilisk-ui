import styled from "@emotion/styled"
import { Text } from '../Typography/Text/Text'

export const SBlocks = styled.div`
  display: flex;
  flex-flow: column;
  row-gap: 9px;
`

const SBlock = styled.div`
  border-radius: 12px;
  padding: 31px 29px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 70px;
`

export const SBanxaBlock = styled(SBlock)`
  background-color: rgba(0, 210, 190, 0.1);
`

export const SKrakenBlock = styled(SBlock)`
   background-color: rgba(66, 43, 210, 0.26);
`

export const SCryptoBlock = styled(SBlock)`
   background-color: rgba(218, 255, 238, 0.06);
`

export const SLinkText = styled(Text)`
  white-space: nowrap;
`
