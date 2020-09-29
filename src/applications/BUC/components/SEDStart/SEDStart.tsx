import {
  createReplySed,
  createSavingAttachmentJob,
  createSed,
  getCountryList,
  getInstitutionsListForBucAndCountry,
  getSedList, resetSavingAttachmentJob,
  resetSed,
  resetSedAttachments,
  sendAttachmentToSed,
  setSedList
} from 'actions/buc'
import {
  getBucTypeLabel,
  renderAvdodName,
  sedAttachmentSorter,
  sedFilter
} from 'applications/BUC/components/BUCUtils/BUCUtils'
import InstitutionList from 'applications/BUC/components/InstitutionList/InstitutionList'
import SEDAttachmentModal from 'applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import { BUCMode } from 'applications/BUC/index'
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
  Buc,
  Bucs,
  InstitutionListMap,
  Institutions,
  NewSedPayload,
  RawInstitution,
  SavingAttachmentsJob,
  Sed,
  SedsWithAttachmentsMap,
  ValidBuc
} from 'declarations/buc'
import {
  PersonAvdod,
  PersonAvdods
  ,
  AllowedLocaleString,
  Country,
  FeatureToggles,
  Loading,
  Option,
  PesysContext,
  Validation
} from 'declarations/types'
import { BucsPropType } from 'declarations/buc.pt'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'
// import { JoarkBrowserItemFileType } from 'declarations/joark.pt'
import { State } from 'declarations/reducers'

import CountryData from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
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
const InstitutionsDiv = styled.div``
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
  initialAttachments ?: JoarkBrowserItems
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
  onSedCreated,
  onSedCancelled
} : SEDStartProps): JSX.Element | null => {
  const {
    attachmentsError, countryList, currentSed, featureToggles, highContrast, institutionList, loading,
    locale, personAvdods, pesysContext, sakId, sed, sedList, sedsWithAttachments, vedtakId
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
            ? sed.participants.filter(p => p.role === 'Sender')
              .map(p => {
                return _.get(p.organisation, prop)
              })
            : []
        })
      : []
    return Array.from(new Set(_.flatten(institutions))) // remove duplicates
  }

  const [_avdod, setAvdod] = useState<PersonAvdod | null | undefined>(undefined)
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
  const institutionObjectList: Array<{ label: string, options: Array<Option> }> = []
  const [mounted, setMounted] = useState<boolean>(false)
  const notHostInstitution = (institution: RawInstitution) => institution.id !== 'NO:DEMO001'
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(initialAttachments)
  const [sedSent, setSedSent] = useState<boolean>(false)
  const [sendingAttachments, setSendingAttachments] = useState<boolean>(false)
  const [validation, setValidation] = useState<Validation>({})
  const [_vedtakId, setVedtakId] = /* istanbul ignore next */ useState<string | undefined>(vedtakId)

  const needsAvdod = (): boolean => (
    buc.type === 'P_BUC_02'
  )

  const hasNoValidationErrors = (): boolean => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const needsAvdodFnrInput = (): boolean => {
    return buc.type === 'P_BUC_02' &&
    (!personAvdods || _.isEmpty(personAvdods)) &&
    pesysContext !== constants.VEDTAKSKONTEKST &&
    (buc?.creator?.country !== 'NO' ||
      (buc?.creator?.country === 'NO' && buc?.creator?.institution === 'NO:NAVAT08'))
  }

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

  const setValidationState = useCallback((key: string, value: any): void => {
    const newValidation = _.cloneDeep(validation)
    newValidation[key] = value
    setValidation(newValidation)
  }, [setValidation, validation])

  const validateCountries = useCallback((country: Array<string>): boolean => {
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

  const validateInstitutions = (institutions: Array<string>): boolean => {
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

  const onAvdodFnrChange = (e: any) => {
    setAvdod({
      fnr: e.target.value
    } as PersonAvdod)
  }

  const onSedChange = (e: any) => {
    const thisSed = e.value
    setSed(thisSed)
  }

  const onInstitutionsChange = (institutions: Array<Option>) => {
    const newInstitutions = institutions ? institutions.map(institution => {
      return institution.value
    }) : []
    setInstitutions(newInstitutions)
  }

  const onCountriesChange = (countries: Array<Country>) => {
    fetchInstitutionsForSelectedCountries(countries)
  }

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vedtakId = e.target.value
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

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems) => {
    const sedOriginalAttachments = _.filter(sedAttachments, (att) => att.type !== 'joark')
    const newAttachments = sedOriginalAttachments.concat(jbi).sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }

  const resetJoarkAttachments = useCallback(() => {
    const newAttachments = _.filter(sedAttachments, (att) => att.type !== 'joark')
      .sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }, [sedAttachments])

  const onRowViewDelete = (newAttachments: JoarkBrowserItems) => {
    setSedAttachments(newAttachments)
  }

  const bucHasSedsWithAtLeastOneInstitution = (): boolean => {
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

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const sedCanHaveAttachments = useCallback((): boolean => {
    return _sed !== undefined && sedsWithAttachments[_sed]
  }, [_sed, sedsWithAttachments])

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

  const resetSedForm = useCallback(() => {
    setSed(undefined)
    dispatch(resetSed())
    setSed(undefined)
    setInstitutions([])
    setCountries([])
  }, [dispatch])

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
    if (needsAvdodFnrInput()) {
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
      if (sedNeedsVedtakId()) {
        payload.vedtakId = _vedtakId
      }
      if (needsAvdod()) {
        payload.avdodfnr = _avdod?.fnr
      }
      if ((buc as ValidBuc).subject) {
        payload.subject = (buc as ValidBuc).subject
      }
      if (currentSed) {
        dispatch(createReplySed(buc, payload, currentSed))
      } else {
        dispatch(createSed(buc, payload))
      }
      buttonLogger(e, payload)
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent) => {
    buttonLogger(e)
    resetSedForm()
    onSedCancelled()
  }

  const isNumber = (s: string) => {
    return s.match(/^\d+$/g) !== null
  }

  const _onSaved = (savingAttachmentsJob: SavingAttachmentsJob) => {
    const newAttachments = savingAttachmentsJob.saved
      .concat(savingAttachmentsJob.remaining)
      .sort(sedAttachmentSorter)
    setSedAttachments(newAttachments)
  }

  const _onFinished = useCallback(() => {
    resetSedForm()
    dispatch(resetSed())
    dispatch(resetSedAttachments())
    resetJoarkAttachments()
    setSedSent(false)
    if (attachmentsSent) {
      setAttachmentsSent(false)
    }
    setSendingAttachments(false)
    setSed(undefined)
    setInstitutions([])
    setCountries([])
    onSedCreated()
  }, [attachmentsSent, dispatch, resetJoarkAttachments, resetSedForm, onSedCreated])

  const sedOptions = renderOptions(sedList)

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
      // we may have now a chosen sed which does not allow vedlegg, but maybe previously the sb chose some vedlegg
      // using another selected sed, so check before createing a savingAttachmentJob
      if (!sedCanHaveAttachments()) {
        _onFinished()
        return
      }

      const joarksToUpload: JoarkBrowserItems =
        _.filter(sedAttachments, (att) => att.type === 'joark')

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
  }, [dispatch, _onFinished, sendingAttachments, sedAttachments, sedCanHaveAttachments, attachmentsSent, sed, sedSent])

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
    if (buc.type === 'P_BUC_02' && (buc as ValidBuc).subject && _avdod === undefined) {
      let avdod: PersonAvdod | undefined | null = _.find(personAvdods, p =>
        p.fnr === (buc as ValidBuc)?.subject?.avdod?.fnr
      )
      if (avdod === undefined) {
        avdod = null
      }
      setAvdod(avdod)
    }
  }, [_avdod, buc, personAvdods])

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
              data-test-id='a-buc-c-sedstart__sed-select-id'
              id='a-buc-c-sedstart__sed-select-id'
              disabled={loading.gettingSedList}
              isSearchable
              placeholder={t('buc:form-chooseSed')}
              onChange={onSedChange}
              options={sedOptions}
              value={_.find(sedOptions, (f: any) => f.value === _sed) || null}
              feil={validation.sed ? t(validation.sed.feilmelding) : null}
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
                feil={validation.vedtak ? t(validation.vedtak.feilmelding) : null}
              />
            </>
          )}
          {buc.type === 'P_BUC_02' && personAvdods && (
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
                feil={validation.avdodfnr ? t(validation.avdodfnr.feilmelding) : null}
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
                data-test-id='a-buc-c-sedstart__country-select-id'
                id='a-buc-c-sedstart__country-select-id'
                disabled={loading.gettingCountryList}
                isLoading={loading.gettingCountryList}
                placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t('buc:form-chooseCountry')}
                aria-describedby='help-country'
                value={countryValueList}
                hideSelectedOptions={false}
                closeMenuOnSelect={false}
                flagType='circle'
                onOptionSelected={onCountriesChange}
                options={countryObjectList}
                includeList={countryList}
                error={validation.country ? t(validation.country.feilmelding) : null}
              />
              <VerticalSeparatorDiv />
              <MultipleSelect
                highContrast={highContrast}
                ariaLabel={t('ui:institution')}
                label={t('ui:institution')}
                data-test-id='a-buc-c-sedstart__institution-select-id'
                disabled={loading.gettingInstitutionList}
                isLoading={loading.gettingInstitutionList}
                placeholder={loading.gettingInstitutionList ? getSpinner('buc:loading-institution') : t('buc:form-chooseInstitution')}
                aria-describedby='help-institution'
                values={institutionValueList}
                onSelect={onInstitutionsChange}
                hideSelectedOptions={false}
                options={institutionObjectList}
                error={validation.institution ? t(validation.institution.feilmelding) : undefined}
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
              data-test-id='a-buc-c-sedstart__forward-button-id'
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
                onClick={() => setAttachmentsTableVisible(!attachmentsTableVisible)}
              >
                {t(attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
              </HighContrastKnapp>
              <VerticalSeparatorDiv />
              {attachmentsTableVisible && (
                <SEDAttachmentModal
                  tableId='newsed-modal'
                  sedAttachments={sedAttachments}
                  onModalClose={() => setAttachmentsTableVisible(false)}
                  onFinishedSelection={onJoarkAttachmentsChanged}
                />
              )}
              {!_.isEmpty(sedAttachments) && (
                <>
                  <VerticalSeparatorDiv />
                  <JoarkBrowser
                    tableId='newsed-view'
                    mode='view'
                    highContrast={highContrast}
                    existingItems={sedAttachments}
                    onRowViewDelete={onRowViewDelete}
                  />
                </>
              )}
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
                    onSaved={_onSaved}
                    onFinished={_onFinished}
                    onCancel={_cancelSendAttachmentToSed}
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
                tittel={t('buc:form-feiloppsummering')}
                feil={Object.values(validation)}
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
  // initialAttachments: PT.arrayOf(JoarkBrowserItemFileType.isRequired).isRequired,
  onSedCreated: PT.func.isRequired,
  onSedCancelled: PT.func.isRequired
}

export default SEDStart
