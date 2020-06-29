import { Period } from 'declarations/period'
//import { PeriodPropType } from 'declarations/period.pt'
import { AllowedLocaleString, Validation } from 'declarations/types'
import { AllowedLocaleStringPropType, ValidationPropType } from 'declarations/types.pt'
import React from 'react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Row } from 'nav-frontend-grid'
import { Input, Radio } from 'nav-frontend-skjema'
import Panel from 'nav-frontend-paneler'
import { Normaltekst, Undertittel, UndertekstBold } from 'nav-frontend-typografi'
import Hjelpetekst from 'nav-frontend-hjelpetekst'
import CountrySelect from 'landvelger'
import { CountryFilter } from 'land-verktoy'

export interface PeriodWorkProps {
  locale: AllowedLocaleString;
  localErrors: Validation;
  period: Period;
  setCountry: (e: React.ChangeEvent) => void;
  setInsuranceId: (e: React.ChangeEvent) => void;
  setWorkActivity: (e: React.ChangeEvent) => void;
  setWorkCity: (e: React.ChangeEvent) => void;
  setWorkName: (e: React.ChangeEvent) => void;
  setWorkRegion: (e: React.ChangeEvent) => void;
  setWorkStreet: (e: React.ChangeEvent) => void;
  setWorkType: (e: React.ChangeEvent) => void;
  setWorkZipCode: (e: React.ChangeEvent) => void;
}

const PeriodWork: React.FC<PeriodWorkProps> = ({
  locale, localErrors, period, setCountry, setInsuranceId, setWorkActivity, setWorkCity,
  setWorkName, setWorkRegion, setWorkStreet, setWorkType, setWorkZipCode
}: PeriodWorkProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <>
      <Row>
        <div className='col-sm-12'>
          <Panel
            id='a-buc-c-sedp4000-period__workType-radio-id'
            className='a-buc-c-sedp4000-period__workType-radio'
          >
            <Radio
              id='a-buc-c-sedp4000-period__workType-radio-option-01-id'
              label={t('buc:p4000-label-work-type-01')}
              name='period-workType'
              value='01'
              checked={period.workType === '01'}
              onChange={setWorkType}
            />
            <Radio
              id='a-buc-c-sedp4000-period__workType-radio-option-02-id'
              label={t('buc:p4000-label-work-type-02')}
              name='period-workType'
              value='02'
              checked={period.workType === '02'}
              onChange={setWorkType}
            />
          </Panel>
        </div>
        <div className='col-sm-12'>
          <Input
            id='a-buc-c-sedp4000-period__yrkesaktivitet-input-id'
            className='a-buc-c-sedp4000-period__yrkesaktivitet-input'
            label={
              <div className='a-buc-c-sedp4000-period__label'>
                <UndertekstBold>{t('buc:p4000-label-work-activity')}</UndertekstBold>
                <Hjelpetekst>
                  {t('buc:p4000-help-work-activity')}
                </Hjelpetekst>
              </div>
            }
            placeholder={t('ui:writeIn')}
            value={period.workActivity || ''}
            onChange={setWorkActivity}
            feil={localErrors.workActivity ? t(localErrors.workActivity) : null}
          />
        </div>
        <div className='col-sm-12'>
          <Input
            id='a-buc-c-sedp4000-period__insuranceId-input-id'
            className='a-buc-c-sedp4000-period__insuranceId-input'
            label={
              <div className='a-buc-c-sedp4000-period__label'>
                <UndertekstBold>{t('buc:p4000-label-insurance-id')}</UndertekstBold>
                <Hjelpetekst>
                  {t('buc:p4000-help-insurance-id')}
                </Hjelpetekst>
              </div>
            }
            placeholder={t('ui:writeIn')}
            value={period.insuranceId || ''}
            onChange={setInsuranceId}
            feil={localErrors.insuranceId ? t(localErrors.insuranceId) : null}
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
            feil={localErrors.workName ? t(localErrors.workName) : null}
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
                <Hjelpetekst>
                  {t('buc:p4000-help-work-street')}
                </Hjelpetekst>
              </div>
            }
            value={period.workStreet || ''}
            placeholder={t('ui:writeIn')}
            onChange={setWorkStreet}
            feil={localErrors.workStreet ? t(localErrors.workStreet) : null}
          />
        </div>
        <div className='col-sm-12'>
          <Input
            id='a-buc-c-sedp4000-period__workCity-input-id'
            className='a-buc-c-sedp4000-period__workCity-input'
            label={
              <div className='a-buc-c-sedp4000-period__label'>
                <UndertekstBold>{t('buc:p4000-label-work-city')}</UndertekstBold>
                <Hjelpetekst>
                  {t('buc:p4000-help-work-city')}
                </Hjelpetekst>
              </div>
            }
            value={period.workCity || ''}
            placeholder={t('ui:writeIn')}
            onChange={setWorkCity}
            feil={localErrors.workCity ? t(localErrors.workCity) : null}
          />
        </div>
        <div className='col-sm-6'>
          <Input
            id='a-buc-c-sedp4000-period__workZipCode-input-id'
            className='a-buc-c-sedp4000-period__workZipCode-input'
            label={
              <div className='a-buc-c-sedp4000-period__label'>
                <UndertekstBold>{t('buc:p4000-label-work-zipcode')}</UndertekstBold>
                <Hjelpetekst>
                  {t('buc:p4000-help-work-zipcode')}
                </Hjelpetekst>
              </div>
            }
            value={period.workZipCode || ''}
            placeholder={t('ui:writeIn')}
            onChange={setWorkZipCode}
            feil={localErrors.workZipCode ? t(localErrors.workZipCode) : null}
          />
        </div>
        <div className='col-sm-6'>
          <Input
            id='a-buc-c-sedp4000-period__workRegion-input-id'
            className='a-buc-c-sedp4000-period__workRegion-input'
            label={
              <div className='a-buc-c-sedp4000-period__label'>
                <UndertekstBold>{t('buc:p4000-label-work-region')}</UndertekstBold>
                <Hjelpetekst>
                  {t('buc:p4000-help-work-region')}
                </Hjelpetekst>
              </div>
            }
            value={period.workRegion || ''}
            placeholder={t('ui:writeIn')}
            onChange={setWorkRegion}
            feil={localErrors.workRegion ? t(localErrors.workRegion) : null}
          />
        </div>
        <div className='col-sm-8 mb-2'>
          <CountrySelect
            ariaLabel={t('buc:p4000-label-country')}
            id='a-buc-c-sedp4000-period__land-select-id'
            className='a-buc-c-sedp4000-period__land-select'
            label={(
              <div className='a-buc-c-sedp4000-period__label'>
                {t('buc:p4000-label-country')}
              </div>
            )}
            locale={locale}
            includeList={CountryFilter.EEA}
            value={period.country || null}
            onOptionSelected={setCountry}
            error={localErrors.country ? t(localErrors.country) : undefined}
          />
        </div>
      </Row>
    </>
  )
}

PeriodWork.propTypes = {
  locale: AllowedLocaleStringPropType.isRequired,
  localErrors: ValidationPropType.isRequired,
//  period: PeriodPropType.isRequired,
  setCountry: PT.func.isRequired,
  setInsuranceId: PT.func.isRequired,
  setWorkActivity: PT.func.isRequired,
  setWorkCity: PT.func.isRequired,
  setWorkName: PT.func.isRequired,
  setWorkRegion: PT.func.isRequired,
  setWorkStreet: PT.func.isRequired,
  setWorkType: PT.func.isRequired,
  setWorkZipCode: PT.func.isRequired
}

export default PeriodWork
