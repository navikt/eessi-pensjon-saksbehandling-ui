import React, { useCallback, useEffect, useState } from 'react'
import {
  createReplySed,
  createSavingAttachmentJob,
  createSed,
  getCountryList,
  getInstitutionsListForBucAndCountry,
  getSedList,
  resetSed,
  resetSedAttachments,
  sendAttachmentToSed,
  setSedList
} from 'actions/buc'
import { getBucTypeLabel, sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDAttachmentModal from 'applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import { BUCMode } from 'applications/BUC/index'
import PersonIcon from 'assets/icons/line-version-person-2'
import Alert from 'components/Alert/Alert'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Select from 'components/Select/Select'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import { IS_TEST } from 'constants/environment'
import {
  AttachedFiles,
  Buc,
  BUCAttachments,
  Bucs,
  InstitutionListMap,
  Institutions,
  NewSedPayload,
  PersonAvdod,
  PersonAvdods,
  RawInstitution,
  SavingAttachmentsJob,
  Sed,
  SedsWithAttachmentsMap,
  ValidBuc
} from 'declarations/buc'
import { AttachedFilesPropType, BucsPropType } from 'declarations/buc.pt'
import { JoarkFile, JoarkFiles } from 'declarations/joark'
import { State } from 'declarations/reducers'
import {
  AllowedLocaleString,
  Country,
  FeatureToggles,
  Loading,
  Option,
  Person,
  PesysContext,
  Validation
} from 'declarations/types'
import CountryData from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const SEDStartDiv = styled.div`
  display: flex;
  flex-direction: column;
`
const countrySort = (a: Country, b: Country) => a.label.localeCompare(b.label)

const FullWidthDiv = styled.div`
  width: 100%;
`
const AlertDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
const InstitutionsDiv = styled.div`
  & > div {
   margin-bottom: 0.35rem;
  }
`
const SEDAttachmentSenderDiv = styled.div`
   margin-top: 1rem;
   margin-bottom: 1rem;
   width: 100%;
`
const FlexDiv = styled.div`
   display: flex;
`

export interface SEDStartProps {
  aktoerId?: string
  bucs: Bucs
  currentBuc: string
  initialAttachments ?: AttachedFiles
  initialSed ?: string | undefined
  onSedCreated: () => void
  onSedCancelled: () => void
  setMode: (mode: BUCMode, s: string, callback?: any) => void
}

export interface SEDStartSelector {
  attachmentsError: boolean
  countryList: Array<string> | undefined
  currentSed: string | undefined
  featureToggles: FeatureToggles
  highContrast: boolean
  institutionList: InstitutionListMap<RawInstitution> | undefined
  loading: Loading
  locale: AllowedLocaleString
  person: Person | undefined
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakId?: string
  savingAttachmentsJob: SavingAttachmentsJob | undefined
  sed: Sed | undefined
  sedsWithAttachments: SedsWithAttachmentsMap
  sedList: Array<string> | undefined
  vedtakId: string | undefined
}

const mapState = /* istanbul ignore next */ (state: State): SEDStartSelector => ({
  attachmentsError: state.buc.attachmentsError,
  countryList: state.buc.countryList,
  currentSed: state.buc.currentSed,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  institutionList: state.buc.institutionList,
  loading: state.loading,
  locale: state.ui.locale,
  person: state.app.person,
  personAvdods: state.app.personAvdods,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  savingAttachmentsJob: state.buc.savingAttachmentsJob,
  sed: state.buc.sed,
  sedList: state.buc.sedList,
  sedsWithAttachments: state.buc.sedsWithAttachments,
  vedtakId: state.app.params.vedtakId
})

export const SEDStart: React.FC<SEDStartProps> = ({
  aktoerId, bucs, currentBuc, initialAttachments = {
    sed: [] as BUCAttachments,
    joark: [] as JoarkFiles
  },
  initialSed = undefined,
  onSedCreated, onSedCancelled
} : SEDStartProps): JSX.Element | null => {
  const {
    attachmentsError, countryList, currentSed, featureToggles, highContrast, institutionList,
    loading, locale, person, personAvdods, pesysContext, sakId, sed, sedList, sedsWithAttachments, vedtakId
  }: SEDStartSelector = useSelector<State, SEDStartSelector>(mapState)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const prefill: (prop: string) => Array<string> = (prop: string) => {
    const institutions: Array<any> = bucs[currentBuc!] && bucs[currentBuc!].institusjon
      ? bucs[currentBuc!]
        .seds!
        .filter(sedFilter)
        .map((sed: Sed) => {
          return sed.participants
            .filter(p => p.role === 'Sender')
            .map(p => {
              return _.get(p.organisation, prop)
            })
        })
      : []
    return Array.from(new Set(_.flatten(institutions))) // remove duplicates
  }

  const [_avdod, setAvdod] = /* istanbul ignore next */ useState<PersonAvdod | undefined>(undefined)
  const [sendingAttachments, setSendingAttachments] = useState<boolean>(false)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const buc: Buc = _.cloneDeep(bucs[currentBuc!])
  const countryData = CountryData.getCountryInstance(locale)
  const countryObjectList = countryList ? countryData.filterByValueOnArray(countryList).sort(countrySort) : []
  const [_countries, setCountries] = useState<Array<string>>(prefill('countryCode'))
  const countryValueList = _countries ? countryData.filterByValueOnArray(_countries).sort(countrySort) : []
  const [_institutions, setInstitutions] = useState<Array<string>>(
    featureToggles.SED_PREFILL_INSTITUTIONS ? prefill('id') : []
  )
  const institutionObjectList: Array<{label: string, options: Array<Option>}> = []
  const [kravDato, setKravDato] = useState<string>('')
  const [mounted, setMounted] = useState<boolean>(false)
  const notHostInstitution = (institution: RawInstitution) => institution.id !== 'NO:DEMO001'
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [sedAttachments, setSedAttachments] = useState<AttachedFiles>(initialAttachments)
  const [sedSent, setSedSent] = useState<boolean>(false)
  const [validation, setValidation] = useState<Validation>({})
  const [_vedtakId, setVedtakId] = /* istanbul ignore next */ useState<string | undefined>(vedtakId)

  // this is input
  const needsAvdodFnr = (): boolean => (
    buc.type === 'P_BUC_02' &&
    !personAvdods &&
    pesysContext !== constants.VEDTAKSKONTEKST &&
    (buc?.creator?.country !== 'NO' ||
      (buc?.creator?.country === 'NO' && buc?.creator?.institution === 'NO:NAVAT08'))
  )

  // this is select
  const needsAvdod = (): boolean => (
    _sed === 'P2100' || (
      buc.type === 'P_BUC_02' && pesysContext !== constants.VEDTAKSKONTEKST &&
       (buc?.creator?.country !== 'NO' ||
           (buc?.creator?.country === 'NO' && buc?.creator?.institution === 'NO:NAVAT08'))
    )
  )

  if (institutionList) {
    Object.keys(institutionList).forEach((landkode: string) => {
      if (_.includes(_countries, landkode)) {
        const label = countryData.findByValue(landkode)
        institutionObjectList.push({
          label: label.label,
          options: institutionList[landkode].filter(notHostInstitution).map((institution: RawInstitution) => {
            return {
              label: institution.akronym + ' – ' + institution.navn,
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

  const validateKravDato = (): boolean => {
    if (!kravDato) {
      return true
    }
    if (!kravDato.match(/\d{2}-\d{2}-\d{4}/)) {
      setValidationState('kravDato', t('buc:validation-badKravDato'))
      return false
    } else {
      resetValidationState('kravDato')
      return true
    }
  }

  const validateSed = (sed: string | undefined): boolean => {
    if (!sed) {
      setValidationState('sedFail', t('buc:validation-chooseSed'))
      return false
    } else {
      resetValidationState('sedFail')
      return true
    }
  }

  const validateAvdod = (_avdod: PersonAvdod | undefined): boolean => {
    if (!_avdod) {
      setValidationState('avdodFail', t('buc:validation-chooseAvdod'))
      return false
    } else {
      resetValidationState('avdodFail')
      return true
    }
  }

  const validateAvdodFnr = (_avdod: PersonAvdod | undefined): boolean => {
    if (!_avdod) {
      setValidationState('avdodfnrFail', t('buc:validation-chooseAvdodFnr'))
      return false
    } else {
      resetValidationState('avdodfnrFail')
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

  const validateVedtakId = (vedtakId: string | undefined): boolean => {
    if (!vedtakId) {
      setValidationState('vedtakFail', t('buc:validation-chooseVedtakId'))
      return false
    }
    if (!isNumber(vedtakId!)) {
      setValidationState('vedtakFail', t('buc:validation-chooseVedtakId'))
      return false
    }
    resetValidationState('vedtakFail')
    return true
  }

  const onAvdodChange = (e: any) => {
    const thisAvdod: PersonAvdod | undefined = _.find(personAvdods, (p) => p.fnr === e.value)
    setAvdod(thisAvdod)
  }

  const onAvdodFnrChange = (e: any) => {
    setAvdod({
      fnr: e.target.value
    } as PersonAvdod)
  }

  const renderAvdodOptions = (options: any) => {
    return options?.map((el: any) => ({
      label: el.fulltNavn + ' (' + el.fnr + ')',
      value: el.fnr
    })) || []
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

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vedtakId = e.target.value
    validateVedtakId(vedtakId)
    setVedtakId(vedtakId)
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

  const onJoarkAttachmentsChanged = (joarkFiles: JoarkFiles) => {
    setSedAttachments({
      ...sedAttachments,
      joark: joarkFiles
    })
  }

  const onAttachmentsChanged = (files: AttachedFiles) => {
    setSedAttachments(files)
  }

  const bucHasSedsWithAtLeastOneInstitution: Function = (): boolean => {
    if (buc.seds) {
      return _(buc.seds).find(sed => {
        return _.isArray(sed.participants) && !_.isEmpty(sed.participants)
      }) !== undefined
    }
    return false
  }

  const sedNeedsVedtakId = (): boolean => {
    return _sed === 'P6000' || _sed === 'P7000'
  }

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkFile): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const sedCanHaveAttachments = (): boolean => {
    return _sed !== undefined && sedsWithAttachments[_sed]
  }

  const convertInstitutionIDsToInstitutionObjects: Function = (): Institutions => {
    const institutions = [] as Institutions
    _institutions.forEach(item => {
      Object.keys(institutionList!).forEach((landkode: string) => {
        const found = _.find(institutionList![landkode], { id: item })
        if (found) {
          institutions.push({
            country: found.landkode,
            institution: found.id,
            name: found.navn
          })
        }
      })
    })
    return institutions
  }

  const resetSedForm = () => {
    setSed(undefined)
    dispatch(resetSed())
    setSed(undefined)
    setInstitutions([])
    setCountries([])
    setKravDato('')
  }

  const performValidation = () => {
    let valid = true
    valid = valid && validateSed(_sed)
    if (!bucHasSedsWithAtLeastOneInstitution()) {
      valid = valid &&
        validateInstitutions(_institutions) &&
        validateCountries(_countries)
    }
    if (sedNeedsVedtakId()) {
      valid = valid && validateVedtakId(_vedtakId)
    }
    if (buc.type === 'P_BUC_02') {
      valid = valid && validateKravDato()
    }
    if (needsAvdod()) {
      valid = valid && validateAvdod(_avdod)
    }
    if (needsAvdodFnr()) {
      valid = valid && validateAvdodFnr(_avdod)
    }
    return valid
  }

  const onForwardButtonClick = (e: React.MouseEvent) => {
    const valid = performValidation()
    if (valid) {
      const institutions = convertInstitutionIDsToInstitutionObjects()
      const payload: NewSedPayload = {
        sakId: sakId!,
        buc: buc.type!,
        sed: _sed!,
        institutions: institutions,
        aktoerId: aktoerId!,
        euxCaseId: buc.caseId!
      }
      if (kravDato) {
        payload.kravDato = kravDato
      }
      if (sedNeedsVedtakId()) {
        payload.vedtakId = _vedtakId
      }
      if (needsAvdod() || needsAvdodFnr()) {
        payload.avdodfnr = _avdod?.fnr
      }
      if (buc.type === 'P_BUC_02') {
        payload.subject = (buc as ValidBuc).subject
      }
      if (currentSed) {
        dispatch(createReplySed(buc, payload, person!, currentSed))
      } else {
        dispatch(createSed(buc, payload, person!))
      }
      buttonLogger(e, payload)
    }
  }

  const onKravDatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetValidationState('kravDato')
    setKravDato(e.target.value)
  }

  const onCancelButtonClick = (e: React.MouseEvent) => {
    buttonLogger(e)
    resetSedForm()
    onSedCancelled()
  }

  const isNumber = (s: string) => {
    return s.match(/^\d+$/g) !== null
  }

  const onFinished = useCallback(() => {
    resetSedForm()
    dispatch(resetSed())
    dispatch(resetSedAttachments())
    setSedSent(false)
    setSendingAttachments(false)
    setSed(undefined)
    setInstitutions([])
    setCountries([])
    onSedCreated()
  }, [dispatch, onSedCreated])

  const sedOptions = renderOptions(sedList)
  const avdodOptions = renderAvdodOptions(personAvdods)

  useEffect(() => {
    if (_.isEmpty(countryList) && buc && buc.type && !loading.gettingCountryList) {
      dispatch(getCountryList(buc.type))
    }
  }, [countryList, dispatch, loading, buc])

  useEffect(() => {
    if (!mounted) {
      if (!currentSed) {
        dispatch(getSedList(buc as ValidBuc))
      } else {
        dispatch(setSedList(
          bucs[currentBuc].seds!
            .filter(sed => sed.parentDocumentId === currentSed)
            .map(sed => sed.type)
        ))
      }
      setMounted(true)
    }
  }, [mounted, buc, bucs, currentBuc, currentSed, dispatch])

  useEffect(() => {
    if (sed && !sedSent) {
      setSedSent(true)
    }
    // if sed is sent, we can start sending attachments
    if (sedSent && !sendingAttachments && !attachmentsSent) {
      // no attachments to send - conclude
      if (_.isEmpty(sedAttachments.joark)) {
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('SEDStart: No attachments to send, concluding')
        }
        onFinished()
      } else {
        // start a savingAttachmentsJob
        setSendingAttachments(true)
        setAttachmentsTableVisible(false)
        standardLogger('sed.new.attachments.data', {
          numberOfJoarkAttachments: sedAttachments.joark.length
        })
        const joarksToUpload: JoarkFiles = _.cloneDeep(sedAttachments.joark as JoarkFiles)
        dispatch(createSavingAttachmentJob(joarksToUpload))
      }
    }
  }, [dispatch, onFinished, sendingAttachments, sedAttachments, attachmentsSent, sed, sedSent])

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

  useEffect(() => {
    if (buc.type === 'P_BUC_02' &&
      pesysContext === constants.VEDTAKSKONTEKST &&
      personAvdods &&
      personAvdods.length === 1 &&
      !_avdod
    ) {
      setAvdod(personAvdods[0])
    }
  }, [buc, _avdod, pesysContext, personAvdods])

  if (_.isEmpty(bucs) || !currentBuc) {
    return null
  }

  return (
    <SEDStartDiv>
      <Systemtittel>
        {!currentSed ? t('buc:step-startSEDTitle', {
          buc: t(`buc:buc-${buc?.type}`),
          sed: _sed || t('buc:form-newSed')
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
      <Row>
        <Column>
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
              placeholder={t('buc:form-chooseSed')}
              onChange={onSedChange}
              options={sedOptions}
              value={_.find(sedOptions, (f: any) => f.value === _sed) || null}
              feil={validation.sedFail ? t(validation.sedFail) : null}
            />
          </>
          {buc.type === 'P_BUC_02' && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                data-testid='a-buc-c-sedstart__vedtakid-kravdato-id'
                label={t('buc:form-kravDato')}
                bredde='fullbredde'
                value={kravDato || ''}
                onChange={onKravDatoChange}
                onBlur={validateKravDato}
                placeholder={t('buc:form-kravDatoPlaceholder')}
                feil={validation.kravDato ? t(validation.kravDato) : null}
              />
            </>
          )}
          {sedNeedsVedtakId() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                disabled
                data-testid='a-buc-c-sedstart__vedtakid-input-id'
                label={t('buc:form-vedtakId')}
                bredde='fullbredde'
                value={vedtakId || ''}
                onChange={onVedtakIdChange}
                placeholder={t('buc:form-noVedtakId')}
                feil={validation.vedtakFail ? t(validation.vedtakFail) : null}
              />
            </>
          )}
          {buc.type === 'P_BUC_02' && personAvdods && (
            <>
              {_sed && _sed === 'P2100' && personAvdods.length > 1 && (
                <>
                  <VerticalSeparatorDiv />
                  <label className='skjemaelement__label'>
                    {t('buc:form-avdod')}
                  </label>
                  <Select
                    highContrast={highContrast}
                    menuPortalTarget={document.body}
                    data-testid='a-buc-c-bucstart__avdod-select-id'
                    isSearchable
                    placeholder={t('buc:form-chooseAvdod')}
                    onChange={onAvdodChange}
                    options={avdodOptions}
                    value={_.find(avdodOptions, (f: any) => f.value === _avdod?.fnr) || null}
                    feil={validation.avdodFail ? t(validation.avdodFail) : null}
                  />
                </>
              )}
              {personAvdods.length === 1 && (
                <>
                  <VerticalSeparatorDiv />
                  <FlexDiv>
                    <PersonIcon color={highContrast ? 'white' : 'black'} />
                    <HorizontalSeparatorDiv />
                    <label className='skjemaelement__label'>
                      {t('buc:form-avdod')}:
                    </label>
                    <HorizontalSeparatorDiv />
                    <Normaltekst>
                      {_avdod?.fornavn +
                    (_avdod?.mellomnavn ? ' ' + _avdod?.mellomnavn : '') +
                    (_avdod?.etternavn ? ' ' + _avdod?.etternavn : '') +
                    (' (' + _avdod?.fnr + ')')}
                    </Normaltekst>
                  </FlexDiv>
                </>
              )}
            </>
          )}
          {needsAvdodFnr() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                label={t('buc:form-avdod')}
                data-testid='a-buc-c-bucstart__avdod-input-id'
                placeholder={t('buc:form-chooseAvdodFnr')}
                onChange={onAvdodFnrChange}
                feil={validation.avdodfnrFail ? t(validation.avdodfnrFail) : null}
              />
            </>
          )}
          {!currentSed && (
            <>
              <VerticalSeparatorDiv />
              <CountrySelect
                isMulti
                highContrast={highContrast}
                ariaLabel={t('ui:country')}
                label={t('ui:country')}
                data-testid='a-buc-c-sedstart__country-select-id'
                disabled={loading.gettingCountryList}
                isLoading={loading.gettingCountryList}
                placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t('buc:form-chooseCountry')}
                aria-describedby='help-country'
                value={countryValueList}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                onOptionSelected={onCountriesChange}
                options={countryObjectList}
                includeList={countryList}
                error={validation.countryFail ? t(validation.countryFail) : null}
              />
              <VerticalSeparatorDiv />
              <MultipleSelect
                highContrast={highContrast}
                ariaLabel={t('ui:institution')}
                label={t('ui:institution')}
                data-testid='a-buc-c-sedstart__institution-select-id'
                disabled={loading.gettingInstitutionList}
                isLoading={loading.gettingInstitutionList}
                placeholder={loading.gettingInstitutionList ? getSpinner('buc:loading-institution') : t('buc:form-chooseInstitution')}
                aria-describedby='help-institution'
                values={institutionValueList}
                onSelect={onInstitutionsChange}
                hideSelectedOptions={false}
                options={institutionObjectList}
                error={validation.institutionFail ? t(validation.institutionFail) : undefined}
              />
              <VerticalSeparatorDiv data-size='2' />
              <label className='skjemaelement__label'>
                {t('buc:form-chosenInstitutions')}
              </label>
              <VerticalSeparatorDiv />
              <InstitutionsDiv>
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
              </InstitutionsDiv>
            </>
          )}
          <Column>
            <VerticalSeparatorDiv data-size='1.5' />
            <HighContrastHovedknapp
              data-amplitude='sed.new.create'
              data-testid='a-buc-c-sedstart__forward-button-id'
              disabled={loading.creatingSed || sendingAttachments}
              spinner={loading.creatingSed || sendingAttachments}
              onClick={onForwardButtonClick}

            >
              {loading.creatingSed ? t('buc:loading-creatingSED')
                : sendingAttachments ? t('buc:loading-sendingSEDattachments')
                  : t('buc:form-orderSED')}
            </HighContrastHovedknapp>
            <HorizontalSeparatorDiv />
            <HighContrastFlatknapp
              data-amplitude='sed.new.cancel'
              data-testid='a-buc-c-sedstart__cancel-button-id'
              onClick={onCancelButtonClick}
            >
              {t('ui:cancel')}
            </HighContrastFlatknapp>
            <VerticalSeparatorDiv data-size='1.5' />
          </Column>
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          {sedCanHaveAttachments() && (
            <>
              <VerticalSeparatorDiv data-size='2' />
              <label className='skjemaelement__label'>
                {t('ui:attachments')}
              </label>
              <VerticalSeparatorDiv />
              <HighContrastKnapp
                onClick={() => setAttachmentsTableVisible(!attachmentsTableVisible)}
              >
                {t(attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
              </HighContrastKnapp>
              <VerticalSeparatorDiv />
              {attachmentsTableVisible && (
                <SEDAttachmentModal
                  sedAttachments={sedAttachments}
                  onModalClose={() => setAttachmentsTableVisible(false)}
                  onFinishedSelection={onJoarkAttachmentsChanged}
                />
              )}
            </>
          )}
          {sedCanHaveAttachments() && (
            <>
              <VerticalSeparatorDiv />
              <SEDAttachmentsTable
                highContrast={highContrast}
                attachments={sedAttachments}
                onAttachmentsChanged={onAttachmentsChanged}
              />
            </>
          )}
          <Column>
            {(sendingAttachments || attachmentsSent) && sed && (
              <SEDAttachmentSenderDiv>
                <>
                  <SEDAttachmentSender
                    attachmentsError={attachmentsError}
                    sendAttachmentToSed={_sendAttachmentToSed}
                    payload={{
                      aktoerId: aktoerId,
                      rinaId: buc.caseId,
                      rinaDokumentId: sed!.id
                    } as SEDAttachmentPayload}
                    onSaved={(savingAttachmentsJob: SavingAttachmentsJob) => onJoarkAttachmentsChanged(savingAttachmentsJob.remaining)}
                    onFinished={() => {
                      setAttachmentsSent(true)
                      onFinished()
                    }}
                  />
                  <VerticalSeparatorDiv />
                </>
              </SEDAttachmentSenderDiv>
            )}
          </Column>
        </Column>
      </Row>
    </SEDStartDiv>
  )
}

SEDStart.propTypes = {
  aktoerId: PT.string.isRequired,
  bucs: BucsPropType.isRequired,
  initialAttachments: AttachedFilesPropType,
  onSedCreated: PT.func.isRequired,
  onSedCancelled: PT.func.isRequired
}

export default SEDStart
