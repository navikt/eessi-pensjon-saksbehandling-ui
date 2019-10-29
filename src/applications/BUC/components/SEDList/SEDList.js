import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Nav } from 'eessi-pensjon-ui'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import './SEDList.css'
const sedTypes = ['X', 'H', 'P']

const SEDList = ({ buc, institutionNames, locale, onSEDNew, seds, t }) => {
  return (
    <div className='a-buc-c-sedlist'>
      {seds ? seds
        .filter(sed => sed.status !== 'empty')
        .sort((a, b) => {
          if (a.lastUpdate - b.lastUpdate > 0) return 1
          if (a.lastUpdate - b.lastUpdate < 0) return -1
          const mainCompare = parseInt(a.type.replace(/[^\d]/g, ''), 10) - parseInt(b.replace.type(/[^\d]/g, ''), 10)
          const sedTypeA = a.type.charAt(0)
          const sedTypeB = b.type.charAt(0)
          if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) > 0) return 1
          if (sedTypes.indexOf(sedTypeB) - sedTypes.indexOf(sedTypeA) < 0) return -1
          return mainCompare
        })
        .slice(0, 5).map((sed, index) => {
          return (
            <SEDHeader
              style={{ animationDelay: (0.2 * index) + 's' }}
              t={t}
              key={index}
              buc={buc}
              sed={sed}
              followUpSeds={seds.filter(_seds => _seds.parentDocumentId === sed.id)}
              locale={locale}
              border='bottom'
              onSEDNew={onSEDNew}
              institutionNames={institutionNames}
            />
          )
        }) : null}
      <div className='a-buc-c-sedlist__footer mt-2'>
        {!_.isEmpty(seds) && seds.filter(sed => sed.status !== 'empty').length > 5
          ? <Nav.Normaltekst>{t('buc:form-lastNonEmpty5')}</Nav.Normaltekst> : null}
      </div>
    </div>
  )
}

SEDList.propTypes = {
  buc: PT.object.isRequired,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  onSEDNew: PT.func.isRequired,
  seds: PT.array.isRequired,
  t: PT.func.isRequired
}

export default SEDList
