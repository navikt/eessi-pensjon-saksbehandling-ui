import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { Icons, Nav } from 'eessi-pensjon-ui'
import SEDRow from 'applications/BUC/components/SEDRow/SEDRow'

import './SEDBody.css'

const SEDBody = ({ buc, institutionNames, locale, onSEDNew, rinaUrl, seds, t }) => {
  return (
    <>
      {seds ? _(seds)
        .filter(sed => sed.status !== 'empty')
        .sortBy(['creationDate', 'type'])
        .value()
        .slice(0, 5).map((sed, index) => {
          return (
            <SEDRow
              style={{ animationDelay: (0.2 * index) + 's' }}
              t={t}
              key={index}
              sed={sed}
              followUpSeds={seds.filter(_seds => _seds.parentDocumentId === sed.id)}
              locale={locale}
              border='bottom'
              onSEDNew={() => onSEDNew(sed)}
              institutionNames={institutionNames}
            />
          )
        }) : null}
      <div className='a-buc-c-sedbody__footer mt-2'>
        <Nav.Lenke
          id='a-buc-c-sedbody__gotorina-link'
          className='a-buc-c-sedbody__gotorina'
          href={rinaUrl + buc.caseId}
          target='rinaWindow'
        >
          <div className='d-flex'>
            <Icons className='mr-2' color='#0067C5' kind='outlink' />
            <Nav.Normaltekst>{t('buc:form-seeSedInRina')}</Nav.Normaltekst>
          </div>
        </Nav.Lenke>
        {!_.isEmpty(seds) && seds.filter(sed => sed.status !== 'empty').length > 5
          ? <Nav.Normaltekst>{t('buc:form-lastNonEmpty5')}</Nav.Normaltekst> : null}
      </div>
    </>
  )
}

SEDBody.propTypes = {
  buc: PT.object.isRequired,
  institutionNames: PT.object,
  locale: PT.string.isRequired,
  onSEDNew: PT.func.isRequired,
  rinaUrl: PT.string.isRequired,
  seds: PT.array.isRequired,
  t: PT.func.isRequired
}

export default SEDBody
