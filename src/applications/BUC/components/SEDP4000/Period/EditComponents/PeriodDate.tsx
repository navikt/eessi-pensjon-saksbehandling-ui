import { Period, PeriodDate } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { T, Validation } from 'declarations/types'
import { TPropType, ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

export interface PeriodDateProps {
  blurEndDate: () => void;
  blurStartDate: () => void;
  localErrors: Validation;
  period: Period;
  setDateType: (e: Event) => void;
  setEndDate: (e: PeriodDate) => void;
  setStartDate: (e: PeriodDate) => void;
  setUncertainDate: (e: React.ChangeEvent) => void;
  t: T
}

const PeriodDateFC: React.FC<PeriodDateProps> = ({
  blurEndDate, blurStartDate, localErrors, period, setDateType, setEndDate,
  setStartDate, setUncertainDate, t
}: PeriodDateProps): JSX.Element => (
  <>
    {period.type === 'home' ? (
      <Ui.Nav.AlertStripe
        className='a-buc-c-sedp4000-period__alert_home mt-4 mb-4'
        type='advarsel'
      >
        {t('buc:p4000-warning-home-period')}
      </Ui.Nav.AlertStripe>) : null}
    <Ui.Nav.Undertittel className='a-buc-c-sedp4000-period__subtitle mt-5 mb-2'>
      {t(`buc:p4000-title-${period.type}`)}
    </Ui.Nav.Undertittel>
    <Ui.Nav.Normaltekst className='a-buc-c-sedp4000-period__description mb-3'>
      {t('buc:p4000-help-date')}
    </Ui.Nav.Normaltekst>
    <Ui.Nav.Row>
      <div className='a-buc-c-sedp4000-period__dateType col-12 mb-2'>
        <Ui.Nav.Select
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
        </Ui.Nav.Select>
      </div>
      <div className='a-buc-c-sedp4000-period__startDate col-sm-6 col-12 mb-2'>
        <label className='datepickerLabel skjemaelement__label'>
          {t('buc:p4000-label-start-date')}
        </label>
        <Ui.DatePicker
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
        <Ui.DatePicker
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
        <Ui.Nav.Checkbox
          id='a-buc-c-sedp4000-period__uncertainDate-checkbox-id'
          className='a-buc-c-sedp4000-period__uncertainDate-checkbox'
          label={t('buc:p4000-label-uncertain-date')}
          checked={period.uncertainDate || false}
          onChange={setUncertainDate}
        />
      </div>
    </Ui.Nav.Row>
  </>
)

PeriodDateFC.propTypes = {
  blurEndDate: PT.func.isRequired,
  blurStartDate: PT.func.isRequired,
  localErrors: ValidationPropType.isRequired,
  period: PeriodPropType.isRequired,
  setDateType: PT.func.isRequired,
  setEndDate: PT.func.isRequired,
  setStartDate: PT.func.isRequired,
  setUncertainDate: PT.func.isRequired,
  t: TPropType.isRequired
}

export default PeriodDateFC
