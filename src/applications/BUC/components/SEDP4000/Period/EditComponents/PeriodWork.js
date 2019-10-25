import React from 'react'
import PT from 'prop-types'
import { CountrySelect, CountryFilter, Nav } from 'eessi-pensjon-ui'

const PeriodWork = ({
  locale,
  localErrors,
  period,
  setCountry,
  setInsuranceId,
  setWorkActivity,
  setWorkCity,
  setWorkName,
  setWorkRegion,
  setWorkStreet,
  setWorkType,
  setWorkZipCode,
  t
}) => (
  <>
    <Nav.Row>
      <div className='col-sm-12'>
        <Nav.Fieldset
          id='a-buc-c-sedp4000-period__workType-radio-id'
          className='a-buc-c-sedp4000-period__workType-radio'
          legend={t('buc:p4000-label-work-type')}
        >
          <Nav.Radio
            label={t('buc:p4000-label-work-type-01')}
            name='period-workType'
            value='01'
            checked={period.workType === '01'}
            onChange={setWorkType}
          />
          <Nav.Radio
            label={t('buc:p4000-label-work-type-02')}
            name='period-workType'
            value='02'
            checked={period.workType === '02'}
            onChange={setWorkType}
          />
        </Nav.Fieldset>
      </div>
      <div className='col-sm-12'>
        <Nav.Input
          id='a-buc-c-sedp4000-period__yrkesaktivitet-input-id'
          className='a-buc-c-sedp4000-period__yrkesaktivitet-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-work-activity')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='p4000-help-work-activity'>
                {t('buc:p4000-help-work-activity')}
              </Nav.HjelpetekstAuto>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.workActivity || ''}
          onChange={setWorkActivity}
          feil={localErrors.workActivity ? { feilmelding: t(localErrors.workActivity) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Nav.Input
          id='a-buc-c-sedp4000-period__insuranceId-input-id'
          className='a-buc-c-sedp4000-period__insuranceId-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-insurance-id')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='p4000-help-insurance-id'>
                {t('buc:p4000-help-insurance-id')}
              </Nav.HjelpetekstAuto>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.insuranceId || ''}
          onChange={setInsuranceId}
          feil={localErrors.insuranceId ? { feilmelding: t(localErrors.insuranceId) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Nav.Input
          id='a-buc-c-sedp4000-period__arbeidgiversnavn-input-id'
          className='a-buc-c-sedp4000-period__arbeidgiversnavn-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-work-name')}</Nav.UndertekstBold>
              <Nav.Normaltekst className='optional'>{t('ui:optional')}</Nav.Normaltekst>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.workName || ''}
          onChange={setWorkName}
          feil={localErrors.workName ? { feilmelding: t(localErrors.workName) } : null}
        />
      </div>
    </Nav.Row>
    <Nav.Row>
      <div className='col-sm-12'>
        <Nav.Undertittel className='mt-5 mb-2'>
          {t('buc:p4000-label-work-address')}
        </Nav.Undertittel>
      </div>
      <div className='col-sm-12'>
        <Nav.Input
          id='a-buc-c-sedp4000-period__workStreet-input-id'
          className='a-buc-c-sedp4000-period__workStreet-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-work-street')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='p4000-help-work-street'>
                {t('buc:p4000-help-work-street')}
              </Nav.HjelpetekstAuto>
            </div>
          }
          value={period.workStreet || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkStreet}
          feil={localErrors.workStreet ? { feilmelding: t(localErrors.workStreet) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Nav.Input
          id='a-buc-c-sedp4000-period__workCity-input-id'
          className='a-buc-c-sedp4000-period__workCity-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-work-city')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='p4000-help-work-city'>
                {t('buc:p4000-help-work-city')}
              </Nav.HjelpetekstAuto>
            </div>
          }
          value={period.workCity || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkCity}
          feil={localErrors.workCity ? { feilmelding: t(localErrors.workCity) } : null}
        />
      </div>
      <div className='col-sm-6'>
        <Nav.Input
          id='a-buc-c-sedp4000-period__workZipCode-input-id'
          className='a-buc-c-sedp4000-period__workZipCode-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-work-zipcode')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='p4000-help-work-zipcode'>
                {t('buc:p4000-help-work-zipcode')}
              </Nav.HjelpetekstAuto>
            </div>
          }
          value={period.workZipCode || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkZipCode}
          feil={localErrors.workZipCode ? { feilmelding: t(localErrors.workZipCode) } : null}
        />
      </div>
      <div className='col-sm-6'>
        <Nav.Input
          id='a-buc-c-sedp4000-period__workRegion-input-id'
          className='a-buc-c-sedp4000-period__workRegion-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-work-region')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='p4000-help-work-region'>
                {t('buc:p4000-help-work-region')}
              </Nav.HjelpetekstAuto>
            </div>
          }
          value={period.workRegion || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkRegion}
          feil={localErrors.workRegion ? { feilmelding: t(localErrors.workRegion) } : null}
        />
      </div>
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
          onOptionSelected={setCountry}
          error={localErrors.country ? t(localErrors.country) : undefined}
        />
      </div>
    </Nav.Row>
  </>
)

PeriodWork.propTypes = {
  locale: PT.string.isRequired,
  localErrors: PT.object,
  period: PT.object,
  setCountry: PT.func,
  setInsuranceId: PT.func,
  setWorkActivity: PT.func,
  setWorkCity: PT.func,
  setWorkName: PT.func,
  setWorkRegion: PT.func,
  setWorkStreet: PT.func,
  setWorkType: PT.func,
  setWorkZipCode: PT.func,
  t: PT.func.isRequired
}

export default PeriodWork
