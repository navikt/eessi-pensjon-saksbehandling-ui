import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { AlertStripe } from 'components/Nav'

const PeriodWarn = ({ errorMessage, period, periods, t }) => (
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
  errorMessage: PT.string,
  period: PT.object,
  periods: PT.array,
  t: PT.func.isRequired
}

export default PeriodWarn
