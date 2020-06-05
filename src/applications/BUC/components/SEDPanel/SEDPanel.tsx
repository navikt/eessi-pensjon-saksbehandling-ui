import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import classNames from 'classnames'
import { Buc, Sed, Seds } from 'declarations/buc'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import React from 'react'
import SEDBody from '../SEDBody/SEDBody'
import './SEDPanel.css'

export interface SEDPanelProps {
  aktoerId: string;
  buc: Buc;
  className ?: string;
  followUpSeds: Seds;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  sed: Sed;
  style: React.CSSProperties;
}

const activeStatus: Array<string> = ['new', 'active']
const sedWithProperties: Array<string> = []

const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId, buc, className, followUpSeds, onSEDNew,
  sed, style
}: SEDPanelProps): JSX.Element => {
  const sedCanHaveAttachments = (sed: Sed): boolean => {
    return sed !== undefined && sed.allowsAttachments && _.includes(activeStatus, sed.status)
  }

  const sedCanShowProperties = (sed: Sed): boolean => {
    return _.includes(sedWithProperties, sed.type)
  }

  const sedHasOption = (sed: Sed): boolean => {
    return sedCanHaveAttachments(sed) || sedCanShowProperties(sed)
  }

  return (
    <div className={classNames('a-buc-c-sedpanel', className)}>
      {!sedHasOption(sed) ? (
        <SEDListHeader
          className='p-3 mb-3 s-border'
          followUpSeds={followUpSeds}
          sed={sed}
          style={style}
          buc={buc}
          onSEDNew={onSEDNew}
        />
      ) : (
        <Ui.ExpandingPanel
          style={style}
          className='mb-3 s-border'
          heading={
            <SEDListHeader
              followUpSeds={followUpSeds}
              sed={sed}
              buc={buc}
              onSEDNew={onSEDNew}
            />
          }
        >
          <SEDBody
            aktoerId={aktoerId}
            buc={buc}
            sed={sed}
            canHaveAttachments={sedCanHaveAttachments(sed)}
            canShowProperties={sedCanShowProperties(sed)}
          />
        </Ui.ExpandingPanel>
      )}
    </div>
  )
}

export default SEDPanel
