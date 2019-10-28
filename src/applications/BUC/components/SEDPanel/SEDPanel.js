import React from 'react'
import { Nav } from 'eessi-pensjon-ui'
import classNames from 'classnames'
import SEDHeader from '../SEDHeader/SEDHeader'
import SEDBody from '../SEDBody/SEDBody'

const SEDPanel = ({ buc, institutionNames, locale, onSEDNew, rinaUrl, sed, t }) => {
  const sedHasOption = (sed) => {
    return sed.status === 'new'
  }

  if (!sedHasOption(sed)) {
    return (
      <SEDHeader
        className='p-3 s-border'
        t={t}
        sed={sed}
        rinaUrl={rinaUrl}
        institutionNames={institutionNames}
        locale={locale}
        buc={buc}
        onSEDNew={onSEDNew}
      />
    )
  }

  return (
    <Nav.EkspanderbartpanelBase
      className={classNames('a-buc-sedpanel', 'mb-3', 's-border')}
      heading={
        <SEDHeader
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
      <SEDBody t={t} sed={sed} />
    </Nav.EkspanderbartpanelBase>

  )
}

export default SEDPanel
