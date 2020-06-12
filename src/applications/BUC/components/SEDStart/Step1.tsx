import { getInstitutionsListForBucAndCountry } from 'actions/buc'
import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDAttachments from 'applications/BUC/components/SEDAttachments/SEDAttachments'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import { AttachedFiles, Buc, InstitutionListMap, RawInstitution, Sed } from 'declarations/buc'
import { AttachedFilesPropType, BucPropType, InstitutionListMapPropType } from 'declarations/buc.pt'
import { Country } from 'declarations/period'
import { AllowedLocaleString, Loading, Option, Validation } from 'declarations/types'
import { AllowedLocaleStringPropType, LoadingPropType, ValidationPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import { Labels } from 'eessi-pensjon-ui/dist/declarations/types'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

export interface Step1Props {
  _attachments: AttachedFiles;
  buc: Buc;
  _countries: Array<string>;
  countryList: Array<string>;
  currentSed ?: string | undefined;
  _institutions: Array<string>;
  institutionList: InstitutionListMap<RawInstitution>;
  layout? : string;
  loading: Loading;
  locale: AllowedLocaleString;
  _sed: string | undefined;
  sedCanHaveAttachments: () => boolean;
  setAttachments: (f: AttachedFiles) => void;
  setCountries: (c: Array<string>) => void;
  setInstitutions: (i: Array<string>) => void;
  sedList?: Array<string>;
  sedNeedsVedtakId: () => boolean;
  setSed: (s: string) => void;
  setValidation: (v: Validation) => void;
  setVedtakId: (v: number) => void;
  validation: Validation;
  vedtakId: number | undefined;
}

const placeholders: Labels = {
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry',
  vedtakId: 'buc:form-noVedtakId'
}

const countrySort = (a: Country, b: Country) => a.label.localeCompare(b.label)

const Step1: React.FC<Step1Props> = ({
  _attachments, buc, _countries, countryList = [], currentSed, _institutions, institutionList,
  layout = 'row', loading, locale, _sed, sedCanHaveAttachments, setAttachments, setCountries, setInstitutions,
  sedList, sedNeedsVedtakId, setSed, setValidation, setVedtakId, validation, vedtakId
}: Step1Props): JSX.Element => {
  const countryData = Ui.CountryData.getCountryInstance(locale)
  const [mounted, setMounted] = useState<boolean>(false)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState<boolean>(false)
  const countryObjectList = (!_.isEmpty(countryList) ? countryData.filterByValueOnArray(countryList).sort(countrySort) : [])
  const countryValueList = _countries ? countryData.filterByValueOnArray(_countries).sort(countrySort) : []
  const notHostInstitution = (institution: RawInstitution) => institution.id !== 'NO:DEMO001'
  const institutionObjectList: Array<{label: string, options: Array<Option>}> = []
  const dispatch = useDispatch()
  const { t } = useTranslation()

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
    const newValidation = _.cloneDeep(validation)
    newValidation[key] = value
    setValidation(newValidation)
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

  const fetchInstitutionsForSelectedCountries = useCallback(
    (countries: Array<Country>) => {
      const newCountries: Array<string> = countries ? countries.map(item => {
        return item.value
      }) : []

      const oldCountriesList = _.cloneDeep(_countries)
      const addedCountries = newCountries.filter(country => !oldCountriesList.includes(country))
      const removedCountries = oldCountriesList.filter(country => !newCountries.includes(country))

      addedCountries.map(country => {
        return dispatch(getInstitutionsListForBucAndCountry(buc.type!, country))
      })
      removedCountries.forEach(country => {
        const newInstitutions = _institutions.filter(item => {
          const [_country] = item.split(':')
          return country !== _country
        })
        setInstitutions(newInstitutions)
      })
      setCountries(newCountries)
      validateCountries(newCountries)
    }, [_countries, dispatch, _institutions, buc.type, setCountries, setInstitutions, validateCountries])

  useEffect(() => {
    if (_.isArray(sedList) && sedList.length === 1 && !_sed) {
      setSed(sedList[0])
    }
  }, [sedList, _sed, setSed])

  useEffect(() => {
    if (!mounted && !_.isEmpty(_countries)) {
      _countries.forEach(country => {
        if (!institutionList || !Object.keys(institutionList).includes(country)) {
          dispatch(getInstitutionsListForBucAndCountry(buc.type!, country))
        }
      })
      setMounted(true)
    }
  }, [mounted, buc.type, dispatch, fetchInstitutionsForSelectedCountries, institutionList, _countries])

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
    fetchInstitutionsForSelectedCountries(countries)
  }

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let vedtakId: number
    try {
      vedtakId = parseInt(e.target.value, 10)
      validateVedtakId(vedtakId)
      setVedtakId(vedtakId)
    } catch (e) {}
  }

  const renderOptions = (options: Array<Option | string> | undefined, type: string): Array<JSX.Element> => {
    const _options: Array<Option | string> = _.concat([{
      value: placeholders[type]!,
      label: t(placeholders[type]!)
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
      <Ui.WaitingPanel className='a-buc-c-sedstart__spinner' size='S' message={t(text)} oneLine />
    )
  }

  const setFiles = (files: AttachedFiles) => {
    standardLogger('sed.new.attachments.data', {
      numberOfJoarkAttachments: files.joark.length
    })
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
              sed: _sed === placeholders.sed ? t('buc:form-newSed') : _sed || t('buc:form-newSed')
            })
            : t('buc:step-replySEDTitle', {
              buc: t(`buc:buc-${buc.type}`),
              sed: buc.seds!.find((sed: Sed) => sed.id === currentSed)!.type
            })
        }
        </Ui.Nav.Systemtittel>
        <hr />
      </div>
      {!vedtakId && _sed === 'P6000' ? (
        <div className='col-md-12'>
          <div className='d-flex flex-column align-items-center mt-4 mb-4'>
            <Ui.Alert type='client' fixed={false} status='WARNING' message={t('buc:alert-noVedtakId')} />
          </div>
        </div>
      ) : null}
      <div className={layout === 'row' ? 'col-md-6 pr-3' : 'col-md-12'}>
        <Ui.Nav.Select
          className='a-buc-c-sedstart__sed-select flex-fill mt-4 mb-4'
          id='a-buc-c-sedstart__sed-select-id'
          disabled={loading.gettingSedList}
          aria-describedby='help-sed'
          bredde='fullbredde'
          feil={validation.sedFail ? validation.sedFail : null}
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
              disabled
              id='a-buc-c-sedstart__vedtakid-input-id'
              className='a-buc-c-sedstart__vedtakid-input  mt-4 mb-4'
              label={t('buc:form-vedtakId')}
              bredde='fullbredde'
              value={vedtakId || ''}
              onChange={onVedtakIdChange}
              placeholder={t(placeholders.vedtakId!)}
              feil={validation.vedtakFail ? t(validation.vedtakFail) : null}
            />
          </div>
        ) : null}
        {!currentSed
          ? (
            <>
              <div className='mt-4 mb-4 flex-fill'>
                <Ui.MultipleSelect
                  ariaLabel={t('ui:country')}
                  label={t('ui:country')}
                  className='a-buc-c-sedstart__country-select'
                  id='a-buc-c-sedstart__country-select-id'
                  disabled={loading.gettingCountryList}
                  isLoading={loading.gettingCountryList}
                  placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t(placeholders.country!)}
                  aria-describedby='help-country'
                  values={countryValueList}
                  hideSelectedOptions={false}
                  onSelect={onCountriesChange}
                  options={countryObjectList}
                />
              </div>
              <div className='mt-4 mb-4 flex-fill'>
                <Ui.MultipleSelect
                  ariaLabel={t('ui:institution')}
                  label={t('ui:institution')}
                  className='a-buc-c-sedstart__institution-select'
                  id='a-buc-c-sedstart__institution-select-id'
                  disabled={loading.gettingInstitutionList}
                  isLoading={loading.gettingInstitutionList}
                  placeholder={loading.gettingInstitutionList ? getSpinner('buc:loading-institution') : t(placeholders.institution!)}
                  aria-describedby='help-institution'
                  values={institutionValueList}
                  onSelect={onInstitutionsChange}
                  hideSelectedOptions={false}
                  options={institutionObjectList}
                />
              </div>
              <Ui.Nav.Undertittel className='mb-2'>{t('buc:form-chosenInstitutions')}</Ui.Nav.Undertittel>
              <InstitutionList
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
            <SEDAttachmentsTable attachments={_attachments} />
          </div>
        ) : null}
      </div>
      {sedCanHaveAttachments() ? (
        <div className={layout === 'row' ? 'col-md-6' : 'col-md-12'}>
          <Ui.Nav.Undertittel className='mb-3'>
            {t('ui:attachments')}
          </Ui.Nav.Undertittel>
          <SEDAttachments
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
  _attachments: AttachedFilesPropType.isRequired,
  buc: BucPropType.isRequired,
  _countries: PT.arrayOf(PT.string.isRequired).isRequired,
  countryList: PT.arrayOf(PT.string.isRequired).isRequired,
  currentSed: PT.string,
  _institutions: PT.arrayOf(PT.string.isRequired).isRequired,
  institutionList: InstitutionListMapPropType.isRequired,
  layout: PT.string,
  loading: LoadingPropType.isRequired,
  locale: AllowedLocaleStringPropType.isRequired,
  _sed: PT.string,
  sedCanHaveAttachments: PT.func.isRequired,
  setAttachments: PT.func.isRequired,
  setCountries: PT.func.isRequired,
  setInstitutions: PT.func.isRequired,
  sedList: PT.arrayOf(PT.string.isRequired),
  sedNeedsVedtakId: PT.func.isRequired,
  setSed: PT.func.isRequired,
  setValidation: PT.func.isRequired,
  setVedtakId: PT.func.isRequired,
  validation: ValidationPropType.isRequired,
  vedtakId: PT.number
}

export default Step1
