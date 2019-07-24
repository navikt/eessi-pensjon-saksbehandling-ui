import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import { Lenke, Normaltekst } from 'components/Nav'
import Icons from 'components/Icons'
import SEDRow from 'applications/BUC/components/SEDRow/SEDRow'

import './SEDBody.css'

const SEDBody = (props) => {
  const { t, institutionNames, seds, rinaUrl, locale, buc, onSEDNew } = props

  return <React.Fragment>
    {seds ? _(seds)
      .filter(sed => sed.status !== 'empty')
      .sortBy(['creationDate', 'type'])
      .value()
      .slice(0, 5).map((sed, index) => {
        return <SEDRow
          style={{ animationDelay: (0.2 * index) + 's' }}
          t={t}
          key={index}
          sed={sed}
          locale={locale}
          border={'bottom'}
          onSEDNew={onSEDNew}
          institutionNames={institutionNames}
        />
      }) : null}
    <div className='a-buc-c-sedbody__footer mt-2'>
      <Lenke
        id='a-buc-c-sedbody__gotorina-link'
        className='a-buc-c-sedbody__gotorina'
        href={rinaUrl + buc.caseId}
        target='rinaWindow'>
        <div className='d-flex'>
          <Icons className='mr-2' color='#0067C5' kind='outlink' />
          <Normaltekst>{t('buc:form-seeSedInRina')}</Normaltekst>
        </div>
      </Lenke>
      {!_.isEmpty(seds) && seds.filter(sed => sed.status !== 'empty').length > 5
        ? <Normaltekst>{t('buc:form-lastNonEmpty5')}</Normaltekst> : null}
    </div>
  </React.Fragment>
}

SEDBody.propTypes = {
  t: PT.func.isRequired,
  seds: PT.array.isRequired,
  rinaUrl: PT.string.isRequired,
  locale: PT.string.isRequired,
  buc: PT.object.isRequired
}

export default SEDBody
