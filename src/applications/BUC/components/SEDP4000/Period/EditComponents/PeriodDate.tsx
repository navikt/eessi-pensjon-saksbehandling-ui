import DatePicker, { DateValues } from 'components/DatePicker/DatePicker'
import { Period } from 'declarations/period'
//import { PeriodPropType } from 'declarations/period.pt'
import { Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Checkbox, Select } from 'nav-frontend-skjema'
import { Normaltekst, Undertittel } from 'nav-frontend-typografi'
import Alertstripe from 'nav-frontend-alertstriper'

export interface PeriodDateProps {
  blurEndDate: () => void;
  blurStartDate: () => void;
  localErrors: Validation;
  period: Period;
  setDateType: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setEndDate: (e: DateValues) => void;
  setStartDate: (e: DateValues) => void;
  setUncertainDate: (e: React.ChangeEvent) => void;
}

const PeriodDateFC: React.FC<PeriodDateProps> = ({
  blurEndDate, blurStartDate, localErrors, period, setDateType, setEndDate,
  setStartDate, setUncertainDate
}: PeriodDateProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <>
      {period.type === 'home' ? (
        <Alertstripe
          className='a-buc-c-sedp4000-period__alert_home mt-4 mb-4'
          type='advarsel'
        >
          {t('buc:p4000-warning-home-period')}
        </Alertstripe>) : null}
      <Undertittel className='a-buc-c-sedp4000-period__subtitle mt-5 mb-2'>
        {t(`buc:p4000-title-${period.type}`)}
      </Undertittel>
      <Normaltekst className='a-buc-c-sedp4000-period__description mb-3'>
        {t('buc:p4000-help-date')}
      </Normaltekst>
      <div className='row'>
        <div className='a-buc-c-sedp4000-period__dateType col-12 mb-2'>
          <Select
            className='a-buc-c-sedp4000-period__dateType-select flex-fill'
            id='a-buc-c-sedp4000-period__dateType-select-id'
            bredde='fullbredde'
            label={t('buc:p4000-label-date-type')}
            value={period.dateType}
            onChange={setDateType}
          >
            <option value='both'>{t('buc:p4000-label-closedPeriod')}</option>
            <option value='onlyStartDate01'>{t('buc:p4000-label-onlyStartDate01')}</option>
            <option value='onlyStartDate98'>{t('buc:p4000-label-onlyStartDate98')}</option>
          </Select>
        </div>
        <div className='a-buc-c-sedp4000-period__startDate col-sm-6 col-12 mb-2'>
          <label className='datepickerLabel skjemaelement__label'>
            {t('buc:p4000-label-start-date')}
          </label>
          <DatePicker
            onBlur={blurStartDate}
            id='a-buc-c-sedp4000-period__startdato-date'
            labels={{
              day: t('buc:p4000-label-day'),
              month: t('buc:p4000-label-month'),
              year: t('buc:p4000-label-year')
            }}
            ids={{
              day: 'a-buc-c-sedp4000-period__startdato-day',
              month: 'a-buc-c-sedp4000-period__startdato-month',
              year: 'a-buc-c-sedp4000-period__startdato-year'
            }}
            placeholders={{
              day: t('buc:p4000-placeholder-day'),
              month: t('buc:p4000-placeholder-month'),
              year: t('buc:p4000-placeholder-year')
            }}
            className='startDate pr-2'
            initialValues={period.startDate}
            onChange={setStartDate}
            error={localErrors.startDate || localErrors.timeSpan ? t((localErrors.startDate || localErrors.timeSpan)!) : undefined}
          />
        </div>
        <div className='a-buc-c-sedp4000-period__endDate col-sm-6 col-12 mb-2'>
          <label className='datepickerLabel skjemaelement__label'>
            {t('buc:p4000-label-end-date')}
          </label>
          <DatePicker
            onBlur={blurEndDate}
            disabled={period.dateType !== 'both'}
            id='a-buc-c-sedp4000-period_sluttdato-date'
            labels={{
              day: t('buc:p4000-label-day'),
              month: t('buc:p4000-label-month'),
              year: t('buc:p4000-label-year')
            }}
            ids={{
              day: 'a-buc-c-sedp4000-period__sluttdato-day',
              month: 'a-buc-c-sedp4000-period__sluttdato-month',
              year: 'a-buc-c-sedp4000-period__sluttdato-year'
            }}
            placeholders={{
              day: t('buc:p4000-placeholder-day'),
              month: t('buc:p4000-placeholder-month'),
              year: t('buc:p4000-placeholder-year')
            }}
            className='endDate pr-2'
            initialValues={period.endDate}
            onChange={setEndDate}
            error={localErrors.endDate || localErrors.timeSpan ? t((localErrors.endDate || localErrors.timeSpan)!) : undefined}
          />
        </div>
        <div className='a-buc-c-sedp4000-period__uncertainDate col-sm-6 col-12 mb-2'>
          <Checkbox
            id='a-buc-c-sedp4000-period__uncertainDate-checkbox-id'
            className='a-buc-c-sedp4000-period__uncertainDate-checkbox'
            label={t('buc:p4000-label-uncertain-date')}
            checked={period.uncertainDate || false}
            onChange={setUncertainDate}
          />
        </div>
      </div>
    </>
  )
}

PeriodDateFC.propTypes = {
  blurEndDate: PT.func.isRequired,
  blurStartDate: PT.func.isRequired,
  localErrors: ValidationPropType.isRequired,
  //period: PeriodPropType.isRequired,
  setDateType: PT.func.isRequired,
  setEndDate: PT.func.isRequired,
  setStartDate: PT.func.isRequired,
  setUncertainDate: PT.func.isRequired
}

export default PeriodDateFC
