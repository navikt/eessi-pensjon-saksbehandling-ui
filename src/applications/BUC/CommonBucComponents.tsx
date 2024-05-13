import styled from "styled-components";
import {LinkPanel, Panel} from "@navikt/ds-react";
import {animationClose, animationOpen, slideInFromLeft} from "@navikt/hoykontrast";


export const ProgressBarDiv = styled.div`
 flex: 2;
 margin-left: 1rem;
 margin-right: 1rem;
 height: 40px;
 max-width: 50%;
`

export const BUCLoadingDiv = styled.div``

export const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  &.error {
    align-items: center !important;
  }
`

export const HiddenDiv = styled.div`
  position: absolute;
  left: -99999px;
`

export const BUCListDiv = styled.div``

export const BUCListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`

export const BadBucDiv = styled.div`
  width: 100%;
  padding: 0rem;
  margin-bottom: 1rem;
  .alertstripe--tekst {
    max-width: 100% !important;
  }
`
export const BucLenkePanel = styled(LinkPanel)`
  transform: translateX(-20px);
  opacity: 0;
  animation: ${slideInFromLeft} 0.2s forwards;
  background: var(--a-surface-default);
  margin-bottom: 1rem;
  .navds-link-panel__content {
    width: 100%;
  }
  &.new {
    background: var(--a-limegreen-100) !important;
  }
  &:hover {
    background: var(--a-surface-action-subtle-hover);
  }
`

export const BUCStartDiv = styled.div`
  max-height: 0;
  height: 0%;
  overflow: hidden;
  &.close {
    will-change: max-height, height;
    max-height: 0;
    animation: ${animationClose(150)} 400ms ease;
  }
  &.open {
    will-change: max-height, height;
    max-height: 50em;
    animation: ${animationOpen(150)} 400ms ease;
  }
`

export const BUCNewDiv = styled(Panel)`
  padding: 2rem !important;
`
