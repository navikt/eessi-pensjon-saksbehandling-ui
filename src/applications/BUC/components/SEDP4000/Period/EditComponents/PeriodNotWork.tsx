import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { AllowedLocaleString, Validation } from 'declarations/types'
import { AllowedLocaleStringPropType, ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'
import { useTranslation } from 'react-i18next'

export interface PeriodNotWorkProps {
  localErrors: Validation;
  locale: AllowedLocaleString;
  period: Period;
  setCountry: (e: React.ChangeEvent) => void;
}

const PeriodNotWork: React.FC<PeriodNotWorkProps> = ({
  localErrors, locale, period, setCountry
}: PeriodNotWorkProps): JSX.Element => {
  const { t } = useTranslation()
  return (
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
}

PeriodNotWork.propTypes = {
  localErrors: ValidationPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  period: PeriodPropType.isRequired,
  setCountry: PT.func.isRequired
}

export default PeriodNotWork
