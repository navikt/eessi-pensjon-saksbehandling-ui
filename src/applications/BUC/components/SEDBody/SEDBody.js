import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import { Normaltekst } from 'components/ui/Nav'
import SEDRow from 'applications/BUC/components/SEDRow/SEDRow'

const SEDBody = (props) => {
  const { t, seds, rinaUrl, locale, buc, onSEDNew } = props

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
          rinaUrl={rinaUrl}
          rinaId={buc.caseId}
          locale={locale}
          border
          onSEDNew={onSEDNew}
        />
      }) : null}
    <Normaltekst>{t('buc:form-lastNonEmpty5')}</Normaltekst>
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
