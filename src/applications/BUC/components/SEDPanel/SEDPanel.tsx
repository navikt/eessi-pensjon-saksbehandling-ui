import SEDHeader from 'src/applications/BUC/components/SEDHeader/SEDHeader'
import classNames from 'classnames'
import { BUCMode } from 'src/declarations/app'
import { Buc, Sed } from 'src/declarations/buc'
import _ from 'lodash'
import SEDAttachmentsPanel from 'src/applications/BUC/components/SEDAttachmentsPanel/SEDAttachmentsPanel'
import { Accordion, Box } from '@navikt/ds-react'
import {JSX, useState} from "react";
import styles from './SEDPanel.module.css'

const activeStatus: Array<string> = ['new', 'active']

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
    <Box className={styles.sedPanelContainer} borderWidth="1" borderColor="border-default" background="surface-default">
      {!sedCanHaveAttachments(sed)
        ? (
          <div className={classNames(styles.sedHeaderContainer, className, { [styles.new]: newSed })}>
            <SEDHeader
              buc={buc}
              onFollowUpSed={onFollowUpSed}
              setMode={setMode}
              sed={sed}
              style={style}
            />
          </div>
          )
        : (
          <>
            <div className={classNames(styles.sedHeaderContainer, className, { [styles.new]: newSed })}>
              <SEDHeader
                buc={buc}
                onFollowUpSed={onFollowUpSed}
                setMode={setMode}
                sed={sed}
                style={style}
                toggleOpen={_setOpen}
                toggleState={_open}
              />
            </div>
            <Accordion
              className={classNames(styles.sedPanelAccordion, className, { [styles.new]: newSed })}
              style={style}
            >
              <Accordion.Item open={_open}>
                <Accordion.Content>
                  <SEDAttachmentsPanel
                    aktoerId={aktoerId}
                    buc={buc}
                    canHaveAttachments={sedCanHaveAttachments(sed)}
                    sed={sed}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </>
          )}
    </Box>
  )
}

export default SEDPanel
