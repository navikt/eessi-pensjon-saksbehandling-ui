import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'

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
    <Ui.Nav.Row>
      <div className='col-sm-12'>
        <Ui.Nav.Fieldset
          id='a-buc-c-sedp4000-period__workType-radio-id'
          className='a-buc-c-sedp4000-period__workType-radio'
          legend={t('buc:p4000-label-work-type')}
        >
          <Ui.Nav.Radio
            id='a-buc-c-sedp4000-period__workType-radio-option-01-id'
            label={t('buc:p4000-label-work-type-01')}
            name='period-workType'
            value='01'
            checked={period.workType === '01'}
            onChange={setWorkType}
          />
          <Ui.Nav.Radio
            id='a-buc-c-sedp4000-period__workType-radio-option-02-id'
            label={t('buc:p4000-label-work-type-02')}
            name='period-workType'
            value='02'
            checked={period.workType === '02'}
            onChange={setWorkType}
          />
        </Ui.Nav.Fieldset>
      </div>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__yrkesaktivitet-input-id'
          className='a-buc-c-sedp4000-period__yrkesaktivitet-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-work-activity')}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Hjelpetekst>
                {t('buc:p4000-help-work-activity')}
              </Ui.Nav.Hjelpetekst>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.workActivity || ''}
          onChange={setWorkActivity}
          feil={localErrors.workActivity ? { feilmelding: t(localErrors.workActivity) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__insuranceId-input-id'
          className='a-buc-c-sedp4000-period__insuranceId-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-insurance-id')}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Hjelpetekst>
                {t('buc:p4000-help-insurance-id')}
              </Ui.Nav.Hjelpetekst>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.insuranceId || ''}
          onChange={setInsuranceId}
          feil={localErrors.insuranceId ? { feilmelding: t(localErrors.insuranceId) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__arbeidgiversnavn-input-id'
          className='a-buc-c-sedp4000-period__arbeidgiversnavn-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-work-name')}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Normaltekst className='optional'>{t('ui:optional')}</Ui.Nav.Normaltekst>
            </div>
          }
          placeholder={t('ui:writeIn')}
          value={period.workName || ''}
          onChange={setWorkName}
          feil={localErrors.workName ? { feilmelding: t(localErrors.workName) } : null}
        />
      </div>
    </Ui.Nav.Row>
    <Ui.Nav.Row>
      <div className='col-sm-12'>
        <Ui.Nav.Undertittel className='mt-5 mb-2'>
          {t('buc:p4000-label-work-address')}
        </Ui.Nav.Undertittel>
      </div>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__workStreet-input-id'
          className='a-buc-c-sedp4000-period__workStreet-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-work-street')}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Hjelpetekst>
                {t('buc:p4000-help-work-street')}
              </Ui.Nav.Hjelpetekst>
            </div>
          }
          value={period.workStreet || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkStreet}
          feil={localErrors.workStreet ? { feilmelding: t(localErrors.workStreet) } : null}
        />
      </div>
      <div className='col-sm-12'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__workCity-input-id'
          className='a-buc-c-sedp4000-period__workCity-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-work-city')}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Hjelpetekst>
                {t('buc:p4000-help-work-city')}
              </Ui.Nav.Hjelpetekst>
            </div>
          }
          value={period.workCity || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkCity}
          feil={localErrors.workCity ? { feilmelding: t(localErrors.workCity) } : null}
        />
      </div>
      <div className='col-sm-6'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__workZipCode-input-id'
          className='a-buc-c-sedp4000-period__workZipCode-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-work-zipcode')}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Hjelpetekst>
                {t('buc:p4000-help-work-zipcode')}
              </Ui.Nav.Hjelpetekst>
            </div>
          }
          value={period.workZipCode || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkZipCode}
          feil={localErrors.workZipCode ? { feilmelding: t(localErrors.workZipCode) } : null}
        />
      </div>
      <div className='col-sm-6'>
        <Ui.Nav.Input
          id='a-buc-c-sedp4000-period__workRegion-input-id'
          className='a-buc-c-sedp4000-period__workRegion-input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <Ui.Nav.UndertekstBold>{t('buc:p4000-label-work-region')}</Ui.Nav.UndertekstBold>
              <Ui.Nav.Hjelpetekst>
                {t('buc:p4000-help-work-region')}
              </Ui.Nav.Hjelpetekst>
            </div>
          }
          value={period.workRegion || ''}
          placeholder={t('ui:writeIn')}
          onChange={setWorkRegion}
          feil={localErrors.workRegion ? { feilmelding: t(localErrors.workRegion) } : null}
        />
      </div>
      <div className='col-sm-8 mb-2'>
        <Ui.CountrySelect
          ariaLabel={t('buc:p4000-label-country')}
          id='a-buc-c-sedp4000-period__land-select-id'
          className='a-buc-c-sedp4000-period__land-select'
          label={(
            <div className='a-buc-c-sedp4000-period__label'>
              {t('buc:p4000-label-country')}
            </div>
          )}
          locale={locale}
          includeList={Ui.CountryFilter.EEA}
          value={period.country || null}
          onOptionSelected={setCountry}
          error={localErrors.country ? t(localErrors.country) : undefined}
        />
      </div>
    </Ui.Nav.Row>
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
