import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { AllowedLocaleString, T, Validation } from 'declarations/types'
import { AllowedLocaleStringPropType, TPropType, ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

export interface PeriodNotWorkProps {
  localErrors: Validation;
  locale: AllowedLocaleString;
  period: Period;
  setCountry: (e: React.ChangeEvent) => void;
  t: T
}

const PeriodNotWork: React.FC<PeriodNotWorkProps> = ({
  localErrors, locale, period, setCountry, t
}: PeriodNotWorkProps): JSX.Element => (
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
  localErrors: ValidationPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  period: PeriodPropType.isRequired,
  setCountry: PT.func.isRequired,
  t: TPropType.isRequired
}

export default PeriodNotWork
