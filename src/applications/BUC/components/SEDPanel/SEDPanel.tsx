import SEDHeader from 'src/applications/BUC/components/SEDHeader/SEDHeader'
import classNames from 'classnames'
import { BUCMode } from 'src/declarations/app'
import { slideInFromLeft } from '@navikt/hoykontrast'
import { Buc, Sed } from 'src/declarations/buc'
import _ from 'lodash'
import styled from 'styled-components'
import SEDBody from '../SEDBody/SEDBody'
import { Accordion, Panel } from '@navikt/ds-react'
import {useState} from "react";

const activeStatus: Array<string> = ['new', 'active']

export const SEDPanelContainer = styled(Panel)`
  transform: translateX(-20px);
  opacity: 0;
  padding: 0;
  animation: ${slideInFromLeft(20)} 0.2s forwards;
  margin-bottom: 1rem;
`
export const SEDPanelDiv = styled.div`
  padding: 1rem;
  border-radius: 4px;
  background: var(--a-surface-default);
  &.new {
    background: var(--a-limegreen-100) !important;
  }
`

export const MyAccordion = styled(Accordion)`
  &.new {
    background: var(--a-limegreen-100) !important;
  }
  .navds-accordion__header{
    visibility:hidden;
    padding: 0;
    margin: 0;
    max-height: 0px;
  }
`

export interface SEDPanelProps {
  aktoerId: string
  buc: Buc
  className ?: string
  newSed: boolean
  onFollowUpSed: (buc: Buc, sed: Sed, followUpSeds: Array<Sed> | undefined) => void
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  sed: Sed
  style: React.CSSProperties
}

const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId,
  buc,
  className,
  newSed,
  onFollowUpSed,
  setMode,
  sed,
  style
}: SEDPanelProps): JSX.Element => {
  const [_open, _setOpen] = useState(false)

  const sedCanHaveAttachments = (sed: Sed): boolean => {
    return !buc.readOnly && sed !== undefined && sed.allowsAttachments && _.includes(activeStatus, sed.status)
  }

  return (
    <SEDPanelContainer border>
      {!sedCanHaveAttachments(sed)
        ? (
          <SEDPanelDiv className={classNames(className, { new: newSed })}>
            <SEDHeader
              buc={buc}
              onFollowUpSed={onFollowUpSed}
              setMode={setMode}
              sed={sed}
              style={style}
            />
          </SEDPanelDiv>
          )
        : (
          <>
            <SEDPanelDiv className={classNames(className, { new: newSed })}>
              <SEDHeader
                buc={buc}
                onFollowUpSed={onFollowUpSed}
                setMode={setMode}
                sed={sed}
                style={style}
                toggleOpen={_setOpen}
                toggleState={_open}
              />
            </SEDPanelDiv>
            <MyAccordion
              className={classNames(className, { new: newSed })}
              style={style}
            >
              <Accordion.Item open={_open}>
                <Accordion.Header>&nbsp;</Accordion.Header>
                <Accordion.Content>
                  <SEDBody
                    aktoerId={aktoerId}
                    buc={buc}
                    canHaveAttachments={sedCanHaveAttachments(sed)}
                    sed={sed}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </MyAccordion>
          </>
          )}
    </SEDPanelContainer>
  )
}

export default SEDPanel
