import React from 'react'
import PT from 'prop-types'
import { AlertStripe, Undertittel } from 'components/Nav'

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
  errorMessage: PT.string,
  mode: PT.string.isRequired,
  t: PT.func.isRequired
}

export default PeriodTitle
