import React from 'react'
import PT from 'prop-types'
import { DatePicker, Nav } from 'eessi-pensjon-ui'

const PeriodChild = ({ blurChildBirthDate, localErrors, period, setChildBirthDate, setChildFirstName, setChildLastName, t }) => (
  <Nav.Row>
    <div className='col-sm-12'>
      <Nav.Undertittel className='mt-5 mb-2'>
        {t('buc:p4000-title-child-info')}
      </Nav.Undertittel>
      <Nav.Input
        id='a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input-id'
        className='a-buc-c-sedp4000-period__omsorgforbarn-etternavn-input'
        label={
          <div className='pinfo-label'>
            <div className='pinfo-label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-lastname')}</Nav.UndertekstBold>
            </div>
          </div>
        }
        value={period.childLastName || ''}
        placeholder={t('ui:writeIn')}
        onChange={setChildLastName}
        feil={localErrors.childLastName ? { feilmelding: t(localErrors.childLastName) } : null}
      />
    </div>
    <div className='col-sm-12'>
      <Nav.Input
        id='a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input-id'
        className='a-buc-c-sedp4000-period__omsorgforbarn-fornavn-input'
        label={
          <div className='pinfo-label'>
            <div className='pinfo-label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-firstname')}</Nav.UndertekstBold>
            </div>
          </div>
        }
        value={period.childFirstName || ''}
        placeholder={t('ui:writeIn')}
        onChange={setChildFirstName}
        feil={localErrors.childFirstName ? { feilmelding: t(localErrors.childFirstName) } : null}
      />
    </div>
    <div className='col-sm-6 col-12 mb-2'>
      <label className='datepickerLabel skjemaelement__label'>
        {t('buc:p4000-label-birthdate')}
      </label>
      <DatePicker
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
        error={localErrors.childBirthDate || localErrors.timeSpan ? t(localErrors.childBirthDate || localErrors.timeSpan) : undefined}
      />
    </div>
  </Nav.Row>
)

PeriodChild.propTypes = {
  blurChildBirthDate: PT.func,
  localErrors: PT.object,
  period: PT.object,
  setChildBirthDate: PT.func,
  setChildFirstName: PT.func,
  setChildLastName: PT.func,
  t: PT.func.isRequired
}

export default PeriodChild
