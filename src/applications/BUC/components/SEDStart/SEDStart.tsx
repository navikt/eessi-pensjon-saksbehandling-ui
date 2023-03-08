import { People } from '@navikt/ds-icons'
import { Alert, BodyLong, Button, Heading, Loader, Radio, RadioGroup, TextField } from '@navikt/ds-react'
import {
  createReplySed,
  createSavingAttachmentJob,
  createSed,
  fetchKravDato,
  getCountryList,
  getInstitutionsListForBucAndCountry,
  getSedList,
  getSedP6000,
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
import SEDP6000 from 'applications/BUC/components/SEDP6000/SEDP6000'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Select from 'components/Select/Select'
import { HorizontalLineSeparator } from 'components/StyledComponents'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { IS_TEST } from 'constants/environment'
import {
  AllowedLocaleString,
  ErrorElement,
  FeatureToggles,
  Loading,
  Option,
  PesysContext,
  Validation
} from 'declarations/app.d'
import { KravOmValue, P6000, SakTypeKey } from 'declarations/buc'
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
import CountryData, { Country, CountryList } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import moment from 'moment'

import { Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { GroupBase } from 'react-select'
import styled from 'styled-components/macro'

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
  aktoerId: string | null | undefined
  bucs: Bucs
  currentBuc: string
  currentSed: Sed | undefined
  initialAttachments ?: JoarkBrowserItems
  initialSed ?: string | undefined
  initialSendingAttachments ?: boolean
  onSedChanged?: (newSed: string | null | undefined) => void
  onSedCreated: () => void
  onSedCancelled: () => void
  followUpSeds: Array<Sed> | undefined
}

export interface SEDStartSelector {
  attachmentsError: boolean
  countryList: CountryRawList | undefined
  featureToggles: FeatureToggles
  gettingP6000: boolean
  institutionList: InstitutionListMap<Institution> | undefined
  institutionNames: InstitutionNames | undefined
  kravDato: string | null | undefined,
  kravId: string | null | undefined,
  loading: Loading
  locale: AllowedLocaleString
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  p6000s: Array<P6000> | null | undefined
  sakId?: string | null | undefined
  sakType: SakTypeValue | null | undefined
  savingAttachmentsJob: SavingAttachmentsJob | undefined
  sed: Sed | undefined
  sedsWithAttachments: SedsWithAttachmentsMap
  sedList: SEDRawList | undefined
  vedtakId: string | null | undefined
}

const mapState = /* istanbul ignore next */ (state: State): SEDStartSelector => ({
  attachmentsError: state.buc.attachmentsError,
  countryList: state.buc.countryList,
  featureToggles: state.app.featureToggles,
  gettingP6000: state.loading.gettingP6000,
  institutionList: state.buc.institutionList,
  institutionNames: state.buc.institutionNames,
  kravDato: state.buc.kravDato,
  kravId: state.app.params.kravId,
  loading: state.loading,
  locale: state.ui.locale,
  personAvdods: state.person.personAvdods,
  pesysContext: state.app.pesysContext,
  p6000s: state.buc.p6000s,
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
  followUpSeds,
  initialAttachments = [],
  initialSed = undefined,
  initialSendingAttachments = false,
  onSedChanged,
  onSedCreated,
  onSedCancelled
} : SEDStartProps): JSX.Element => {
  const {
    attachmentsError, countryList, featureToggles, gettingP6000, institutionList, institutionNames, kravId, kravDato,
    loading, locale, p6000s, personAvdods, pesysContext, sakId, sakType, sed, sedList, sedsWithAttachments, vedtakId
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
      t,
      locale,
      type: value
    })
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const renderOptions = (options: Array<Option | string> | undefined): Array<Option> => {
    return options
      ? options.map((el: Option | string) => {
          let label, value
          if (typeof el === 'string') {
            label = el
            value = el
          } else {
            value = el.value || (el as any).institution
            label = el.label || (el as any).name
          }
          return {
            label: getOptionLabel(label!),
            value
          } as Option
        })
      : []
  }

  const [_timer, setTimer] = useState<any>(undefined)
  const [_bucIdForCooldown, setBucIdForCooldown] = useState<string | undefined>(undefined)
  const [_bucCooldown, setBucCooldown] = useState<number | undefined>(undefined)
  const [_p6000s, setP6000s] = useState<Array<P6000>>([])
  const bucCooldownInSeconds = 10
  const [_avdod, setAvdod] = useState<PersonAvdod | null | undefined>(undefined)
  const [_avdodFnr, setAvdodFnr] = useState<string | undefined>(undefined)
  const [_avdodOrSoker, setAvdodOrSoker] = useState<AvdodOrSokerValue | undefined>(undefined)
  const [_attachmentsSent, setAttachmentsSent] = useState<boolean>(false)
  const [_attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(false)
  const _buc: Buc = _.cloneDeep(bucs[currentBuc!])
  const _type: string | null | undefined = _buc?.type
  const [_countries, setCountries] = useState<CountryRawList>(() =>
    featureToggles.SED_PREFILL_INSTITUTIONS ? prefill('countryCode') : [])
  const _countryData: CountryList = CountryData.getCountryInstance(locale)
  const [_institutions, setInstitutions] = useState<InstitutionRawList>(() =>
    featureToggles.SED_PREFILL_INSTITUTIONS ? prefill('id') : []
  )
  const [_kravDato, setKravDato] = useState<string>(kravDato || '')
  const [_kravOm, setKravOm] = useState<KravOmValue | undefined>(undefined)
  const _notHostInstitution = (institution: Institution) : boolean => institution.institution !== 'NO:DEMO001'
  const [_sed, setSed] = useState<string | undefined>(initialSed)
  const [_sedAttachments, setSedAttachments] = useState<JoarkBrowserItems>(initialAttachments)
  const _sedOptions: Array<Option> = renderOptions(sedList)
  const [_sedSent, setSedSent] = useState<boolean>(false)
  const [_sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [_validation, setValidation] = useState<Validation>({})
  const [_vedtakId, setVedtakId] = useState<string | null | undefined>(vedtakId)

  // BEGIN QUESTIONS

  // norway as case owner (except some mock institutions that should simulate foreign institutions)
  const isNorwayCaseOwner = (): boolean => _buc?.creator?.country === 'NO' &&
    (_buc?.creator?.institution !== 'NO:NAVAT06' && _buc?.creator?.institution !== 'NO:NAVAT08')

  const hasNoValidationErrors = (validation: Validation): boolean => _.find(validation, (it) => (it !== undefined)) === undefined

  // SEDs that use avdod
  const sedSupportsAvdod = useCallback((): boolean => bucsThatSupportAvdod(_type), [_buc])

  const avdodExists = (): boolean => (personAvdods ? personAvdods.length > 0 : false)

  const sedNeedsVedtakId = ['P6000', 'P7000']

  const sedPrefillsCountriesAndInstitutions = ['P4000', 'P5000', 'P6000', 'P7000', 'P8000', 'P10000', 'H020', 'H070', 'H120', 'H121']

  const sedFreezesCountriesAndInstitutions = ['P4000', 'P5000', 'P6000', 'P7000', 'P8000', 'H070', 'H121']

  const sedNeedsKravOm = (sed: string) => ['P15000'].indexOf(sed) >= 0

  const sedNeedsKravdato = (sed: string) => ['P15000'].indexOf(sed) >= 0

  const bucRequiresP6000s = (buc: Buc) => ['P_BUC_05', 'P_BUC_06', 'P_BUC_10'].indexOf(buc.type!) < 0

  const sedNeedsAvdodBrukerQuestion = (): boolean => _type === 'P_BUC_05' && _sed === 'P8000' &&
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
          _type === 'P_BUC_10' && _sed === 'P15000'
        ) ||
        (
          pesysContext !== constants.VEDTAKSKONTEKST &&
          (
            (_type === 'P_BUC_02'
              ? !isNorwayCaseOwner()
              : (_type === 'P_BUC_05'
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
  const _institutionObjectList: Array<GroupBase<Option>> = []
  let _institutionValueList: Array<Option> = []

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

  const updateValidation = useCallback((_key: string, validationError: ErrorElement | undefined) => {
    if (!validationError) {
      const newValidation = _.cloneDeep(_validation)
      newValidation[_key] = undefined
      setValidation(newValidation)
    }
  }, [_validation])

  const validateKravDato = (kravDato: string | undefined): ErrorElement | undefined => {
    if ((!kravDato || kravDato?.length === 0) && pesysContext === VEDTAKSKONTEKST) {
      return {
        feilmelding: t('message:validation-chooseKravDato'),
        skjemaelementId: 'a_buc_c_sedstart--kravDato-input-id'
      } as ErrorElement
    }
    if (kravDato && !kravDato.match(/\d{2}-\d{2}-\d{4}/)) {
      return {
        skjemaelementId: 'a_buc_c_sedstart--kravDato-input-id',
        feilmelding: t('message:validation-badKravDato')
      } as ErrorElement
    }
    if (kravDato && !moment(kravDato, 'DD-MM-ÅÅÅÅ').isValid()) {
      return {
        feilmelding: t('message:validation-invalidKravDato'),
        skjemaelementId: 'a_buc_c_sedstart--kravDato-input-id'
      } as ErrorElement
    }
    return undefined
  }

  const validateSed = (sed: string | undefined): ErrorElement | undefined => {
    if (!sed) {
      return {
        feilmelding: t('message:validation-chooseSed'),
        skjemaelementId: 'a_buc_c_sedstart--sed-select-id'
      } as ErrorElement
    }
    return undefined
  }

  const validateInstitutions = (institutions: InstitutionRawList): ErrorElement | undefined => {
    if (!bucHasSedsWithAtLeastOneInstitution() && _.isEmpty(institutions)) {
      return {
        feilmelding: t('message:validation-chooseInstitution'),
        skjemaelementId: 'a_buc_c_sedstart--institution-select-id'
      } as ErrorElement
    }
    return undefined
  }

  const validateCountries = useCallback((country: CountryRawList): ErrorElement | undefined => {
    if (!bucHasSedsWithAtLeastOneInstitution() && _.isEmpty(country)) {
      return {
        feilmelding: t('message:validation-chooseCountry'),
        skjemaelementId: 'a_buc_c_sedstart--country-select-id'
      } as ErrorElement
    }
    return undefined
  }, [t, bucHasSedsWithAtLeastOneInstitution])

  const validateVedtakId = (vedtakId: string | null | undefined): ErrorElement | undefined => {
    if (!vedtakId) {
      return {
        feilmelding: t('message:validation-chooseVedtakId'),
        skjemaelementId: 'a_buc_c_sedstart--vedtakid-input-id'
      } as ErrorElement
    }
    if (!isNumber(vedtakId!)) {
      return {
        feilmelding: t('message:validation-invalidVedtakId'),
        skjemaelementId: 'a_buc_c_sedstart--vedtakid-input-id'
      } as ErrorElement
    }
    return undefined
  }

  const validateKravOm = (kravOm: string | undefined): ErrorElement | undefined => {
    if (!kravOm) {
      return {
        feilmelding: t('message:validation-chooseKravOm'),
        skjemaelementId: 'a_buc_c_sedstart--kravOm-radiogroup-id'
      } as ErrorElement
    }
    return undefined
  }

  const validateP6000s = (buc: Buc, availableP6000s: Array<P6000> | null | undefined, selectedP6000s: Array<P6000>): ErrorElement | undefined => {
    if (_.isEmpty(selectedP6000s) && bucRequiresP6000s(buc)) {
      if (_.isEmpty(availableP6000s)) {
        return {
          feilmelding: t('message:validation-chooseP6000_1')
        } as ErrorElement
      } else {
        return {
          feilmelding: t('message:validation-chooseP6000_2')
        } as ErrorElement
      }
    }
    return undefined
  }

  const validateAvdodOrSoker = (_avdodOrSoker: AvdodOrSokerValue | undefined): ErrorElement | undefined => {
    if (!_avdodOrSoker) {
      return {
        feilmelding: t('message:validation-chooseAvdodOrSoker'),
        skjemaelementId: 'a_buc_c_sedstart--avdodorsoker-radiogroup-id'
      } as ErrorElement
    }
    return undefined
  }

  const _cancelSendAttachmentToSed = (): void => {
    setSendingAttachments(false)
    setAttachmentsSent(false)
    dispatch(resetSavingAttachmentJob())
  }

  const fetchInstitutionsForSelectedCountries = useCallback((countries: Array<Option> | CountryRawList): void => {
    if (!_buc) {
      return
    }
    let newCountries: CountryRawList = []
    if (!_.isEmpty(countries)) {
      if (typeof countries[0] === 'string') {
        newCountries = countries as CountryRawList
      } else {
        newCountries = (countries as Array<Option>).map(item => item.value)
      }
    }

    const oldCountriesList: CountryRawList = _.cloneDeep(_countries)
    const addedCountries: CountryRawList = newCountries.filter(country => !oldCountriesList.includes(country))
    const removedCountries: CountryRawList = oldCountriesList.filter(country => !newCountries.includes(country))

    addedCountries.forEach(country => dispatch(getInstitutionsListForBucAndCountry(_type!, country)))
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

  const onAvdodOrSokerChange = (e: string | number | boolean): void => {
    const avdodorsoker: AvdodOrSokerValue = e as AvdodOrSokerValue
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

  const onChangedSedP6000 = (p6000s: Array<P6000>) => {
    setValidation({
      ..._validation,
      p6000: undefined
    })
    setP6000s(p6000s)
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
          sakId,
          aktoerId,
          kravId
        }))
      }
    }
    if (onSedChanged) {
      onSedChanged(newSed)
    }
  }, [])

  const onSedChange = (option: unknown): void => {
    if (option) {
      const newSed: string | undefined = (option as Option).value
      if (newSed) {
        handleSedChange(newSed)
      }
    }
  }

  const onKravOmChange = (e: string | number | boolean): void => {
    const newKravOm: KravOmValue = e as KravOmValue
    setKravOm(newKravOm)
  }

  const onInstitutionsChange = (institutions: Array<Option>): void => {
    const newInstitutions: InstitutionRawList = institutions ? (institutions as Array<Option>)?.map((institution : Option) => institution.value) : []
    setInstitutions(newInstitutions)
    updateValidation('institution', validateInstitutions(newInstitutions))
  }

  const onCountriesChange = (countries: Array<Option> | null | undefined): void => {
    fetchInstitutionsForSelectedCountries(countries as Array<Option>)
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
    <WaitingPanel size='xsmall' message={t(text)} oneLine key={"sedstart-spinner-" + text}/>
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
      if (item === 'NO:NAVAT06') {
        institutions.push({
          acronym: 'NAVAT06',
          institution: item,
          country: 'NO',
          name: 'NAV ACCEPTANCE TEST 06'
        } as Institution)
      } else if (item === 'NO:NAVAT08') {
        institutions.push({
          acronym: 'NAVAT08',
          institution: item,
          country: 'NO',
          name: 'NAV ACCEPTANCE TEST 08'
        } as Institution)
      } else {
        Object.keys(institutionList!).forEach((landkode: string) => {
          const found: Institution | undefined = _.find(institutionList![landkode], { institution: item })
          if (found) {
            institutions.push(found)
          }
        })
      }
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
    if (_sed === 'P7000') {
      validation.p6000 = validateP6000s(_buc, p6000s, _p6000s)
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
        buc: _type!,
        sed: _sed!,
        institutions,
        aktoerId: aktoerId!,
        euxCaseId: _buc.caseId!
      }

      const loggerPayload: any = {
        buc: _type!,
        sed: _sed!,
        institutions
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
      if (_sed === 'P7000') {
        payload.payload = JSON.stringify(_p6000s)
      }
      if (currentSed) {
        dispatch(createReplySed(_buc, payload, currentSed.id))
      } else {
        dispatch(createSed(_buc, payload))
      }
      buttonLogger(e, loggerPayload)
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

  const _onFinished = () => {
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
  }

  useEffect(() => {
    if (countryList === undefined && !_.isNil(_type) && !loading.gettingCountryList) {
      dispatch(getCountryList(_type))
    }
  }, [countryList, loading.gettingCountryList, _type])

  useEffect(() => {
    dispatch(_.isEmpty(followUpSeds) ? getSedList(_buc as ValidBuc) : setSedList(followUpSeds!.map(s => s.type)))
    if (!_.isEmpty(followUpSeds) && followUpSeds!.length === 1) {
      handleSedChange(followUpSeds![0].type)
    }
    if (_buc && _buc.type !== null && !_.isEmpty(_countries)) {
      _countries.forEach(country => {
        if (!institutionList || !Object.keys(institutionList).includes(country)) {
          dispatch(getInstitutionsListForBucAndCountry(_buc.type!, country))
        }
      })
    }
  }, [])

  useEffect(() => {
    dispatch(_.isEmpty(followUpSeds) ? getSedList(_buc as ValidBuc) : setSedList(followUpSeds!.map(s => s.type)))
    if (!_.isEmpty(followUpSeds) && followUpSeds!.length === 1) {
      handleSedChange(followUpSeds![0].type)
    }
  }, [followUpSeds])

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
  }, [_attachmentsSent, _sendingAttachments, _sedAttachments, sedCanHaveAttachments, sed, _sedSent])

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

  const _getP6000 = () => {
    setValidation({
      ..._validation,
      p6000: undefined
    })
    dispatch(getSedP6000(_buc.caseId!))
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
      <Heading size='medium'>
        {!currentSed && _.isEmpty(followUpSeds)
          ? t('buc:step-startSEDTitle', {
              buc: t(`buc:buc-${_buc?.type}`),
              sed: _sed || t('buc:form-newSed')
            })
          : t('buc:step-replySEDTitle', {
            replySed: followUpSeds?.map(s => s.type).join(', '),
            sed: currentSed!.type
          })}
      </Heading>
      <HorizontalLineSeparator />
      {!vedtakId && _sed === 'P6000' && (
        <FullWidthDiv>
          <AlertDiv>
            <Alert variant='warning'>
              {t('message:alert-noVedtakId')}
            </Alert>
          </AlertDiv>
        </FullWidthDiv>
      )}
      <Row>
        <Column>
          <VerticalSeparatorDiv size='2' />
          <>
            <label className='navds-text-field--label navds-label'>
              {t('buc:form-chooseSed')}
            </label>
            <Select
              data-testid='a_buc_c_sedstart--sed-select-id'
              isDisabled={loading.gettingSedList}
              id='a_buc_c_sedstart--sed-select-id'
              isSearchable
              error={_validation.sed ? t(_validation.sed.feilmelding) : undefined}
              menuPortalTarget={document.getElementById('main')}
              onChange={onSedChange}
              options={_sedOptions}
              value={_.find(_sedOptions, (f: any) => f.value === _sed) || null}
            />
          </>
          {_sed && sedNeedsVedtakId.indexOf(_sed) >= 0 && (
            <>
              <VerticalSeparatorDiv />
              <TextField
                disabled
                data-testid='a_buc_c_sedstart--vedtakid-input-id'
                id='a_buc_c_sedstart--vedtakid-input-id'
                label={t('buc:form-vedtakId') + (_.isEmpty(_vedtakId) ? ' - ' + t('buc:form-noVedtakId') : '')}
                value={_vedtakId || ''}
                onChange={onVedtakIdChange}
                error={_validation.vedtakid ? t(_validation.vedtakid.feilmelding) : null}
              />
            </>
          )}
          {sedHasFixedAvdod() && (
            <>
              <VerticalSeparatorDiv />
              <FlexDiv
                data-testid='a_buc_c_sedstart--avdod-div-id'
              >
                <People />
                <HorizontalSeparatorDiv />
                <label className='navds-text-field--label navds-label'>
                  {t('buc:form-avdod')}:
                </label>
                <HorizontalSeparatorDiv />
                <BodyLong>
                  {renderAvdodName(_avdod, t)}
                </BodyLong>
              </FlexDiv>
            </>
          )}
          {sedNeedsAvdodFnrInput() && (
            <>
              <VerticalSeparatorDiv />
              <TextField
                label={t('buc:form-chooseAvdodFnr')}
                data-testid='a_buc_c_sedstart--avdod-input-id'
                id='a_buc_c_sedstart--avdod-input-id'
                onChange={onAvdodFnrChange}
                value={_avdodFnr}
                error={_validation.avdodFnr ? t(_validation.avdodFnr.feilmelding) : null}
              />
            </>
          )}
          {_sed && sedNeedsKravdato(_sed) && (
            <>
              <VerticalSeparatorDiv />
              <TextField
                data-testid='a_buc_c_sedstart--kravDato-input-id'
                id='a_buc_c_sedstart--kravDato-input-id'
                label={t('buc:form-kravDato') + '(' + t('buc:form-kravDatoPlaceholder') + ')'}
                value={_kravDato}
                onChange={onKravDatoChange}
                error={_validation.kravDato ? t(_validation.kravDato.feilmelding) : undefined}
              />
            </>
          )}
          {_sed && sedNeedsKravOm(_sed) && (
            <>
              <VerticalSeparatorDiv />
              <RadioGroup
                value={_kravOm as string}
                data-testid='a_buc_c_sedstart--kravOm-radiogroup-id'
                error={_validation.kravOm ? t(_validation.kravOm.feilmelding) : undefined}
                legend={t('buc:form-kravOm')}
                onChange={onKravOmChange}
              >
                <Radio
                  disabled={(sakType === SakTypeMap.UFOREP || sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)}
                  value='Alderspensjon'
                >{t('buc:form-alderspensjon')}
                </Radio>
                <Radio
                  value='Etterlatteytelser'
                >{t('buc:form-etterletteytelser')}
                </Radio>
                <Radio
                  disabled={(sakType === SakTypeMap.ALDER || sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)}
                  value='Uføretrygd'
                >{t('buc:form-uføretrygd')}
                </Radio>
              </RadioGroup>
            </>
          )}
          {sedNeedsAvdodBrukerQuestion() && (
            <>
              <VerticalSeparatorDiv />
              <RadioGroup
                value={_avdodOrSoker}
                data-testid='a_buc_c_sedstart--avdodorsoker-radiogroup-id'
                error={_validation.avdodorsoker ? t(_validation.avdodorsoker.feilmelding) : null}
                legend={t('buc:form-avdodorsøker')}
                onChange={onAvdodOrSokerChange}
              >
                <Radio value='AVDOD'>{t('buc:form-avdod')}</Radio>
                <Radio value='SOKER'>{t('buc:form-søker')}</Radio>
              </RadioGroup>
            </>
          )}
          {!currentSed && (
            <>
              <VerticalSeparatorDiv />
              <CountrySelect
                ariaLabel={t('ui:country')}
                aria-describedby='help-country'
                closeMenuOnSelect={false}
                data-testid='a_buc_c_sedstart--country-select-id'
                isDisabled={loading.gettingCountryList || isDisabled}
                error={_validation.country ? t(_validation.country.feilmelding) : null}
                flagType='circle'
                hideSelectedOptions={false}
                id='a_buc_c_sedstart--country-select-id'
                includeList={_countryIncludeList}
                values={_countryValueList}
                isLoading={loading.gettingCountryList}
                isMulti
                label={loading.gettingCountryList ? getSpinner('message:loading-country') : t('buc:form-chooseCountry')}
                onOptionSelected={onCountriesChange}
              />
              <VerticalSeparatorDiv />
              <MultipleSelect<Option>
                ariaLabel={t('ui:institution')}
                aria-describedby='help-institution'
                data-testid='a_buc_c_sedstart--institution-select-id'
                isDisabled={loading.gettingInstitutionList || isDisabled}
                error={_validation.institution ? t(_validation.institution.feilmelding) : undefined}
                hideSelectedOptions={false}
                id='a_buc_c_sedstart--institution-select-id'
                isLoading={loading.gettingInstitutionList}
                label={loading.gettingInstitutionList ? getSpinner('message:loading-institution') : t('buc:form-chooseInstitution')}
                options={_institutionObjectList}
                onSelect={onInstitutionsChange}
                values={_institutionValueList}
              />
              <VerticalSeparatorDiv size='2' />
              {_sed === 'P7000' && bucRequiresP6000s(_buc) && (
                <>
                  {_.isNil(p6000s)
                    ? (
                      <Button
                        variant='primary'
                        onClick={_getP6000}
                        disabled={gettingP6000}
                      >
                        {gettingP6000 && <Loader />}
                        {gettingP6000 ? t('message:loading-p6000') : t('buc:form-get-p6000')}
                      </Button>
                      )
                    : <SEDP6000
                        feil={_validation.p6000}
                        locale={locale}
                        p6000s={p6000s}
                        onChanged={onChangedSedP6000}
                      />}
                  <VerticalSeparatorDiv size='2' />
                </>
              )}
              <label className='navds-text-field--label navds-label'>
                {t('buc:form-chosenInstitutions')}
              </label>
              <VerticalSeparatorDiv />
              <InstitutionsDiv>
                <InstitutionList
                  institutions={_institutions.map(institution => {
                    const [country, acronym] = institution.split(':')
                    return {
                      country,
                      acronym,
                      institution,
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
            <VerticalSeparatorDiv size='1.5' />
            <Button
              variant={_sed === 'P7000' && _.isEmpty(_p6000s) ? 'secondary' : 'primary'}
              data-amplitude='sed.new.create'
              data-testid='a_buc_c_sedstart--forward-button-id'
              disabled={loading.creatingSed || _sendingAttachments || (_.isNumber(_bucCooldown) && _bucCooldown >= 0)}
              onClick={onForwardButtonClick}
            >
              {(loading.creatingSed || _sendingAttachments || (_.isNumber(_bucCooldown) && _bucCooldown >= 0)) && <Loader />}
              {loading.creatingSed
                ? t('message:loading-creatingSED')
                : _sendingAttachments
                  ? t('message:loading-sendingSEDattachments')
                  : (_.isNumber(_bucCooldown) && _bucCooldown >= 0)
                      ? t('ui:pleaseWaitXSeconds', { cooldown: _bucCooldown })
                      : t('buc:form-orderSED')}
            </Button>
            <HorizontalSeparatorDiv />
            <Button
              variant='tertiary'
              data-amplitude='sed.new.cancel'
              data-testid='a_buc_c_sedstart--cancel-button-id'
              onClick={onCancelButtonClick}
            >
              {t('ui:cancel')}
            </Button>
            <VerticalSeparatorDiv size='1.5' />
          </Column>
        </Column>
        <HorizontalSeparatorDiv />
        <Column>
          {sedCanHaveAttachments() && (
            <>
              <VerticalSeparatorDiv size='2' />
              <label className='navds-text-field--label navds-label'>
                {t('ui:attachments')}
              </label>
              <VerticalSeparatorDiv />
              <Button
                variant='secondary'
                onClick={() => setAttachmentsTableVisible(!_attachmentsTableVisible)}
              >
                {t(_attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
              </Button>
              <VerticalSeparatorDiv />
              <SEDAttachmentModal
                open={_attachmentsTableVisible}
                onModalClose={() => setAttachmentsTableVisible(false)}
                onFinishedSelection={onJoarkAttachmentsChanged}
                sedAttachments={_sedAttachments}
                tableId='newsed-modal'
              />
              {!_.isEmpty(_sedAttachments) && (
                <>
                  <VerticalSeparatorDiv />
                  <JoarkBrowser
                    mode='view'
                    existingItems={_sedAttachments}
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
                      aktoerId,
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
          <VerticalSeparatorDiv size='2' />
          <Row>
            <Column>
              <ValidationBox heading={t('message:error-validationbox-sedstart')} validation={_validation} />
            </Column>
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
  followUpSeds: PT.arrayOf(SedPropType.isRequired)
}

export default SEDStart
