import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

const PeriodNotWork = ({ localErrors, locale, period, setCountry, t }) => (
  <Ui.Nav.Row>
    <div className='col-sm-8 mb-2'>
      <Ui.CountrySelect
        ariaLabel={t('buc:p4000-label-country')}
        id='a-buc-c-sedp4000-period__land-select-id'
        className='a-buc-c-sedp4000-period__land-select'
        locale={locale}
        label={(
          <div className='a-buc-c-sedp4000-period__label'>
            {t('buc:p4000-label-country')}
          </div>
        )}
        includeList={Ui.CountryFilter.EEA}
        value={period.country || null}
        onOptionSelected={setCountry}
        error={localErrors.country ? t(localErrors.country) : undefined}
      />
    </div>
  </Ui.Nav.Row>
)

PeriodNotWork.propTypes = {
  localErrors: PT.object,
  locale: PT.string.isRequired,
  period: PT.object,
  setCountry: PT.func,
  t: PT.func.isRequired
}

export default PeriodNotWork
