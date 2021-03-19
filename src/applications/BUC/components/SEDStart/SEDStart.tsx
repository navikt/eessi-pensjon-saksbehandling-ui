import {
  createReplySed,
  createSavingAttachmentJob,
  createSed,
  fetchKravDato,
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
  bucsThatSupportAvdod,
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
  HighContrastFeiloppsummering,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HighContrastInput,
  HighContrastKnapp,
  HighContrastRadioPanelGroup,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { IS_TEST } from 'constants/environment'
import {
  AllowedLocaleString,
  FeatureToggles,
  Loading,
  Option,
  Options,
  PesysContext,
  Validation
} from 'declarations/app.d'
import { KravOmValue, SakTypeKey } from 'declarations/buc'
import {
  AvdodOrSokerValue,
  Buc,
  Bucs,
  CountryRawList,
  Institution,
  InstitutionListMap,
  InstitutionNames,
  InstitutionRawList,
  Institutions,
  NewSedPayload,
  RawList,
  SakTypeMap,
  SakTypeValue,
  SavingAttachmentsJob,
  Sed,
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile,
  SEDRawList,
  SedsWithAttachmentsMap,
  ValidBuc
} from 'declarations/buc.d'
import { BucsPropType, SedPropType } from 'declarations/buc.pt'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'
import { JoarkBrowserItemFileType } from 'declarations/joark.pt'

import { PersonAvdod, PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import CountryData, { Country, CountryList } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { GroupTypeBase, ValueType } from 'react-select'
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
   align-items: flex-end;
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
  currentSed: Sed | undefined
  initialAttachments ?: JoarkBrowserItems
  initialSed ?: string | undefined
  initialSendingAttachments ?: boolean
  onSedChanged?: (newSed: string | null | undefined) => void
  onSedCreated: () => void
  onSedCancelled: () => void
  replySed: Sed | undefined
}

export interface SEDStartSelector {
  attachmentsError: boolean
  countryList: CountryRawList | undefined
  featureToggles: FeatureToggles
  highContrast: boolean
  institutionList: InstitutionListMap<Institution> | undefined
  institutionNames: InstitutionNames | undefined
  kravDato: string | null | undefined,
  kravId: string | undefined,
  loading: Loading
  locale: AllowedLocaleString
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakId?: string
  sakType: SakTypeValue | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
  sed: Sed | undefined
  sedsWithAttachments: SedsWithAttachmentsMap
  sedList: SEDRawList | undefined
  vedtakId: string | undefined
}

const mapState = /* istanbul ignore next */ (state: State): SEDStartSelector => ({
  attachmentsError: state.buc.attachmentsError,
  countryList: state.buc.countryList,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  institutionList: state.buc.institutionList,
  institutionNames: state.buc.institutionNames,
  kravDato: state.buc.kravDato,
  kravId: state.app.params.kravId,
  loading: state.loading,
  locale: state.ui.locale,
  personAvdods: state.app.personAvdods,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue,
  savingAttachmentsJob: state.buc.savingAttachmentsJob,
  sed: state.buc.sed,
  sedList: state.buc.sedList,
  sedsWithAttachments: state.buc.sedsWithAttachments,
  vedtakId: state.app.params.vedtakId
})

type KravOmCode = {[k in KravOmValue]: SakTypeKey}
const kravOmCode: KravOmCode = {
  Alderspensjon: 'ALDER',
  Etterlatteytelser: 'GJENLEV',
  Uføretrygd: 'UFOREP'
}

export const SEDStart: React.FC<SEDStartProps> = ({
  aktoerId,
  bucs,
  currentBuc,
  currentSed,
  initialAttachments = [],
  initialSed = undefined,
  initialSendingAttachments = false,
  onSedChanged,
  onSedCreated,
  onSedCancelled,
  replySed
} : SEDStartProps): JSX.Element => {
  const {
    attachmentsError, countryList, featureToggles, highContrast, institutionList, institutionNames, kravId, kravDato,
    loading, locale, personAvdods, pesysContext, sakId, sakType, sed, sedList, sedsWithAttachments, vedtakId
  }: SEDStartSelector = useSelector<State, SEDStartSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_timer, setTimer] = useState<any>(undefined)
  const [_bucIdForCooldown, setBucIdForCooldown] = useState<string | undefined>(undefined)
  const [_bucCooldown, setBucCooldown] = useState<number | undefined>(undefined)
  const bucCooldownInSeconds = 10

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
    return options
      ? options.map((el: Option | string) => {
          let label, value
          if (typeof el === 'string') {
            label = el
            value = el
          } else {
            value = el.value || el.institution
            label = el.label || el.name
          }
          return {
            label: getOptionLabel(label!),
            value: value
          } as Option
        })
      : []
  }

  const [_avdod, setAvdod] = useState<PersonAvdod | null | undefined>(undefined)
  const [_avdodFnr, setAvdodFnr] = useState<string | undefined>(undefined)
  const [_avdodOrSoker, setAvdodOrSoker] = useState<AvdodOrSokerValue | undefined>(undefined)
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const _buc: Buc = _.cloneDeep(bucs[currentBuc!])
  const [_countries, setCountries] = useState<CountryRawList>(
    featureToggles.SED_PREFILL_INSTITUTIONS ? prefill('countryCode') : [])
  const _countryData: CountryList = CountryData.getCountryInstance(locale)
  const [_institutions, setInstitutions] = useState<InstitutionRawList>(
    featureToggles.SED_PREFILL_INSTITUTIONS ? prefill('id') : []
  )
  const [_kravDato, setKravDato] = useState<string>(kravDato || '')
  const [_kravOm, setKravOm] = useState<KravOmValue | undefined>(undefined)
  const [_mounted, setMounted] = useState<boolean>(false)
  const _notHostInstitution = (institution: Institution) : boolean => institution.institution !== 'NO:DEMO001'
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [_sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(initialAttachments)
  const _sedOptions: Options = renderOptions(sedList)
  const [_sedSent, setSedSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_validation, setValidation] = useState<Validation>({})
  const [_vedtakId, setVedtakId] = useState<string | undefined>(vedtakId)

  // BEGIN QUESTIONS

  // norway as case owner (except some mock institutions that should simulate foreign institutions)
  const isNorwayCaseOwner = (): boolean => _buc?.creator?.country === 'NO' &&
    (_buc?.creator?.institution !== 'NO:NAVAT06' && _buc?.creator?.institution !== 'NO:NAVAT08')

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  // SEDs that use avdod
  const sedSupportsAvdod = useCallback((): boolean => bucsThatSupportAvdod(_buc.type), [_buc])

  const avdodExists = (): boolean => (personAvdods ? personAvdods.length > 0 : false)

  const sedNeedsVedtakId = ['P6000', 'P7000']

  const sedPrefillsCountriesAndInstitutions = ['P4000', 'P5000', 'P6000', 'P7000', 'P8000', 'P10000', 'H020', 'H070', 'H120', 'H121']

  const sedFreezesCountriesAndInstitutions = ['P4000', 'P5000', 'P6000', 'P7000', 'H070', 'H121']

  const sedNeedsKravOm = (sed: string) => ['P15000'].indexOf(sed) >= 0

  const sedNeedsKravdato = (sed: string) => ['P15000'].indexOf(sed) >= 0

  const sedNeedsAvdodBrukerQuestion = (): boolean => _buc.type === 'P_BUC_05' && _sed === 'P8000' &&
    (pesysContext !== VEDTAKSKONTEKST
      ? (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)
      : (personAvdods?.length === 1
          ? (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP || sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP)
          : (personAvdods?.length === 2
              ? (sakType === SakTypeMap.BARNEP)
              : false
            )
        )
    )

  // if SED has a prefilled avdod and supports avdod, then let's render avdod name
  const sedHasFixedAvdod = (): boolean => !!(_avdod && sedSupportsAvdod())

  // When to show Avdods fnr? When we are in avdod-supported SED, not vedtakscontext, no avdod in sight and extra conditions
  const sedNeedsAvdodFnrInput = (): boolean => {
    const answer = (
      sedSupportsAvdod() &&
      !avdodExists() &&
      (
        (
          _buc.type === 'P_BUC_10' && _sed === 'P15000'
        ) ||
        (
          pesysContext !== constants.VEDTAKSKONTEKST &&
          (
            (_buc.type === 'P_BUC_02'
              ? !isNorwayCaseOwner()
              : (_buc.type === 'P_BUC_05'
                  ? (isNorwayCaseOwner()
                      ? sedNeedsAvdodBrukerQuestion()
                      : (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)
                    )
                  : false
                )
            )
          )
        )
      )
    )
    return answer
  }

  const sedCanHaveAttachments = useCallback((): boolean => {
    return _sed !== undefined && sedsWithAttachments[_sed]
  }, [_sed, sedsWithAttachments])

  const isNumber = (string: string): boolean => string.match(/^\d+$/g) !== null

  // END QUESTIONS

  // Manage Institution / country options

  const getParticipantCountriesWithoutNorway = (): CountryRawList => {
    const countries: RawList = bucs[currentBuc!].institusjon
      ? bucs[currentBuc!].institusjon!.map((inst: Institution) => inst.country)
      : []
    return _.uniq(_.filter(countries, (c: string) => c !== 'NO'))
  }

  const getParticipantInstitutionsWithoutNorway = (): InstitutionRawList => {
    const institutions: RawList = bucs[currentBuc!].institusjon
      ? bucs[currentBuc!].institusjon!
        .filter((inst: Institution) => inst.country !== 'NO')
        .map((inst: Institution) => inst.institution)
      : []
    return _.uniq(institutions)
  }

  const isDisabled = _sed ? !isNorwayCaseOwner() && sedFreezesCountriesAndInstitutions.indexOf(_sed) >= 0 : false

  const _countryIncludeList: CountryRawList = countryList
    ? (isNorwayCaseOwner() ? countryList : getParticipantCountriesWithoutNorway())
    : []
  const _countryValueList = _countries ? _countryData.filterByValueOnArray(_countries).sort(labelSorter) : []
  const _institutionObjectList: Array<GroupTypeBase<Option>> = []
  let _institutionValueList: Options = []

  if (institutionList) {
    Object.keys(institutionList).forEach((landkode: string) => {
      if (_.includes(_countries, landkode)) {
        const country: Country | undefined = _countryData.findByValue(landkode)
        if (country) {
          _institutionObjectList.push({
            label: country.label,
            options: institutionList[landkode].filter(_notHostInstitution).map((institution: Institution) => ({
              label: `${institution.acronym} – ${institution.name} (${institution.institution})`,
              value: institution.institution
            }))
          })
        }
      }
    })
  }

  if (institutionList && _institutions) {
    _institutionValueList = _institutions.map(institution => {
      return {
        label: institutionNames && institutionNames[institution] ? institutionNames[institution].name : institution,
        value: institutionNames && institutionNames[institution] ? institutionNames[institution].institution : institution
      }
    })
  }

  const bucHasSedsWithAtLeastOneInstitution = useCallback((): boolean => {
    if (_buc.seds) {
      return _.find(_buc.seds, sed => _.isArray(sed.participants) && !_.isEmpty(sed.participants)) !== undefined
    }
    return false
  }, [_buc])

  const updateValidation = useCallback((_key: string, validationError: FeiloppsummeringFeil | undefined) => {
    if (!validationError) {
      const newValidation = _.cloneDeep(_validation)
      newValidation[_key] = undefined
      setValidation(newValidation)
    }
  }, [_validation])

  const validateKravDato = (kravDato: string | undefined): FeiloppsummeringFeil | undefined => {
    if ((!kravDato || kravDato?.length === 0) && pesysContext === VEDTAKSKONTEKST) {
      return {
        feilmelding: t('buc:validation-chooseKravDato'),
        skjemaelementId: 'a-buc-c-sedstart__kravDato-input-id'
      } as FeiloppsummeringFeil
    }
    if (kravDato && !kravDato.match(/\d{2}-\d{2}-\d{4}/)) {
      return {
        skjemaelementId: 'a-buc-c-sedstart__kravDato-input-id',
        feilmelding: t('buc:validation-badKravDato')
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateSed = (sed: string | undefined): FeiloppsummeringFeil | undefined => {
    if (!sed) {
      return {
        feilmelding: t('buc:validation-chooseSed'),
        skjemaelementId: 'a-buc-c-sedstart__sed-select-id'
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateInstitutions = (institutions: InstitutionRawList): FeiloppsummeringFeil | undefined => {
    if (!bucHasSedsWithAtLeastOneInstitution() && _.isEmpty(institutions)) {
      return {
        feilmelding: t('buc:validation-chooseInstitution'),
        skjemaelementId: 'a-buc-c-sedstart__institution-select-id'
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateCountries = useCallback((country: CountryRawList): FeiloppsummeringFeil | undefined => {
    if (!bucHasSedsWithAtLeastOneInstitution() && _.isEmpty(country)) {
      return {
        feilmelding: t('buc:validation-chooseCountry'),
        skjemaelementId: 'a-buc-c-sedstart__country-select-id'
      } as FeiloppsummeringFeil
    }
    return undefined
  }, [t, bucHasSedsWithAtLeastOneInstitution])

  const validateVedtakId = (vedtakId: string | undefined): FeiloppsummeringFeil | undefined => {
    if (!vedtakId) {
      return {
        feilmelding: t('buc:validation-chooseVedtakId'),
        skjemaelementId: 'a-buc-c-sedstart__vedtakid-input-id'
      } as FeiloppsummeringFeil
    }
    if (!isNumber(vedtakId!)) {
      return {
        feilmelding: t('buc:validation-invalidVedtakId'),
        skjemaelementId: 'a-buc-c-sedstart__vedtakid-input-id'
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateKravOm = (kravOm: string | undefined): FeiloppsummeringFeil | undefined => {
    if (!kravOm) {
      return {
        feilmelding: t('buc:validation-chooseKravOm'),
        skjemaelementId: 'a-buc-c-sedstart__kravOm-radiogroup-id'
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateAvdodOrSoker = (_avdodOrSoker: AvdodOrSokerValue | undefined): FeiloppsummeringFeil | undefined => {
    if (!_avdodOrSoker) {
      return {
        feilmelding: t('buc:validation-chooseAvdodOrSoker'),
        skjemaelementId: 'a-buc-c-sedstart__avdodorsoker-radiogroup-id'
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const _cancelSendAttachmentToSed = (): void => {
    setSendingAttachments(false)
    setAttachmentsSent(false)
    dispatch(resetSavingAttachmentJob())
  }

  const fetchInstitutionsForSelectedCountries = useCallback((countries: Options | CountryRawList): void => {
    if (!_buc) {
      return
    }
    let newCountries: CountryRawList = []
    if (!_.isEmpty(countries)) {
      if (typeof countries[0] === 'string') {
        newCountries = countries as CountryRawList
      } else {
        newCountries = (countries as Options).map(item => item.value)
      }
    }

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
    updateValidation('country', validateCountries(newCountries))
  }, [_buc, _countries, dispatch, _institutions, setCountries, setInstitutions, updateValidation, validateCountries])

  const onAvdodOrSokerChange = (e: any): void => {
    const avdodorsoker: AvdodOrSokerValue = e.target.value as AvdodOrSokerValue
    setAvdodOrSoker(avdodorsoker)
    updateValidation('avdodorsoker', validateAvdodOrSoker(avdodorsoker))
  }

  const onAvdodFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newAvdodFnr: string | undefined = e.target.value
    setAvdodFnr(newAvdodFnr)
  }

  const setDefaultKravOm = () => {
    if (sakType === SakTypeMap.ALDER) {
      setKravOm('Alderspensjon' as KravOmValue)
      return
    }
    if (sakType === SakTypeMap.UFOREP) {
      setKravOm('Uføretrygd' as KravOmValue)
      return
    }
    setKravOm('Etterlatteytelser')
  }

  const handleSedChange = useCallback((newSed: string) => {
    setSed(newSed)
    // reset all validations, to clear validations of extra options that may be hidden now
    setValidation({
      sed: validateSed(newSed)
    })
    if (!isNorwayCaseOwner() && sedPrefillsCountriesAndInstitutions.indexOf(newSed) >= 0) {
      const countries: CountryRawList = getParticipantCountriesWithoutNorway()
      fetchInstitutionsForSelectedCountries(countries)
      setInstitutions(getParticipantInstitutionsWithoutNorway())
    }
    if (sedNeedsKravOm(newSed)) {
      setDefaultKravOm()
    }
    if (sedNeedsKravdato(newSed)) {
      setKravDato('')
      if (kravId) {
        dispatch(fetchKravDato({
          sakId: sakId,
          aktoerId: aktoerId,
          kravId: kravId
        }))
      }
    }
    if (onSedChanged) {
      onSedChanged(newSed)
    }
  }, [])

  const onSedChange = (option: ValueType<Option, false> | null | undefined): void => {
    if (option) {
      const newSed: string | undefined = option.value
      if (newSed) {
        handleSedChange(newSed)
      }
    }
  }

  const onKravOmChange = (e: any): void => {
    const newKravOm: KravOmValue = e.target.value as KravOmValue
    setKravOm(newKravOm)
  }

  const onInstitutionsChange = (institutions: ValueType<Option, true>): void => {
    const newInstitutions: InstitutionRawList = institutions ? institutions.map(institution => institution.value) : []
    setInstitutions(newInstitutions)
    updateValidation('institution', validateInstitutions(newInstitutions))
  }

  const onCountriesChange = (countries: ValueType<Option, true> | null | undefined): void => {
    fetchInstitutionsForSelectedCountries(countries as Options)
  }

  const onKravDatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKravDato = e.target.value
    updateValidation('kravDato', undefined)
    setKravDato(newKravDato)
  }

  const onVedtakIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const vedtakId = e.target.value
    setVedtakId(vedtakId)
    updateValidation('vedtakid', validateVedtakId(vedtakId))
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

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const convertInstitutionIDsToInstitutionObjects = (): Institutions => {
    const institutions: Institutions = []
    _institutions.forEach(item => {
      Object.keys(institutionList!).forEach((landkode: string) => {
        const found: Institution | undefined = _.find(institutionList![landkode], { institution: item })
        if (found) {
          institutions.push(found)
        }
      })
    })
    return institutions
  }

  const resetSedForm = useCallback((): void => {
    dispatch(resetSed())
    setSed(undefined)
    setInstitutions([])
    setCountries([])
    setKravDato('')
  }, [dispatch])

  const performValidation = (): boolean => {
    const validation: Validation = {}
    validation.sed = validateSed(_sed)
    validation.institution = validateInstitutions(_institutions)
    validation.country = validateCountries(_countries)

    if (_sed && sedNeedsVedtakId.indexOf(_sed) >= 0) {
      validation.vedtakid = validateVedtakId(_vedtakId)
    }
    if (sedNeedsAvdodBrukerQuestion()) {
      validation.avdodorsoker = validateAvdodOrSoker(_avdodOrSoker)
    }
    if (_sed && sedNeedsKravdato(_sed)) {
      validation.kravDato = validateKravDato(_kravDato)
    }
    if (_sed && sedNeedsKravOm(_sed)) {
      validation.kravOm = validateKravOm(_kravOm)
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
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
      if (_vedtakId) {
        payload.vedtakId = _vedtakId
      }
      if (sedSupportsAvdod() && _avdod && avdodExists()) {
        payload.avdodfnr = _avdod.fnr
      }
      if (sedNeedsAvdodFnrInput() && _avdodFnr) {
        payload.avdodfnr = _avdodFnr
      }
      if (sedNeedsAvdodBrukerQuestion()) {
        payload.referanseTilPerson = _avdodOrSoker
      }
      if (!_.isEmpty(_kravDato)) {
        payload.kravDato = _kravDato.split('-').reverse().join('-')
      }
      if (_kravOm) {
        payload.kravType = kravOmCode[_kravOm] as SakTypeKey
      }
      if ((_buc as ValidBuc)?.addedParams?.subject) {
        payload.subject = (_buc as ValidBuc)?.addedParams?.subject
      }
      if (currentSed) {
        dispatch(createReplySed(_buc, payload, currentSed.id))
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
      dispatch(!replySed ? getSedList(_buc as ValidBuc) : setSedList([replySed.type]))
      if (replySed) {
        handleSedChange(replySed.type)
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
  }, [_buc, bucs, _countries, dispatch, institutionList, _mounted, replySed])

  useEffect(() => {
    dispatch(!replySed ? getSedList(_buc as ValidBuc) : setSedList([replySed.type]))
    if (replySed) {
      handleSedChange(replySed.type)
    }
  }, [replySed])

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
      handleSedChange(sedList[0])
    }
  }, [sedList, _sed, setSed])

  useEffect(() => {
    if (sedSupportsAvdod() && _avdod === undefined && (_buc as ValidBuc).addedParams?.subject) {
      const needleFnr: string | undefined = (_buc as ValidBuc)?.addedParams?.subject?.avdod?.fnr
      if (needleFnr) {
        let avdod: PersonAvdod | undefined | null = _.find(personAvdods, p => p.fnr === needleFnr)
        if (avdod === undefined) {
          avdod = null
          // backup plan: use fnrs in input fields
          setAvdodFnr((_buc as ValidBuc)?.addedParams?.subject?.avdod?.fnr)
        }
        setAvdod(avdod)
      }
    }

    if (_.isEmpty(_kravDato) && !_.isEmpty((_buc as ValidBuc).addedParams?.kravDato)) {
      // on payload, kravDato is 2020-12-15. Here, we will use 15-12-2020.
      const bucKravDato = (_buc as ValidBuc).addedParams?.kravDato!.split('-').reverse().join('-')
      if (bucKravDato) {
        setKravDato(bucKravDato)
      }
    }
  }, [_avdod, _avdodFnr, _buc, _kravDato, personAvdods, sedSupportsAvdod])

  const setCooldownTimeout = (secondsLeft: number) => {
    setBucCooldown(secondsLeft)
    const timer = setTimeout(() => {
      if (secondsLeft! < 0) {
        clearTimeout(_timer)
        setTimer(undefined)
      } else {
        setCooldownTimeout(secondsLeft - 1)
      }
    }, 1000)
    setTimer(timer)
  }

  useEffect(() => {
    if (kravDato && _.isEmpty(_kravDato) && _.isEmpty((_buc as ValidBuc).addedParams?.kravDato)) {
      const bucKravDato = kravDato.split('-').reverse().join('-')
      setKravDato(bucKravDato)
    }
  }, [_buc, kravDato])

  useEffect(() => {
    let howOldIsBucInMilliSeconds: number | undefined
    let secondsLeft: number | undefined

    if (_bucIdForCooldown === undefined || (_bucIdForCooldown !== _buc.caseId)) {
      setBucIdForCooldown(_buc.caseId!)
      if (_buc && _buc.lastUpdate) {
        howOldIsBucInMilliSeconds = (new Date().getTime() - _buc.lastUpdate)
        secondsLeft = Math.ceil((bucCooldownInSeconds * 1000 - howOldIsBucInMilliSeconds) / 1000)
      }
      // We need a cooldown for X x
      if (_.isNumber(secondsLeft) && secondsLeft > 0) {
        setCooldownTimeout(secondsLeft)
      }
    }
  }, [_buc])

  if (_.isEmpty(bucs) || !currentBuc) {
    return <div />
  }

  return (
    <SEDStartDiv>
      <Systemtittel>
        {!currentSed && !replySed
          ? t('buc:step-startSEDTitle', {
              buc: t(`buc:buc-${_buc?.type}`),
              sed: _sed || t('buc:form-newSed')
            })
          : t('buc:step-replySEDTitle', {
            buc: t(`buc:buc-${_buc?.type}`),
            replySed: replySed!.type,
            sed: currentSed!.type
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
          {_sed && sedNeedsVedtakId.indexOf(_sed) >= 0 && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                disabled
                data-test-id='a-buc-c-sedstart__vedtakid-input-id'
                id='a-buc-c-sedstart__vedtakid-input-id'
                label={t('buc:form-vedtakId')}
                bredde='fullbredde'
                value={_vedtakId || ''}
                onChange={onVedtakIdChange}
                placeholder={t('buc:form-noVedtakId')}
                feil={_validation.vedtakid ? t(_validation.vedtakid.feilmelding) : null}
              />
            </>
          )}
          {sedHasFixedAvdod() && (
            <>
              <VerticalSeparatorDiv />
              <FlexDiv
                data-test-id='a-buc-c-sedstart__avdod-div-id'
              >
                <PersonIcon color={highContrast ? 'white' : 'black'} />
                <HorizontalSeparatorDiv />
                <label className='skjemaelement__label'>
                  {t('buc:form-avdod')}:
                </label>
                <HorizontalSeparatorDiv />
                <Normaltekst>
                  {renderAvdodName(_avdod, t)}
                </Normaltekst>
              </FlexDiv>
            </>
          )}
          {sedNeedsAvdodFnrInput() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                label={t('buc:form-avdodFnr')}
                data-test-id='a-buc-c-sedstart__avdod-input-id'
                id='a-buc-c-sedstart__avdod-input-id'
                placeholder={t('buc:form-chooseAvdodFnr')}
                onChange={onAvdodFnrChange}
                value={_avdodFnr}
                feil={_validation.avdodFnr ? t(_validation.avdodFnr.feilmelding) : null}
              />
            </>
          )}
          {_sed && sedNeedsKravdato(_sed) && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastInput
                data-test-id='a-buc-c-sedstart__kravDato-input-id'
                id='a-buc-c-sedstart__kravDato-input-id'
                label={t('buc:form-kravDato')}
                bredde='fullbredde'
                value={_kravDato}
                onChange={onKravDatoChange}
                placeholder={t('buc:form-kravDatoPlaceholder')}
                feil={_validation.kravDato ? t(_validation.kravDato.feilmelding) : undefined}
              />
            </>
          )}
          {_sed && sedNeedsKravOm(_sed) && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastRadioPanelGroup
                checked={_kravOm as string}
                data-test-id='a-buc-c-sedstart__kravOm-radiogroup-id'
                feil={_validation.kravOm ? t(_validation.kravOm.feilmelding) : undefined}
                legend={t('buc:form-kravOm')}
                name='kravOm'
                radios={[
                  {
                    label: t('buc:form-alderspensjon'),
                    value: 'Alderspensjon',
                    disabled: (sakType === SakTypeMap.UFOREP || sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)
                  }, {
                    label: t('buc:form-etterletteytelser'),
                    value: 'Etterlatteytelser'
                  }, {
                    label: t('buc:form-uføretrygd'),
                    value: 'Uføretrygd',
                    disabled: (sakType === SakTypeMap.ALDER || sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)
                  }
                ]}
                onChange={onKravOmChange}
              />
            </>
          )}
          {sedNeedsAvdodBrukerQuestion() && (
            <>
              <VerticalSeparatorDiv />
              <HighContrastRadioPanelGroup
                checked={_avdodOrSoker}
                data-test-id='a-buc-c-sedstart__avdodorsoker-radiogroup-id'
                feil={_validation.avdodorsoker ? t(_validation.avdodorsoker.feilmelding) : null}
                legend={t('buc:form-avdodorsøker')}
                name='avdodorbruker'
                radios={[
                  { label: t('buc:form-avdod'), value: 'AVDOD' },
                  { label: t('buc:form-søker'), value: 'SOKER' }
                ]}
                onChange={onAvdodOrSokerChange}
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
                isDisabled={loading.gettingCountryList || isDisabled}
                error={_validation.country ? t(_validation.country.feilmelding) : null}
                flagType='circle'
                hideSelectedOptions={false}
                highContrast={highContrast}
                id='a-buc-c-sedstart__country-select-id'
                includeList={_countryIncludeList}
                values={_countryValueList}
                isLoading={loading.gettingCountryList}
                isMulti
                label={t('ui:country')}
                onOptionSelected={onCountriesChange}
                placeholder={loading.gettingCountryList ? getSpinner('buc:loading-country') : t('buc:form-chooseCountry')}
              />
              <VerticalSeparatorDiv />
              <MultipleSelect<Option>
                ariaLabel={t('ui:institution')}
                aria-describedby='help-institution'
                data-test-id='a-buc-c-sedstart__institution-select-id'
                isDisabled={loading.gettingInstitutionList || isDisabled}
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
                  institutions={_institutions.map(institution => {
                    const [country, acronym] = institution.split(':')
                    return {
                      country: country,
                      acronym: acronym,
                      institution: institution,
                      name: institutionNames ? institutionNames[institution].name : institution
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
              disabled={loading.creatingSed || _sendingAttachments || (_.isNumber(_bucCooldown) && _bucCooldown >= 0)}
              spinner={loading.creatingSed || _sendingAttachments || (_.isNumber(_bucCooldown) && _bucCooldown >= 0)}
              onClick={onForwardButtonClick}
            >
              {loading.creatingSed
                ? t('buc:loading-creatingSED')
                : _sendingAttachments
                  ? t('buc:loading-sendingSEDattachments')
                  : (_.isNumber(_bucCooldown) && _bucCooldown >= 0)
                      ? t('ui:pleaseWaitXSeconds', { cooldown: _bucCooldown })
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
      {!hasNoValidationErrors(_validation) && (
        <>
          <VerticalSeparatorDiv data-size='2' />
          <Row>
            <Column>
              <HighContrastFeiloppsummering
                data-test-id='a-buc-c-sedstart__feiloppsummering-id'
                feil={Object.values(_validation).filter(v => v !== undefined) as Array<FeiloppsummeringFeil>}
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
  currentSed: SedPropType,
  initialAttachments: PT.arrayOf(JoarkBrowserItemFileType.isRequired),
  initialSed: PT.string,
  initialSendingAttachments: PT.bool,
  onSedCreated: PT.func.isRequired,
  onSedCancelled: PT.func.isRequired,
  replySed: SedPropType
}

export default SEDStart
