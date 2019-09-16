import { Row } from 'nav-frontend-grid'
import { Fieldset, Input, Radio } from 'nav-frontend-skjema'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { HjelpetekstAuto } from 'nav-frontend-hjelpetekst'
import CountrySelect from 'components/CountrySelect/CountrySelect'
import * as CountryFilter from 'components/CountrySelect/CountryFilter'
import React from 'react'
import PT from 'prop-types'

const PeriodWork = ({
  t,
  period,
  setWorkType,
  setWorkActivity,
  localErrors,
  setInsuranceId,
  setWorkName,
  setWorkStreet,
  setWorkCity,
  setWorkZipCode,
  setWorkRegion,
  locale,
  setCountry
}) => (
  <>
    <Row>
      <div className='col-sm-12'>
        <Fieldset
          id='a-buc-c-sedp4000-period__workType-radio-id'
          className='a-buc-c-sedp4000-period__workType-radio'
          legend={t('buc:p4000-label-work-type')}
        >
          <Radio
            label={t('buc:p4000-label-work-type-01')}
            name='period-workType'
            value='01'
            checked={period.workType === '01'}
            onChange={setWorkType}
          />
          <Radio
            label={t('buc:p4000-label-work-type-02')}
            name='period-workType'
            value='02'
            checked={period.workType === '02'}
            onChange={setWorkType}
          />
        </Fieldset>
      </div>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__yrkesaktivitet-input-id'
          className='a-buc-c-sedp4000-period__yrkesaktivitet-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-work-activity')}</UndertekstBold>
              <HjelpetekstAuto id='p4000-help-work-activity'>
                {t('buc:p4000-help-work-activity')}
              </HjelpetekstAuto>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.workActivity || ''}
          onChange={setWorkActivity}
          feil={localErrors.workActivity ? { feilmelding: t(localErrors.workActivity) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__insuranceId-input-id'
          className='a-buc-c-sedp4000-period__insuranceId-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-insurance-id')}</UndertekstBold>
              <HjelpetekstAuto id='p4000-help-insurance-id'>
                {t('buc:p4000-help-insurance-id')}
              </HjelpetekstAuto>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.insuranceId || ''}
          onChange={setInsuranceId}
          feil={localErrors.insuranceId ? { feilmelding: t(localErrors.insuranceId) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__arbeidgiversnavn-input-id'
          className='a-buc-c-sedp4000-period__arbeidgiversnavn-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-work-name')}</UndertekstBold>
              <Normaltekst className='optional'>{t('ui:optional')}</Normaltekst>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.workName || ''}
          onChange={setWorkName}
          feil={localErrors.workName ? { feilmelding: t(localErrors.workName) } : null}
        />
      </div>
    </Row>
    <Row>
      <div className='col-sm-12'>
        <Undertittel className='mt-5 mb-2'>
          {t('buc:p4000-label-work-address')}
        </Undertittel>
      </div>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__workStreet-input-id'
          className='a-buc-c-sedp4000-period__workStreet-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-work-street')}</UndertekstBold>
              <HjelpetekstAuto id='p4000-help-work-street'>
                {t('buc:p4000-help-work-street')}
              </HjelpetekstAuto>
            </div>
          }
          value={period.workStreet || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkStreet}
          feil={localErrors.workStreet ? { feilmelding: t(localErrors.workStreet) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Input
          id='a-buc-c-sedp4000-period__workCity-input-id'
          className='a-buc-c-sedp4000-period__workCity-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-work-city')}</UndertekstBold>
              <HjelpetekstAuto id='p4000-help-work-city'>
                {t('buc:p4000-help-work-city')}
              </HjelpetekstAuto>
            </div>
          }
          value={period.workCity || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkCity}
          feil={localErrors.workCity ? { feilmelding: t(localErrors.workCity) } : null}
        />
      </div>
      <div className='col-sm-6'>
        <Input
          id='a-buc-c-sedp4000-period__workZipCode-input-id'
          className='a-buc-c-sedp4000-period__workZipCode-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-work-zipcode')}</UndertekstBold>
              <HjelpetekstAuto id='p4000-help-work-zipcode'>
                {t('buc:p4000-help-work-zipcode')}
              </HjelpetekstAuto>
            </div>
          }
          value={period.workZipCode || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkZipCode}
          feil={localErrors.workZipCode ? { feilmelding: t(localErrors.workZipCode) } : null}
        />
      </div>
      <div className='col-sm-6'>
        <Input
          id='a-buc-c-sedp4000-period__workRegion-input-id'
          className='a-buc-c-sedp4000-period__workRegion-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-work-region')}</UndertekstBold>
              <HjelpetekstAuto id='p4000-help-work-region'>
                {t('buc:p4000-help-work-region')}
              </HjelpetekstAuto>
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
          onSelect={setCountry}
          error={localErrors.country}
          errorMessage={t(localErrors.country)}
        />
      </div>
    </Row>
  </>
)

PeriodWork.propTypes = {
  period: PT.object,
  locale: PT.string.isRequired,
  localErrors: PT.object,
  t: PT.func,
  setCountry: PT.func,
  setInsuranceId: PT.func,
  setWorkActivity: PT.func,
  setWorkType: PT.func,
  setWorkName: PT.func,
  setWorkStreet: PT.func,
  setWorkCity: PT.func,
  setWorkRegion: PT.func,
  setWorkZipCode: PT.func
}

export default PeriodWork
