import { getInstitutionsListForBucAndCountry } from 'actions/buc'
import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDAttachments from 'applications/BUC/components/SEDAttachments/SEDAttachments'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import Alert from 'components/Alert/Alert'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { HighContrastInput, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AttachedFiles, Buc, InstitutionListMap, RawInstitution, Sed } from 'declarations/buc'
import { AttachedFilesPropType, BucPropType, InstitutionListMapPropType } from 'declarations/buc.pt'
import { Country } from 'declarations/types'
import { AllowedLocaleString, Labels, Loading, Option, Validation } from 'declarations/types'
import { AllowedLocaleStringPropType, LoadingPropType, ValidationPropType } from 'declarations/types.pt'
import CountryData from 'land-verktoy'
import Select from 'components/Select/Select'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Input } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

export interface Step1Props {
  _attachments: AttachedFiles
  avdodfnr: number | undefined
  buc: Buc
  _countries: Array<string>
  countryList: Array<string>
  currentSed ?: string | undefined
  highContrast: boolean
  _institutions: Array<string>
  institutionList: InstitutionListMap<RawInstitution>
  layout? : string
  loading: Loading
  locale: AllowedLocaleString
  _sed: string | undefined
  sedCanHaveAttachments: () => boolean
  setAttachments: (f: AttachedFiles) => void
  setCountries: (c: Array<string>) => void
  setInstitutions: (i: Array<string>) => void
  sedList?: Array<string>
  sedNeedsVedtakId: () => boolean
  sedNeedsAvdodfnr: () => boolean
  setAvdodfnr: (v: number) => void
  setSed: (s: string) => void
  setValidation: (v: Validation) => void
  setVedtakId: (v: number) => void
  validation: Validation
  vedtakId: number | undefined
}

const placeholders: Labels = {
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry',
  vedtakId: 'buc:form-noVedtakId',
  avdodfnr: 'buc:form-noAvdodfnr'
}

const countrySort = (a: Country, b: Country) => a.label.localeCompare(b.label)

const Step1Div = styled.div`
  width :100%;
`
const FullWidthDiv = styled.div`
 width :100%;
`
const AlertDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1,5rem;
  margin-bottom: 1,5rem;
`
const ResponsiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`
const Container = styled.div`
  flex: 1;
`

const Step1: React.FC<Step1Props> = ({
  _attachments, avdodfnr, buc, _countries, countryList = [], currentSed, highContrast, _institutions, institutionList,
  loading, locale, _sed, sedCanHaveAttachments, setAttachments, setCountries, setInstitutions,
  sedList, sedNeedsVedtakId, sedNeedsAvdodfnr, setAvdodfnr, setSed, setValidation, setVedtakId, validation, vedtakId
}: Step1Props): JSX.Element => {
  const countryData = CountryData.getCountryInstance(locale)
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
      if (!buc) {
        return
      }
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
    }, [_countries, dispatch, _institutions, buc, setCountries, setInstitutions, validateCountries])

  useEffect(() => {
    if (_.isArray(sedList) && sedList.length === 1 && !_sed) {
      setSed(sedList[0])
    }
  }, [sedList, _sed, setSed])

  useEffect(() => {
    if (!mounted && buc && buc.type !== null && !_.isEmpty(_countries)) {
      _countries.forEach(country => {
        if (!institutionList || !Object.keys(institutionList).includes(country)) {
          dispatch(getInstitutionsListForBucAndCountry(buc.type!, country))
        }
      })
      setMounted(true)
    }
  }, [mounted, buc, dispatch, fetchInstitutionsForSelectedCountries, institutionList, _countries])

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

  const validateAvdodfnr = (avdodfnr: number | undefined): boolean => {
    if (sedNeedsAvdodfnr() && !_.isNumber(avdodfnr)) {
      setValidationState('avdodfnrFail', t('buc:validation-chooseAvdodfnr'))
      return false
    } else {
      resetValidationState('avdodfnrFail')
      return true
    }
  }

  const onSedChange = (e: any) => {
    const thisSed = e.value
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

  const onAvdodfnrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let avdodfnr: number
    try {
      avdodfnr = parseInt(e.target.value, 10)
      validateAvdodfnr(avdodfnr)
      setAvdodfnr(avdodfnr)
    } catch (e) {}
  }

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let vedtakId: number
    try {
      vedtakId = parseInt(e.target.value, 10)
      validateVedtakId(vedtakId)
      setVedtakId(vedtakId)
    } catch (e) {}
  }

  const renderOptions = (options: Array<Option | string> | undefined) => {
    return options ? options.map((el: Option | string) => {
      let label, value
      if (typeof el === 'string') {
        label = el
        value = el
      } else {
        value = el.value || el.navn
        label = el.label || el.navn
      }
      return {
        label: getOptionLabel(label!),
        value: value
      }
    }) : []
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
      <WaitingPanel className='a-buc-c-sedstart__spinner' size='S' message={t(text)} oneLine />
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
    <Step1Div>
      <Systemtittel>
        {!currentSed ? t('buc:step-startSEDTitle', {
          buc: t(`buc:buc-${buc?.type}`),
          sed: _sed === placeholders.sed ? t('buc:form-newSed') : _sed || t('buc:form-newSed')
        }) : t('buc:step-replySEDTitle', {
          buc: t(`buc:buc-${buc?.type}`),
          sed: buc.seds!.find((sed: Sed) => sed.id === currentSed)!.type
        })}
      </Systemtittel>
      <hr />
      {!vedtakId && _sed === 'P6000' && (
        <FullWidthDiv>
          <AlertDiv>
            <Alert type='client' fixed={false} status='WARNING' message={t('buc:alert-noVedtakId')} />
          </AlertDiv>
        </FullWidthDiv>
      )}
      <ResponsiveContainer>
        <Container>
          <VerticalSeparatorDiv data-size='2' />
          <>
            <label className='skjemaelement__label'>
              {t('buc:form-sed')}
            </label>
            <Select
              highContrast={highContrast}
              data-testid='a-buc-c-sedstart__sed-select-id'
              disabled={loading.gettingSedList}
              isSearchable
              onChange={onSedChange}
              options={renderOptions(sedList)}
            />

            {validation.sedFail && <Normaltekst>{t(validation.sedFail)}</Normaltekst>}
          </>
          <VerticalSeparatorDiv />
          {sedNeedsVedtakId() && (
            <>
              <VerticalSeparatorDiv />
              <Input
                disabled
                data-testId='a-buc-c-sedstart__vedtakid-input-id'
                label={t('buc:form-vedtakId')}
                bredde='fullbredde'
                value={vedtakId || ''}
                onChange={onVedtakIdChange}
                placeholder={t(placeholders.vedtakId!)}
                feil={validation.vedtakFail ? t(validation.vedtakFail) : null}
              />
              <VerticalSeparatorDiv />
            </>
          )}
          {sedNeedsAvdodfnr() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                id='a-buc-c-sedstart__fnr-input-id'
                label={t('buc:form-fnr')}
                bredde='fullbredde'
                value={avdodfnr || ''}
                onChange={onAvdodfnrChange}
                placeholder={t(placeholders.fnr!)}
                feil={validation.fnrFail ? t(validation.fnrFail) : null}
              />
              <VerticalSeparatorDiv />
            </>
          )}
          {!currentSed && (
            <>
              <VerticalSeparatorDiv />
              <MultipleSelect
                highContrast={highContrast}
                ariaLabel={t('ui:country')}
                label={t('ui:country')}
                data-testId='a-buc-c-sedstart__country-select-id'
                disabled={loading.gettingCountryList}
                isLoading={loading.gettingCountryList}
                placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t(placeholders.country!)}
                aria-describedby='help-country'
                values={countryValueList}
                hideSelectedOptions={false}
                onSelect={onCountriesChange}
                options={countryObjectList}
              />
              <VerticalSeparatorDiv />
              <MultipleSelect
                highContrast={highContrast}
                ariaLabel={t('ui:institution')}
                label={t('ui:institution')}
                data-testId='a-buc-c-sedstart__institution-select-id'
                disabled={loading.gettingInstitutionList}
                isLoading={loading.gettingInstitutionList}
                placeholder={loading.gettingInstitutionList ? getSpinner('buc:loading-institution') : t(placeholders.institution!)}
                aria-describedby='help-institution'
                values={institutionValueList}
                onSelect={onInstitutionsChange}
                hideSelectedOptions={false}
                options={institutionObjectList}
              />
              <VerticalSeparatorDiv data-size='2' />
              <label className='skjemaelement__label'>
                {t('buc:form-chosenInstitutions')}
              </label>
              <VerticalSeparatorDiv />
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
          )}
          {sedCanHaveAttachments() && (
            <>
              <VerticalSeparatorDiv />
              <label className='skjemaelement__label'>
                {t('ui:attachments')}
              </label>
              <VerticalSeparatorDiv data-size='0.5' />
              <SEDAttachmentsTable highContrast={highContrast} attachments={_attachments} />
            </>
          )}
        </Container>
        <HorizontalSeparatorDiv />
        <Container>
          {sedCanHaveAttachments() && (
            <>
              <VerticalSeparatorDiv data-size='2' />
              <label className='skjemaelement__label'>
                {t('ui:attachments')}
              </label>
              <VerticalSeparatorDiv />
              <SEDAttachments
                disableButtons={false}
                highContrast={highContrast}
                onSubmit={setFiles}
                files={_attachments}
                open={seeAttachmentPanel}
                onOpen={() => setSeeAttachmentPanel(true)}
              />
            </>
          )}
        </Container>
      </ResponsiveContainer>
    </Step1Div>
  )
}

Step1.propTypes = {
  _attachments: AttachedFilesPropType.isRequired,
  avdodfnr: PT.number,
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
  sedList: PT.arrayOf(PT.string.isRequired),
  sedNeedsAvdodfnr: PT.func.isRequired,
  sedNeedsVedtakId: PT.func.isRequired,
  setAttachments: PT.func.isRequired,
  setCountries: PT.func.isRequired,
  setInstitutions: PT.func.isRequired,
  setAvdodfnr: PT.func.isRequired,
  setSed: PT.func.isRequired,
  setValidation: PT.func.isRequired,
  setVedtakId: PT.func.isRequired,
  validation: ValidationPropType.isRequired,
  vedtakId: PT.number
}

export default Step1
