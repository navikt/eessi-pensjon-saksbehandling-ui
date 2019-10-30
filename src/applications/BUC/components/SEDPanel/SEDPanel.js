import React from 'react'
import { Nav } from 'eessi-pensjon-ui'
import classNames from 'classnames'
import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import SEDBody from '../SEDBody/SEDBody'
import './SEDPanel.css'

const SEDPanel = ({ actions, aktoerId, attachments, buc, followUpSeds, institutionNames, locale, onSEDNew, rinaUrl, sed, style, t }) => {
  const sedHasOption = (sed) => {
    return sed.status === 'new'
  }

  if (!sedHasOption(sed)) {
    return (
      <SEDListHeader
        className='a-buc-sedpanel p-3 mb-3 s-border'
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
    )
  }

  return (
    <Nav.EkspanderbartpanelBase
      style={style}
      className={classNames('a-buc-sedpanel', 'mb-3', 's-border')}
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
        buc={buc}
        sed={sed}
        t={t}
      />
    </Nav.EkspanderbartpanelBase>

  )
}

export default SEDPanel
