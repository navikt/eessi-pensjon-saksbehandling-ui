import { Period, PeriodDate } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import { Validation } from 'declarations/types'
import { ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'
import { useTranslation } from 'react-i18next'

export interface PeriodChildProps {
  blurChildBirthDate: () => void;
  localErrors: Validation;
  period: Period;
  setChildBirthDate: (e: PeriodDate) => void;
  setChildFirstName: (e: React.ChangeEvent) => void;
  setChildLastName: (e: React.ChangeEvent) => void;
}

const PeriodChild: React.FC<PeriodChildProps> = ({
  blurChildBirthDate, localErrors, period, setChildBirthDate, setChildFirstName, setChildLastName
}: PeriodChildProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Ui.Nav.Row>
      <div className='col-sm-12'>
        <Ui.Nav.Undertittel className='mt-5 mb-2'>
          {t('buc:p4000-title-child-info')}
        </Ui.Nav.Undertittel>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input-id'
          className='a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input'
          label={
            <div className='pinfo-label'>
              <div className='pinfo-label'>
                <Ui.Nav.UndertekstBold>{t('buc:p4000-label-lastname')}</Ui.Nav.UndertekstBold>
              </div>
            </div>
          }
          value={period.childLastName || ''}
          placeholder={t('ui:writeIn')}
          onChange={setChildLastName}
          feil={localErrors.childLastName ? t(localErrors.childLastName) : false}
        />
      </div>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input-id'
          className='a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input'
          label={
            <div className='pinfo-label'>
              <div className='pinfo-label'>
                <Ui.Nav.UndertekstBold>{t('buc:p4000-label-firstname')}</Ui.Nav.UndertekstBold>
              </div>
            </div>
          }
          value={period.childFirstName || ''}
          placeholder={t('ui:writeIn')}
          onChange={setChildFirstName}
          feil={localErrors.childFirstName ? t(localErrors.childFirstName) : null}
        />
      </div>
      <div className='col-sm-6 col-12 mb-2'>
        <label className='datepickerLabel skjemaelement__label'>
          {t('buc:p4000-label-birthdate')}
        </label>
        <Ui.DatePicker
          onBlur={blurChildBirthDate}
          id='a-buc-c-sedp4000-period__omsorgforbarn-fodelsdato-date-id'
          className='a-buc-c-sedp4000-period__omsorgforbarn-fodelsdato-dat pr-2'
          labels={{ day: t('buc:p4000-label-day'), month: t('buc:p4000-label-month'), year: t('buc:p4000-label-year') }}
          ids={{
            day: 'pinfo-opphold-fodelsdato-day',
            month: 'pinfo-opphold-fodelsdato-month',
            year: 'pinfo-opphold-fodelsdato-year'
          }}
          placeholders={{
            day: t('buc:p4000-placeholder-day'),
            month: t('buc:p4000-placeholder-month'),
            year: t('buc:p4000-placeholder-year')
          }}
          initialValues={period.childBirthDate}
          onChange={setChildBirthDate}
          error={localErrors.childBirthDate || localErrors.timeSpan ? t((localErrors.childBirthDate || localErrors.timeSpan)!) : undefined}
        />
      </div>
    </Ui.Nav.Row>
  )
}

PeriodChild.propTypes = {
  blurChildBirthDate: PT.func.isRequired,
  localErrors: ValidationPropType.isRequired,
  period: PeriodPropType.isRequired,
  setChildBirthDate: PT.func.isRequired,
  setChildFirstName: PT.func.isRequired,
  setChildLastName: PT.func.isRequired
}

export default PeriodChild
