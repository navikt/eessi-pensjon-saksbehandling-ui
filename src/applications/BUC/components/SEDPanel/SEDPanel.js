import React from 'react'
import { Nav } from 'eessi-pensjon-ui'
import classNames from 'classnames'
import SEDHeader from '../SEDHeader/SEDHeader'
import SEDBody from '../SEDBody/SEDBody'

const SEDPanel = ({ buc, locale, onSEDNew, rinaUrl, sed, t }) => {
  return (
    <Nav.EkspanderbartpanelBase
      className={classNames('a-buc-sedpanel', 'mb-3', 's-border')}
      heading={
        <SEDHeader
          t={t}
          sed={sed}
          rinaUrl={rinaUrl}
          locale={locale}
          buc={buc}
          onSEDNew={onSEDNew}
        />
      }
    >
      <SEDBody t={t} />
    </Nav.EkspanderbartpanelBase>

  )
}

export default SEDPanel
