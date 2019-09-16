import _ from 'lodash'
import { AlertStripe } from 'components/Nav'
import React from 'react'
import PT from 'prop-types'

const PeriodWarn = ({ period, periods, t, errorMessage }) => (
  <>
    {!period.type && _.isEmpty(periods) ? (
      <AlertStripe
        className='mt-4 mb-4' type='advarsel'
      >
        {t('buc:p4000-warning-one-period')}
      </AlertStripe>
    )
      : null}
    {errorMessage ? <AlertStripe className='mt-4 mb-4' type='advarsel'>{t(errorMessage)}</AlertStripe> : null}
  </>
)

PeriodWarn.propTypes = {
  period: PT.object,
  periods: PT.array,
  errorMessage: PT.string,
  t: PT.func
}

export default PeriodWarn
