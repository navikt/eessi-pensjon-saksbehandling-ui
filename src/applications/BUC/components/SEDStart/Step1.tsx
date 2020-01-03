import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDAttachments from 'applications/BUC/components/SEDAttachments/SEDAttachments'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import { Buc, InstitutionListMap, InstitutionNames, RawInstitution, Sed } from 'applications/BUC/declarations/buc'
import { Country } from 'applications/BUC/declarations/period'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { ActionCreators, AllowedLocaleString, Loading, Option, T, Validation } from 'types'

export interface Step1Props {
  actions: ActionCreators;
  _attachments: {[namespace: string]: Array<any>};
  buc: Buc;
  _countries: Array<string>;
  countryList: Array<string>;
  currentSed ?: string | undefined;
  _institutions: Array<string>;
  institutionList: InstitutionListMap<RawInstitution>;
  institutionNames: InstitutionNames | undefined;
  layout? : string;
  loading: Loading;
  locale: AllowedLocaleString;
  _sed: string | undefined;
  sedCanHaveAttachments: Function;
  setAttachments: Function;
  setCountries: Function;
  setInstitutions: Function;
  sedList?: Array<string>;
  sedNeedsVedtakId: Function;
  setSed: Function;
  setValidation: Function;
  setVedtakId: Function;
  t: T;
  validation: Validation;
  vedtakId: number | undefined;
}

const placeholders: {[k: string]: string} = {
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry',
  vedtakId: 'buc:form-enterVedtakId'
}

const Step1 = ({
  actions, _attachments, buc, _countries, countryList = [], currentSed, _institutions, institutionList, institutionNames,
  layout = 'row', loading, locale, _sed, sedCanHaveAttachments, setAttachments, setCountries, setInstitutions,
  sedList, sedNeedsVedtakId, setSed, setValidation, setVedtakId, t, validation, vedtakId
}: Step1Props) => {
  const countryData = Ui.CountryData.getCountryInstance(locale)
  const [mounted, setMounted] = useState<boolean>(false)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState<boolean>(false)
  const countryObjectList = (!_.isEmpty(countryList) ? countryData.filterByValueOnArray(countryList).sort((a: Country, b: Country) => a.label.localeCompare(b.label)) : [])
  const countryValueList = _countries ? countryData.filterByValueOnArray(_countries).sort((a: Country, b: Country) => a.label.localeCompare(b.label)) : []
  const notHostInstitution = (institution: RawInstitution) => institution.id !== 'NO:DEMO001'
  const institutionObjectList: Array<{label: string, options: Array<Option>}> = []
  if (institutionList) {
    Object.keys(institutionList).forEach((landkode: string) => {
      if (_.includes(_countries, landkode)) {
        const label = countryData.findByValue(landkode)
        institutionObjectList.push({
          label: label.label,
          options: institutionList[landkode].filter(notHostInstitution).map((institution: RawInstitution) => {
            return {
              label: institution.navn,
              value: institution.id
            }
          })
        })
      }
    })
  }

  let institutionValueList: Array<Option> = []
  if (institutionList && _institutions) {
    institutionValueList = _institutions.map(item => {
      const [country, institution] = item.split(':')
      const found = _.find(institutionList[country], { id: item })
      if (found) {
        return {
          label: found.navn,
          value: found.id
        }
      } else {
        return {
          label: item,
          value: institution
        }
      }
    })
  }

  const resetValidationState = useCallback((_key: string): void => {
    setValidation(_.omitBy(validation, (value, key) => {
      return key === _key
    }))
  }, [setValidation, validation])

  const setValidationState = useCallback((key: string, value: string): void => {
    setValidation({
      ...validation,
      [key]: value
    })
  }, [setValidation, validation])

  const validateCountries = useCallback((country: Array<string>): boolean => {
    if (_.isEmpty(country)) {
      setValidationState('countryFail', t('buc:validation-chooseCountry'))
      return false
    } else {
      resetValidationState('countryFail')
      return true
    }
  }, [resetValidationState, setValidationState, t])

  const fetchCountries = useCallback(
    (countries: Array<Country>) => {
    const newCountries = countries ? countries.map(item => {
      return item.value
    }) : []

    const oldCountriesList = _.cloneDeep(_countries)
    const addedCountries = newCountries.filter(country => !oldCountriesList.includes(country))
    const removedCountries = oldCountriesList.filter(country => !newCountries.includes(country))

    addedCountries.map(country => {
      return actions.getInstitutionsListForBucAndCountry(buc.type, country)
    })
    removedCountries.forEach(country => {
      const newInstitutions = _institutions.filter(item => {
        var [_country] = item.split(':')
        return country !== _country
      })
      setInstitutions(newInstitutions)
    })
    setCountries(newCountries)
    validateCountries(newCountries)
  }, [_countries, _institutions, actions, buc.type, setCountries, setInstitutions, validateCountries])

  useEffect(() => {
    if (_.isArray(sedList) && sedList.length === 1 && !_sed) {
      setSed(sedList[0])
    }
  }, [sedList, _sed, setSed])

  useEffect(() => {
    if (!mounted) {
      // when mounts, fetch country info for the default SED countries
      fetchCountries(_countries.map(country => ({ value: country } as Country)))
      setMounted(true)
    }
  }, [mounted, fetchCountries, _countries])

  const validateSed = (sed: string): boolean => {
    if (!sed || sed === placeholders.sed) {
      setValidationState('sedFail', t('buc:validation-chooseSed'))
      return false
    } else {
      resetValidationState('sedFail')
      return true
    }
  }

  const validateInstitutions = (institutions: Array<string>): boolean => {
    if (_.isEmpty(institutions)) {
      setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
      return false
    } else {
      resetValidationState('institutionFail')
      return true
    }
  }

  const validateVedtakId = (vedtakId: number | undefined): boolean => {
    if (sedNeedsVedtakId() && !_.isNumber(vedtakId)) {
      setValidationState('vedtakFail', t('buc:validation-chooseVedtakId'))
      return false
    } else {
      resetValidationState('vedtakFail')
      return true
    }
  }

  const onSedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const thisSed = e.target.value
    setSed(thisSed)
    validateSed(thisSed)
  }

  const onInstitutionsChange = (institutions: Array<Option>) => {
    const newInstitutions = institutions ? institutions.map(institution => {
      return institution.value
    }) : []
    validateInstitutions(newInstitutions)
    setInstitutions(newInstitutions)
  }

  const onCountriesChange = (countries: Array<Country>) => {
    fetchCountries(countries)
  }

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let vedtakId
    try {
      vedtakId = parseInt(e.target.value, 10)
    } catch (e) {}
    validateVedtakId(vedtakId)
    setVedtakId(vedtakId)
  }

  const renderOptions = (options: Array<Option | string> | undefined, type: string): Array<JSX.Element> => {
    const _options: Array<Option | string> = _.concat([{
      value: placeholders[type],
      label: t(placeholders[type])
    }], options || [])

    return _options.map((el: Option | string) => {
      let label, value
      if (typeof el === 'string') {
        label = el
        value = el
      } else {
        value = el.value || el.navn
        label = el.label || el.navn
      }
      return <option value={value} key={value}>{getOptionLabel(label!)}</option>
    })
  }

  const getOptionLabel = (value: string) => {
    let label = value
    const description = getBucTypeLabel({
      t: t,
      locale: locale,
      type: value
    })
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const getSpinner = (text: string) => {
    return (
      <Ui.WaitingPanel className='a-buc-c-sedstart__spinner' size='S' message={t(text)} />
    )
  }

  const setFiles = (files: Array<any>) => {
    setSeeAttachmentPanel(false)
    setAttachments(files)
  }

  return (
    <div className='a-buc-sedstart-step1 w-100'>
      <div className='col-md-12'>
        <Ui.Nav.Systemtittel>{
          !currentSed
            ? t('buc:step-startSEDTitle', {
              buc: t(`buc:buc-${buc.type}`),
              sed: _sed || t('buc:form-newSed')
            })
            : t('buc:step-replySEDTitle', {
              buc: t(`buc:buc-${buc.type}`),
              sed: buc.seds!.find((sed: Sed) => sed.id === currentSed)!.type
            })
        }
        </Ui.Nav.Systemtittel>
        <hr />
      </div>
      <div className={layout === 'row' ? 'col-md-6 pr-3' : 'col-md-12'}>
        <Ui.Nav.Select
          className='a-buc-c-sedstart__sed-select flex-fill'
          id='a-buc-c-sedstart__sed-select-id'
          disabled={loading.gettingSedList}
          aria-describedby='help-sed'
          bredde='fullbredde'
          feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
          label={t('buc:form-sed')}
          value={_sed || placeholders.sed}
          onChange={onSedChange}
        >
          {!loading.gettingSedList
            ? renderOptions(sedList, 'sed')
            : <option>{t('buc:loading-sed')}</option>}
        </Ui.Nav.Select>
        {sedNeedsVedtakId() ? (
          <div className='mb-3'>
            <Ui.Nav.Input
              id='a-buc-c-sedstart__vedtakid-input-id'
              className='a-buc-c-sedstart__vedtakid-input'
              label={t('buc:form-vedtakId')}
              bredde='fullbredde'
              value={vedtakId || ''}
              onChange={onVedtakIdChange}
              placeholder={t(placeholders.vedtakId)}
              feil={validation.vedtakFail ? { feilmelding: t(validation.vedtakFail) } : null}
            />
          </div>
        ) : null}
        {!currentSed
          ? (
            <>
              <div className='mb-3 flex-fill'>
                <Ui.MultipleSelect
                  ariaLabel={t('ui:country')}
                  label={t('ui:country')}
                  className='a-buc-c-sedstart__country-select'
                  id='a-buc-c-sedstart__country-select-id'
                  disabled={loading.gettingCountryList}
                  placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t(placeholders.country)}
                  aria-describedby='help-country'
                  values={countryValueList}
                  hideSelectedOptions={false}
                  onSelect={onCountriesChange}
                  options={countryObjectList}
                />
              </div>
              <div className='mb-3 flex-fill'>
                <Ui.MultipleSelect
                  ariaLabel={t('ui:institution')}
                  label={t('ui:institution')}
                  className='a-buc-c-sedstart__institution-select'
                  id='a-buc-c-sedstart__institution-select-id'
                  disabled={loading.institutionList}
                  placeholder={loading.institutionList ? getSpinner('buc:loading-institution') : t(placeholders.institution)}
                  aria-describedby='help-institution'
                  values={institutionValueList}
                  onSelect={onInstitutionsChange}
                  hideSelectedOptions={false}
                  options={institutionObjectList}
                />
              </div>
              <Ui.Nav.Undertittel className='mb-2'>{t('buc:form-chosenInstitutions')}</Ui.Nav.Undertittel>
              <InstitutionList
                t={t}
                institutionNames={institutionNames!}
                institutions={_institutions.map(item => {
                  var [country, institution] = item.split(':')
                  return {
                    country: country,
                    institution: institution
                  }
                })}
                locale={locale}
                type='joined'
              />
            </>
          ) : null}
        {sedCanHaveAttachments() ? (
          <div className='mt-4'>
            <Ui.Nav.Undertittel className='mb-2'>{t('ui:attachments')}</Ui.Nav.Undertittel>
            <SEDAttachmentsTable attachments={_attachments} t={t} />
          </div>
        ) : null}
      </div>
      {sedCanHaveAttachments() ? (
        <div className={layout === 'row' ? 'col-md-6' : 'col-md-12'}>
          <Ui.Nav.Undertittel className='mb-3'>
            {t('ui:attachments')}
          </Ui.Nav.Undertittel>
          <SEDAttachments
            t={t}
            onSubmit={setFiles}
            files={_attachments}
            open={seeAttachmentPanel}
            onOpen={() => setSeeAttachmentPanel(true)}
          />
        </div>
      ) : null}
    </div>
  )
}

Step1.propTypes = {
  actions: PT.object.isRequired,
  _attachments: PT.object,
  buc: PT.object.isRequired,
  countryList: PT.array,
  institutionList: PT.object,
  institutionNames: PT.object,
  layout: PT.string,
  loading: PT.object.isRequired,
  locale: PT.string.isRequired,
  sed: PT.object,
  _sed: PT.string,
  sedList: PT.array,
  setSed: PT.func.isRequired,
  t: PT.func.isRequired
}

export default Step1
