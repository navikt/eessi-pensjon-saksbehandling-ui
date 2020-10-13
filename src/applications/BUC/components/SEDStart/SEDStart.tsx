import {
  createReplySed,
  createSavingAttachmentJob,
  createSed,
  getCountryList,
  getInstitutionsListForBucAndCountry,
  getSedList,
  resetSavingAttachmentJob,
  resetSed,
  resetSedAttachments,
  sendAttachmentToSed,
  setSedList
} from 'actions/buc'
import {
  getBucTypeLabel,
  labelSorter,
  renderAvdodName,
  sedAttachmentSorter,
  sedFilter
} from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDAttachmentModal from 'applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import PersonIcon from 'assets/icons/line-version-person-2'
import Alert from 'components/Alert/Alert'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
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
  AllowedLocaleString,
  FeatureToggles,
  Loading,
  PesysContext,
  Validation,
  Option,
  Options
} from 'declarations/app.d'
import {
  Buc,
  Bucs,
  CountryRawList,
  InstitutionListMap,
  InstitutionRawList,
  Institutions,
  NewSedPayload,
  RawInstitution,
  RawList,
  SavingAttachmentsJob,
  Sed,
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile,
  SEDRawList,
  SedsWithAttachmentsMap,
  ValidBuc
} from 'declarations/buc.d'
import { BucsPropType } from 'declarations/buc.pt'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'
import { JoarkBrowserItemFileType } from 'declarations/joark.pt'
import { State } from 'declarations/reducers'

import { PersonAvdod, PersonAvdods } from 'declarations/person.d'
import CountryData, { Country, CountryList } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { GroupType, ValueType } from 'react-select'
import styled from 'styled-components'

const AlertDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`
const FlexDiv = styled.div`
   display: flex;
`
const FullWidthDiv = styled.div`
  width: 100%;
`
const InstitutionsDiv = styled.div``
const SEDAttachmentSenderDiv = styled.div`
   margin-top: 1rem;
   margin-bottom: 1rem;
   width: 100%;
`
export const SEDStartDiv = styled.div`
  display: flex;
  flex-direction: column;
`

export interface SEDStartProps {
  aktoerId: string
  bucs: Bucs
  currentBuc: string
  initialAttachments ?: JoarkBrowserItems
  initialSed ?: string | undefined
  initialSendingAttachments ?: boolean
  onSedCreated: () => void
  onSedCancelled: () => void
}

export interface SEDStartSelector {
  attachmentsError: boolean
  countryList: CountryRawList | undefined
  currentSed: Sed | undefined
  featureToggles: FeatureToggles
  highContrast: boolean
  institutionList: InstitutionListMap<RawInstitution> | undefined
  loading: Loading
  locale: AllowedLocaleString
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakId?: string
  savingAttachmentsJob: SavingAttachmentsJob | undefined
  sed: Sed | undefined
  sedsWithAttachments: SedsWithAttachmentsMap
  sedList: SEDRawList | undefined
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
  aktoerId,
  bucs,
  currentBuc,
  initialAttachments = [],
  initialSed = undefined,
  initialSendingAttachments = false,
  onSedCreated,
  onSedCancelled
} : SEDStartProps): JSX.Element => {
  const {
    attachmentsError, countryList, currentSed, featureToggles, highContrast, institutionList, loading,
    locale, personAvdods, pesysContext, sakId, sed, sedList, sedsWithAttachments, vedtakId
  }: SEDStartSelector = useSelector<State, SEDStartSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const prefill = (prop: string): RawList => {
    const institutions: Array<any> = bucs[currentBuc!] && bucs[currentBuc!].institusjon
      ? bucs[currentBuc!]
        .seds!
        .filter(sedFilter)
        .map((sed: Sed) => {
          return sed.participants
            ? sed.participants.filter(p => p.role === 'Sender')
              .map(p => {
                return _.get(p.organisation, prop)
              })
            : []
        })
      : []
    return Array.from(new Set(_.flatten(institutions))) // remove duplicates
  }

  const getOptionLabel = (value: string): string => {
    let label: string = value
    const description: string = getBucTypeLabel({
      t: t,
      locale: locale,
      type: value
    })
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const renderOptions = (options: Array<Option | string> | undefined): Options => {
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
      } as Option
    }) : []
  }

  const [_avdod, setAvdod] = useState<PersonAvdod | null | undefined>(undefined)
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const _buc: Buc = _.cloneDeep(bucs[currentBuc!])
  const _countryData: CountryList = CountryData.getCountryInstance(locale)
  const _countryObjectList = countryList ? _countryData.filterByValueOnArray(countryList).sort(labelSorter) : []
  const [_countries, setCountries] = useState<CountryRawList>(prefill('countryCode'))
  const _countryValueList = _countries ? _countryData.filterByValueOnArray(_countries).sort(labelSorter) : []
  const [_institutions, setInstitutions] = useState<InstitutionRawList>(
    featureToggles.SED_PREFILL_INSTITUTIONS ? prefill('id') : []
  )
  const _institutionObjectList: Array<GroupType<Option>> = []
  let _institutionValueList: Options = []
  const [_mounted, setMounted] = useState<boolean>(false)
  const _notHostInstitution = (institution: RawInstitution) : boolean => institution.id !== 'NO:DEMO001'
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [_sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(initialAttachments)
  const _sedOptions: Options = renderOptions(sedList)
  const [_sedSent, setSedSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_validation, setValidation] = useState<Validation>({})
  const [_vedtakId, setVedtakId] = useState<string | undefined>(vedtakId)

  const needsAvdod = (): boolean => (
    _buc.type === 'P_BUC_02'
  )

  const hasNoValidationErrors = (): boolean => {
    return _.find(_validation, (it) => (it !== undefined)) === undefined
  }

  const needsAvdodFnrInput = (): boolean => {
    return _buc.type === 'P_BUC_02' &&
    (!personAvdods || _.isEmpty(personAvdods)) &&
    pesysContext !== constants.VEDTAKSKONTEKST &&
    (_buc?.creator?.country !== 'NO' ||
      (_buc?.creator?.country === 'NO' && _buc?.creator?.institution === 'NO:NAVAT08'))
  }

  if (institutionList) {
    Object.keys(institutionList).forEach((landkode: string) => {
      if (_.includes(_countries, landkode)) {
        const country: Country | undefined = _countryData.findByValue(landkode)
        if (country) {
          _institutionObjectList.push({
            label: country.label,
            options: institutionList[landkode].filter(_notHostInstitution).map((institution: RawInstitution) => ({
              label: institution.akronym + ' – ' + institution.navn,
              value: institution.id
            }))
          })
        }
      }
    })
  }

  if (institutionList && _institutions) {
    _institutionValueList = _institutions.map(item => {
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
    setValidation(_.omitBy(_validation, (value, key) => key === _key))
  }, [setValidation, _validation])

  const setValidationState = useCallback((key: string, value: FeiloppsummeringFeil): void => {
    const newValidation: Validation = _.cloneDeep(_validation)
    newValidation[key] = value
    setValidation(newValidation)
  }, [setValidation, _validation])

  const validateCountries = useCallback((country: CountryRawList): boolean => {
    if (_.isEmpty(country)) {
      setValidationState('country', {
        feilmelding: t('buc:validation-chooseCountry'),
        skjemaelementId: 'a-buc-c-sedstart__country-select-id'
      } as FeiloppsummeringFeil)
      return false
    } else {
      resetValidationState('country')
      return true
    }
  }, [resetValidationState, setValidationState, t])

  const validateSed = (sed: string | undefined): boolean => {
    if (!sed) {
      setValidationState('sed', {
        skjemaelementId: 'a-buc-c-sedstart__sed-select-id',
        feilmelding: t('buc:validation-chooseSed')
      } as FeiloppsummeringFeil)
      return false
    } else {
      resetValidationState('sed')
      return true
    }
  }

  const validateAvdodFnr = (_avdod: PersonAvdod | null | undefined): boolean => {
    if (!_avdod) {
      setValidationState('avdodfnr', {
        skjemaelementId: 'a-buc-c-bucstart__avdod-input-id',
        feilmelding: t('buc:validation-chooseAvdodFnr')
      } as FeiloppsummeringFeil)
      return false
    } else {
      resetValidationState('avdodfnr')
      return true
    }
  }

  const validateInstitutions = (institutions: InstitutionRawList): boolean => {
    if (_.isEmpty(institutions)) {
      setValidationState('institution', {
        skjemaelementId: 'a-buc-c-bucstart__avdod-input-id',
        feilmelding: t('buc:validation-chooseInstitution')
      } as FeiloppsummeringFeil)
      return false
    } else {
      resetValidationState('institution')
      return true
    }
  }

  const validateVedtakId = (vedtakId: string | undefined): boolean => {
    if (!vedtakId) {
      setValidationState('vedtak', {
        skjemaelementId: 'a-buc-c-sedstart__vedtakid-input-id',
        feilmelding: t('buc:validation-chooseVedtakId')
      } as FeiloppsummeringFeil)
      return false
    }
    if (!isNumber(vedtakId!)) {
      setValidationState('vedtak', {
        skjemaelementId: 'a-buc-c-sedstart__vedtakid-input-id',
        feilmelding: t('buc:validation-invalidVedtakId')
      } as FeiloppsummeringFeil)
      return false
    }
    resetValidationState('vedtak')
    return true
  }

  const _cancelSendAttachmentToSed = (): void => {
    setSendingAttachments(false)
    setAttachmentsSent(false)
    dispatch(resetSavingAttachmentJob())
  }

  const fetchInstitutionsForSelectedCountries = useCallback((countries: Options): void => {
    if (!_buc) {
      return
    }
    const newCountries: CountryRawList = countries ? countries.map(item => {
      return item.value
    }) : []

    const oldCountriesList: CountryRawList = _.cloneDeep(_countries)
    const addedCountries: CountryRawList = newCountries.filter(country => !oldCountriesList.includes(country))
    const removedCountries: CountryRawList = oldCountriesList.filter(country => !newCountries.includes(country))

    addedCountries.forEach(country => dispatch(getInstitutionsListForBucAndCountry(_buc.type!, country)))
    removedCountries.forEach(country => {
      const newInstitutions: InstitutionRawList = _institutions.filter(item => {
        const [_country] = item.split(':')
        return country !== _country
      })
      setInstitutions(newInstitutions)
    })
    setCountries(newCountries)
    validateCountries(newCountries)
  }, [_buc, _countries, dispatch, _institutions, setCountries, setInstitutions, validateCountries])

  const onAvdodFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAvdod({
      fnr: e.target.value
    } as PersonAvdod)
  }

  const onSedChange = (option: ValueType<Option> | null | undefined): void => {
    setSed((option as Option).value)
  }

  const onInstitutionsChange = (institutions: ValueType<Option | GroupType<Option>>): void => {
    const newInstitutions: InstitutionRawList = institutions ? (institutions as unknown as Options).map(institution => institution.value) : []
    setInstitutions(newInstitutions)
  }

  const onCountriesChange = (countries: ValueType<Option> | null | undefined): void => {
    fetchInstitutionsForSelectedCountries(countries as Options)
  }

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const vedtakId = e.target.value
    setVedtakId(vedtakId)
  }

  const getSpinner = (text: string): JSX.Element => (
    <WaitingPanel size='S' message={t(text)} oneLine />
  )

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems): void => {
    const sedOriginalAttachments: JoarkBrowserItems = _.filter(_sedAttachments, (att) => att.type !== 'joark')
    const newAttachments: JoarkBrowserItems = sedOriginalAttachments.concat(jbi).sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }

  const resetJoarkAttachments = useCallback((): void => {
    const newAttachments: JoarkBrowserItems = _.filter(_sedAttachments, (att) => att.type !== 'joark')
      .sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }, [_sedAttachments])

  const onRowViewDelete = (newAttachments: JoarkBrowserItems): void => {
    setSedAttachments(newAttachments)
  }

  const bucHasSedsWithAtLeastOneInstitution = (): boolean => {
    if (_buc.seds) {
      return _(_buc.seds).find(sed => {
        return _.isArray(sed.participants) && !_.isEmpty(sed.participants)
      }) !== undefined
    }
    return false
  }

  const sedNeedsVedtakId = (): boolean => (_sed === 'P6000' || _sed === 'P7000')

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const sedCanHaveAttachments = useCallback((): boolean => {
    return _sed !== undefined && sedsWithAttachments[_sed]
  }, [_sed, sedsWithAttachments])

  const convertInstitutionIDsToInstitutionObjects = (): Institutions => {
    const institutions: Institutions = []
    _institutions.forEach(item => {
      Object.keys(institutionList!).forEach((landkode: string) => {
        const found: RawInstitution | undefined = _.find(institutionList![landkode], { id: item })
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

  const resetSedForm = useCallback((): void => {
    setSed(undefined)
    dispatch(resetSed())
    setSed(undefined)
    setInstitutions([])
    setCountries([])
  }, [dispatch])

  const performValidation = () => {
    let valid: boolean = true
    valid = valid && validateSed(_sed)
    if (!bucHasSedsWithAtLeastOneInstitution()) {
      valid = valid &&
        validateInstitutions(_institutions) &&
        validateCountries(_countries)
    }
    if (sedNeedsVedtakId()) {
      valid = valid && validateVedtakId(_vedtakId)
    }
    if (needsAvdodFnrInput()) {
      valid = valid && validateAvdodFnr(_avdod)
    }
    return valid
  }

  const onForwardButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const valid: boolean = performValidation()
    if (valid) {
      const institutions: Institutions = convertInstitutionIDsToInstitutionObjects()
      const payload: NewSedPayload = {
        sakId: sakId!,
        buc: _buc.type!,
        sed: _sed!,
        institutions: institutions,
        aktoerId: aktoerId!,
        euxCaseId: _buc.caseId!
      }
      if (sedNeedsVedtakId()) {
        payload.vedtakId = _vedtakId
      }
      if (needsAvdod()) {
        payload.avdodfnr = _avdod?.fnr
      }
      if ((_buc as ValidBuc).subject) {
        payload.subject = (_buc as ValidBuc).subject
      }
      if (currentSed) {
        dispatch(createReplySed(_buc, payload, currentSed))
      } else {
        dispatch(createSed(_buc, payload))
      }
      buttonLogger(e, payload)
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    resetSedForm()
    onSedCancelled()
  }

  const isNumber = (string: string): boolean => string.match(/^\d+$/g) !== null

  const _onSaved = (savingAttachmentsJob: SavingAttachmentsJob): void => {
    const newAttachments: JoarkBrowserItems = savingAttachmentsJob.saved
      .concat(savingAttachmentsJob.remaining)
      .sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }

  const _onFinished = useCallback((): void => {
    resetSedForm()
    dispatch(resetSed())
    dispatch(resetSedAttachments())
    resetJoarkAttachments()
    setSedSent(false)
    if (_attachmentsSent) {
      setAttachmentsSent(false)
    }
    setSendingAttachments(false)
    setSed(undefined)
    setInstitutions([])
    setCountries([])
    onSedCreated()
  }, [_attachmentsSent, dispatch, onSedCreated, resetJoarkAttachments, resetSedForm])

  useEffect(() => {
    if (_.isEmpty(countryList) && _buc && _buc.type && !loading.gettingCountryList) {
      dispatch(getCountryList(_buc.type))
    }
  }, [countryList, dispatch, loading, _buc])

  useEffect(() => {
    if (!_mounted) {
      dispatch(!currentSed
        ? getSedList(_buc as ValidBuc)
        : setSedList([currentSed.type])
      )
      if (currentSed) {
        setSed(currentSed.type)
      }
      if (_buc && _buc.type !== null && !_.isEmpty(_countries)) {
        _countries.forEach(country => {
          if (!institutionList || !Object.keys(institutionList).includes(country)) {
            dispatch(getInstitutionsListForBucAndCountry(_buc.type!, country))
          }
        })
      }
      setMounted(true)
    }
  }, [_buc, bucs, _countries, currentBuc, currentSed, dispatch, institutionList, _mounted])

  useEffect(() => {
    if (sed && !_sedSent) {
      setSedSent(true)
    }
    // if sed is sent, we can start sending attachments
    if (_sedSent && !_sendingAttachments && !_attachmentsSent) {
      // we may have now a chosen sed which does not allow vedlegg, but maybe previously the sb chose some vedlegg
      // using another selected sed, so check before createing a savingAttachmentJob
      if (!sedCanHaveAttachments()) {
        _onFinished()
        return
      }

      const joarksToUpload: JoarkBrowserItems = _.filter(_sedAttachments, (att) => att.type === 'joark')

      if (_.isEmpty(joarksToUpload)) {
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('SEDStart: No attachments to send, concluding')
        }
        _onFinished()
        return
      }

      // attachments to send -> start a savingAttachmentsJob
      setSendingAttachments(true)
      setAttachmentsTableVisible(false)
      standardLogger('sed.new.attachments.data', {
        numberOfJoarkAttachments: joarksToUpload.length
      })
      dispatch(createSavingAttachmentJob(joarksToUpload))
    }
  }, [_attachmentsSent, dispatch, _onFinished, _sendingAttachments, _sedAttachments, sedCanHaveAttachments, sed, _sedSent])

  useEffect(() => {
    if (_.isArray(sedList) && sedList.length === 1 && !_sed) {
      setSed(sedList[0])
    }
  }, [sedList, _sed, setSed])

  useEffect(() => {
    if (_buc.type === 'P_BUC_02' && (_buc as ValidBuc).subject && _avdod === undefined) {
      let avdod: PersonAvdod | undefined | null = _.find(personAvdods, p =>
        p.fnr === (_buc as ValidBuc)?.subject?.avdod?.fnr
      )
      if (avdod === undefined) {
        avdod = null
      }
      setAvdod(avdod)
    }
  }, [_avdod, _buc, personAvdods])

  if (_.isEmpty(bucs) || !currentBuc) {
    return <div />
  }

  // @ts-ignore
  return (
    <SEDStartDiv>
      <Systemtittel>
        {!currentSed ? t('buc:step-startSEDTitle', {
          buc: t(`buc:buc-${_buc?.type}`),
          sed: _sed || t('buc:form-newSed')
        }) : t('buc:step-replySEDTitle', {
          buc: t(`buc:buc-${_buc?.type}`),
          sed: _buc.seds!.find((sed: Sed) => sed.id === currentSed)!.type
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
              data-test-id='a-buc-c-sedstart__sed-select-id'
              disabled={loading.gettingSedList}
              highContrast={highContrast}
              id='a-buc-c-sedstart__sed-select-id'
              isSearchable
              feil={_validation.sed ? t(_validation.sed.feilmelding) : undefined}
              menuPortalTarget={document.getElementById('main')}
              onChange={onSedChange}
              options={_sedOptions}
              placeholder={t('buc:form-chooseSed')}
              value={_.find(_sedOptions, (f: any) => f.value === _sed) || null}
            />
          </>
          {sedNeedsVedtakId() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                disabled
                data-test-id='a-buc-c-sedstart__vedtakid-input-id'
                id='a-buc-c-sedstart__vedtakid-input-id'
                label={t('buc:form-vedtakId')}
                bredde='fullbredde'
                value={vedtakId || ''}
                onChange={onVedtakIdChange}
                placeholder={t('buc:form-noVedtakId')}
                feil={_validation.vedtak ? t(_validation.vedtak.feilmelding) : null}
              />
            </>
          )}
          {_buc.type === 'P_BUC_02' && personAvdods && (
            <>
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
                      {renderAvdodName(personAvdods[0], t)}
                    </Normaltekst>
                  </FlexDiv>
                </>
              )}
            </>
          )}
          {needsAvdodFnrInput() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                label={t('buc:form-avdodfnr')}
                data-test-id='a-buc-c-bucstart__avdod-input-id'
                placeholder={t('buc:form-chooseAvdodFnr')}
                onChange={onAvdodFnrChange}
                feil={_validation.avdodfnr ? t(_validation.avdodfnr.feilmelding) : null}
              />
            </>
          )}
          {!currentSed && (
            <>
              <VerticalSeparatorDiv />
              <CountrySelect
                ariaLabel={t('ui:country')}
                aria-describedby='help-country'
                closeMenuOnSelect={false}
                data-test-id='a-buc-c-sedstart__country-select-id'
                disabled={loading.gettingCountryList}
                error={_validation.country ? t(_validation.country.feilmelding) : null}
                flagType='circle'
                hideSelectedOptions={false}
                highContrast={highContrast}
                id='a-buc-c-sedstart__country-select-id'
                includeList={countryList}
                isLoading={loading.gettingCountryList}
                isMulti
                label={t('ui:country')}
                onOptionSelected={onCountriesChange}
                options={_countryObjectList}
                placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t('buc:form-chooseCountry')}
                value={_countryValueList}
              />
              <VerticalSeparatorDiv />
              <MultipleSelect<GroupType<Option> | Option>
                ariaLabel={t('ui:institution')}
                aria-describedby='help-institution'
                data-test-id='a-buc-c-sedstart__institution-select-id'
                disabled={loading.gettingInstitutionList}
                error={_validation.institution ? t(_validation.institution.feilmelding) : undefined}
                hideSelectedOptions={false}
                highContrast={highContrast}
                id='a-buc-c-sedstart__institution-select-id'
                isLoading={loading.gettingInstitutionList}
                label={t('ui:institution')}
                options={_institutionObjectList}
                onSelect={onInstitutionsChange}
                placeholder={loading.gettingInstitutionList ? getSpinner('buc:loading-institution') : t('buc:form-chooseInstitution')}
                values={_institutionValueList}
              />
              <VerticalSeparatorDiv data-size='2' />
              <label className='skjemaelement__label'>
                {t('buc:form-chosenInstitutions')}
              </label>
              <VerticalSeparatorDiv />
              <InstitutionsDiv>
                <InstitutionList
                  institutions={_institutions.map(item => {
                    const [country, institution] = item.split(':')
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
              data-test-id='a-buc-c-sedstart__forward-button-id'
              disabled={loading.creatingSed || _sendingAttachments}
              spinner={loading.creatingSed || _sendingAttachments}
              onClick={onForwardButtonClick}
            >
              {loading.creatingSed ? t('buc:loading-creatingSED')
                : _sendingAttachments ? t('buc:loading-sendingSEDattachments')
                  : t('buc:form-orderSED')}
            </HighContrastHovedknapp>
            <HorizontalSeparatorDiv />
            <HighContrastFlatknapp
              data-amplitude='sed.new.cancel'
              data-test-id='a-buc-c-sedstart__cancel-button-id'
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
                onClick={() => setAttachmentsTableVisible(!_attachmentsTableVisible)}
              >
                {t(_attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
              </HighContrastKnapp>
              <VerticalSeparatorDiv />
              {_attachmentsTableVisible && (
                <SEDAttachmentModal
                  highContrast={highContrast}
                  onModalClose={() => setAttachmentsTableVisible(false)}
                  onFinishedSelection={onJoarkAttachmentsChanged}
                  sedAttachments={_sedAttachments}
                  tableId='newsed-modal'
                />
              )}
              {!_.isEmpty(_sedAttachments) && (
                <>
                  <VerticalSeparatorDiv />
                  <JoarkBrowser
                    mode='view'
                    existingItems={_sedAttachments}
                    highContrast={highContrast}
                    onRowViewDelete={onRowViewDelete}
                    tableId='newsed-view'
                  />
                </>
              )}
            </>
          )}
          <Column>
            {(_sendingAttachments || _attachmentsSent) && sed && (
              <SEDAttachmentSenderDiv>
                <>
                  <SEDAttachmentSender
                    attachmentsError={attachmentsError}
                    payload={{
                      aktoerId: aktoerId,
                      rinaId: _buc.caseId,
                      rinaDokumentId: sed!.id
                    } as SEDAttachmentPayload}
                    onSaved={_onSaved}
                    onFinished={_onFinished}
                    onCancel={_cancelSendAttachmentToSed}
                    sendAttachmentToSed={_sendAttachmentToSed}
                  />
                  <VerticalSeparatorDiv />
                </>
              </SEDAttachmentSenderDiv>
            )}
          </Column>
        </Column>
      </Row>
      {!hasNoValidationErrors() && (
        <>
          <VerticalSeparatorDiv data-size='2' />
          <Row>
            <Column>
              <Feiloppsummering
                data-test-id='a-buc-c-sedstart__feiloppsummering-id'
                feil={Object.values(_validation)}
                tittel={t('buc:form-feiloppsummering')}
              />
            </Column>
            <HorizontalSeparatorDiv data-size='2' />
            <Column />
          </Row>
        </>
      )}
    </SEDStartDiv>
  )
}

SEDStart.propTypes = {
  aktoerId: PT.string.isRequired,
  bucs: BucsPropType.isRequired,
  currentBuc: PT.string.isRequired,
  initialAttachments: PT.arrayOf(JoarkBrowserItemFileType.isRequired),
  initialSed: PT.string,
  initialSendingAttachments: PT.bool,
  onSedCreated: PT.func.isRequired,
  onSedCancelled: PT.func.isRequired
}

export default SEDStart
