import React from 'react'
import { Nav } from 'eessi-pensjon-ui'
import _ from 'lodash'
import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import SEDBody from '../SEDBody/SEDBody'
import './SEDPanel.css'

const SEDPanel = ({
  actions, aktoerId, attachments, attachmentsError, buc, followUpSeds, institutionNames, locale, onSEDNew,
  rinaUrl, sed, style, t
}) => {
  const sedHasOption = (sed) => {
    const allowedStatus = ['new', 'active']
    return _.includes(allowedStatus, sed.status)
  }

  return (
    <div className='a-buc-c-sedpanel'>
      {!sedHasOption(sed) ? (
        <SEDListHeader
          className='p-3 mb-3 s-border'
          followUpSeds={followUpSeds}
          t={t}
          sed={sed}
          rinaUrl={rinaUrl}
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
              rinaUrl={rinaUrl}
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
