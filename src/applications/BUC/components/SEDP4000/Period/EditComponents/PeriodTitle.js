import { AlertStripe } from 'components/Nav'
import { Undertittel } from 'nav-frontend-typografi'
import React from 'react'
import PT from 'prop-types'

const PeriodTitle = ({ errorMessage, mode, t }) => (
  <>
    {errorMessage ? (
      <AlertStripe
        className='a-buc-c-sedp4000-period__alert mt-4 mb-4'
        type='advarsel'
      >
        {t(errorMessage)}
      </AlertStripe>) : null}
    <Undertittel className='a-buc-c-sedp4000-period__title mt-5 mb-2'>{t('buc:p4000-title-' + mode)}</Undertittel>
  </>
)

PeriodTitle.propTypes = {
  mode: PT.string.isRequired,
  errorMessage: PT.string,
  t: PT.func
}

export default PeriodTitle
