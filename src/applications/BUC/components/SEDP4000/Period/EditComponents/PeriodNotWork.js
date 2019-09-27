import React from 'react'
import PT from 'prop-types'
import { CountrySelect, CountryFilter, Nav } from 'eessi-pensjon-ui'

const PeriodNotWork = ({ localErrors, locale, period, setCountry, t }) => (
  <Nav.Row>
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
  </Nav.Row>
)

PeriodNotWork.propTypes = {
  localErrors: PT.object,
  locale: PT.string.isRequired,
  period: PT.object,
  setCountry: PT.func,
  t: PT.func.isRequired
}

export default PeriodNotWork
