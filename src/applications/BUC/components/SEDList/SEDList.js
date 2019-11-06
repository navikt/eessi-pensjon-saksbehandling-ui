import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Nav } from 'eessi-pensjon-ui'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import { sedSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import './SEDList.css'

const SEDList = ({ buc, institutionNames, locale, onSEDNew, seds, t }) => (
  <div className='a-buc-c-sedlist'>
    {seds ? seds
      .filter(sed => sed.status !== 'empty')
      .sort(sedSorter)
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

SEDList.propTypes = {
  buc: PT.object.isRequired,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  onSEDNew: PT.func.isRequired,
  seds: PT.array.isRequired,
  t: PT.func.isRequired
}

export default SEDList
