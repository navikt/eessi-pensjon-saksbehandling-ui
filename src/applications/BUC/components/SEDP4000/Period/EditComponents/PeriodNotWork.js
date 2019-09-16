import { Row } from 'nav-frontend-grid'
import CountrySelect from 'components/CountrySelect/CountrySelect'
import * as CountryFilter from 'components/CountrySelect/CountryFilter'
import React from 'react'
import PT from 'prop-types'

const PeriodNotWork = ({ t, period, locale, setCountry, localErrors }) => (
  <Row>
    <div className='col-sm-8 mb-2'>
      <label className='skjemaelement__label'>
        <div className='a-buc-c-sedp4000-period__label'>
          {t('buc:p4000-label-country')}
        </div>
      </label>
      <CountrySelect
        id='a-buc-c-sedp4000-period__land-select-id'
        className='a-buc-c-sedp4000-period__land-select'
        locale={locale}
        includeList={CountryFilter.EEA}
        value={period.country || null}
        onSelect={setCountry}
        error={localErrors.country}
        errorMessage={t(localErrors.country)}
      />
    </div>
  </Row>
)

PeriodNotWork.propTypes = {
  period: PT.object,
  locale: PT.string.isRequired,
  localErrors: PT.object,
  t: PT.func,
  setCountry: PT.func
}

export default PeriodNotWork
