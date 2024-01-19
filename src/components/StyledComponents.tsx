import styled from 'styled-components/macro'

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
    var(--a-canvas-background) 0%,
    var(--a-border) 5%,
    var(--a-border) 95%,
    var(--a-canvas-background) 100%
  );
  width: -webkit-fill-available;
  margin-left: 2rem;
  margin-right: 2rem;
`
