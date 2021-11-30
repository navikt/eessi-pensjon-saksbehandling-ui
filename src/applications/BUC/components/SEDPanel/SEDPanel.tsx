import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import classNames from 'classnames'
import { BUCMode } from 'declarations/app'
import { slideInFromLeft } from 'nav-hoykontrast'
import { Buc, Sed } from 'declarations/buc'
import _ from 'lodash'
import styled from 'styled-components'
import SEDBody from '../SEDBody/SEDBody'
import { Accordion, Panel } from '@navikt/ds-react'

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
  border-radius: var(--navds-border-radius);
  background: var(--navds-semantic-color-component-background-alternate);
  &.new {
    background: var(--navds-color-limegreen-10) !important;
  }
`
/* export const SEDPanelExpandingPanel = styled(ExpandingPanel)`
  border: none;
  &.new div:not(.etikett) {
    background: var(--navds-color-limegreen-10) !important; !important;
  }
  &.new .ekspanderbartPanel__hode:hover div:not(.etikett) {
    background: var(--navds-color-hover) !important;
  }
  .ekspanderbartPanel__hode:hover {
    background: var(--navds-color-hover) !important;
    .panel {
      background: transparent;
    }
  }
` */

export interface SEDPanelProps {
  aktoerId: string
  buc: Buc
  className ?: string
  newSed: boolean
  onSEDNew: (buc: Buc, sed: Sed, replySed: Sed | undefined) => void
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  sed: Sed
  style: React.CSSProperties
}

const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId,
  buc,
  className,
  newSed,
  onSEDNew,
  setMode,
  sed,
  style
}: SEDPanelProps): JSX.Element => {
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
              onSEDNew={onSEDNew}
              setMode={setMode}
              sed={sed}
              style={style}
            />
          </SEDPanelDiv>
          )
        : (
          <Accordion
            className={classNames(className, { new: newSed })}
            style={style}
          >
            <Accordion.Item>
              <Accordion.Header>
                <SEDHeader
                  buc={buc}
                  onSEDNew={onSEDNew}
                  setMode={setMode}
                  sed={sed}
                />
              </Accordion.Header>
              <Accordion.Content>
                <SEDBody
                  aktoerId={aktoerId}
                  buc={buc}
                  canHaveAttachments={sedCanHaveAttachments(sed)}
                  sed={sed}
                />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
          )}
    </SEDPanelContainer>
  )
}

export default SEDPanel
