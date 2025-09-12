import styled from 'styled-components'
import {Box} from '@navikt/ds-react'

export const OneLineSpan = styled.span`
  white-space: nowrap;
`

export const SeparatorSpan = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`

export const SpinnerDiv = styled.div`
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
`

export const HorizontalSeparatorSpan = styled.span<{size?: string}>`
  display: inline-block;
  margin-left: ${(props: any) => props.size || 1}rem;
`

export const HorizontalLineSeparator = styled.div`
  height: 1px;
  background: linear-gradient(90deg,
    var(--a-bg-subtle) 0%,
    var(--a-border-strong) 5%,
    var(--a-border-strong) 95%,
    var(--a-bg-subtle) 100%
  );
  width: -webkit-fill-available;
  margin-left: 2rem;
  margin-right: 2rem;
`

export const WithErrorBox = styled(Box)`
  background-color: transparent;
  border: none;
  &.error {
    margin: -4px;
    border: 4px solid var(--a-border-danger) !important;
  }
`

export const Hr = styled.div`
   background: var(--a-border-default);
   width: 100%;
   height: 1px;
`

export const HiddenDiv = styled.div`
  display: none;
`




