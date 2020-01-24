import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import classNames from 'classnames'
import { Buc, Sed, Seds } from 'declarations/buc'
import { T } from 'declarations/types'
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
  t: T;
}

const allowedStatus: Array<string> = ['new', 'active']

const SEDPanel: React.FC<SEDPanelProps> = ({
  aktoerId, buc, className, followUpSeds, onSEDNew,
  sed, style, t
}: SEDPanelProps): JSX.Element => {
  const sedHasOption: Function = (sed: Sed): boolean => {
    return _.includes(allowedStatus, sed.status)
  }
  return (
    <div className={classNames('a-buc-c-sedpanel', className)}>
      {!sedHasOption(sed) ? (
        <SEDListHeader
          className='p-3 mb-3 s-border'
          followUpSeds={followUpSeds}
          t={t}
          sed={sed}
          style={style}
          buc={buc}
          onSEDNew={onSEDNew}
        />
      ) : (
        <Ui.Nav.EkspanderbartpanelBase
          style={style}
          className='mb-3 s-border'
          heading={
            <SEDListHeader
              followUpSeds={followUpSeds}
              t={t}
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
            t={t}
          />
        </Ui.Nav.EkspanderbartpanelBase>
      )}
    </div>
  )
}

export default SEDPanel
