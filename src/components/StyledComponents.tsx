import styled from 'styled-components/macro'
import { Panel } from '@navikt/ds-react'
import { PaddedHorizontallyDiv } from '@navikt/hoykontrast'

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
export const WithErrorPanel = styled(Panel)`
  padding: 0rem;
  background-color: transparent;
  border: none;
  &.error {
    margin: -4px;
    border: 4px solid var(--navds-error-summary-color-border) !important;
  }
`

export const RepeatableRow = styled(PaddedHorizontallyDiv)`
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
  min-height: 3.0rem;
  &.new {
    background-color: rgba(236, 243, 153, 0.5);
  };
  &.error {
    background-color: rgba(255, 0, 0, 0.2);
  };
  &:hover:not(.new):not(.error) {
    background-color: var(--navds-global-color-gray-100);
  }
  &:not(:hover) .control-buttons {
    position: absolute;
    margin-left: -10000px;
  }
`

export const RepeatableRowNoHorizontalPadding = styled(RepeatableRow)`
  padding-left:0;
  padding-right:0;
`

export const Hr = styled.div`
   background: var(--navds-panel-color-border);
   width: 100%;
   height: 1px;
`

export const SpacedHr = styled(Hr)`
   margin-top: 0.5rem;
   margin-bottom: 0.5rem;
`

