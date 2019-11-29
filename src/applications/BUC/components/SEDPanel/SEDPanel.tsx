import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import { Buc, InstitutionNames, Sed } from 'applications/BUC/declarations/buc'
import classNames from 'classnames'
import { Nav } from 'eessi-pensjon-ui'
import _ from 'lodash'
import React from 'react'
import { ActionCreators, AllowedLocaleString, T } from 'types'
import SEDBody from '../SEDBody/SEDBody'
import './SEDPanel.css'

export interface SEDPanelProps {
  actions: ActionCreators;
  aktoerId: string;
  attachments: Array<any>;
  attachmentsError: boolean;
  buc: Buc;
  className ?: string;
  followUpSeds: Array<Sed>;
  institutionNames: InstitutionNames;
  locale: AllowedLocaleString;
  onSEDNew: (buc: Buc, sed: Sed) => void;
  sed: Sed;
  style: React.CSSProperties;
  t: T;
}

const SEDPanel = ({
  actions, aktoerId, attachments, attachmentsError, buc, className, followUpSeds, institutionNames, locale, onSEDNew,
  sed, style, t
}: SEDPanelProps) => {
  const sedHasOption: Function = (sed: Sed): boolean => {
    const allowedStatus = ['new', 'active']
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
          institutionNames={institutionNames}
          locale={locale}
          style={style}
          buc={buc}
          onSEDNew={onSEDNew}
        />
      ) : (
        <Nav.EkspanderbartpanelBase
          style={style}
          className='mb-3 s-border'
          heading={
            <SEDListHeader
              followUpSeds={followUpSeds}
              t={t}
              sed={sed}
              institutionNames={institutionNames}
              locale={locale}
              buc={buc}
              onSEDNew={onSEDNew}
            />
          }
        >
          <SEDBody
            actions={actions}
            aktoerId={aktoerId}
            attachments={attachments}
            attachmentsError={attachmentsError}
            buc={buc}
            sed={sed}
            t={t}
          />
        </Nav.EkspanderbartpanelBase>
      )}
    </div>
  )
}

export default SEDPanel
