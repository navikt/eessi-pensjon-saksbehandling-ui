import {
  cleanNewlyCreatedBuc,
  createBuc,
  fetchKravDato,
  getBucOptions,
  getSubjectAreaList,
  getTagList,
  resetBuc,
  saveBucsInfo
} from 'actions/buc'
import { bucsThatSupportAvdod, getBucTypeLabel, valueSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Select from 'components/Select/Select'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import moment from 'moment'
import {
  AllowedLocaleString,
  FeatureToggles,
  Loading,
  Option,
  ErrorElement,
  PesysContext,
  Validation
} from 'declarations/app.d'
import {
  Buc,
  BUCOptions,
  Bucs,
  BucsInfo,
  NewBucPayload,
  SakTypeMap,
  SakTypeValue,
  SaveBucsInfoProps,
  SubjectAreaRawList,
  Tag,
  TagRawList,
  Tags
} from 'declarations/buc.d'
import { PersonAvdod, PersonAvdods, PersonPDL } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Alert, BodyLong, Button, ErrorSummary, Loader, TextField, HelpText } from '@navikt/ds-react'
import {
  Column,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const FlexDiv = styled.div`
  display: flex;
  align-items: flex-end;
  .flex-2 {
     flex: 2;
  }
`
export interface BUCStartProps {
  aktoerId: string | null | undefined
  initialCreatingBucInfo?: boolean
  initialIsCreatingBuc?: boolean
  onBucChanged?: (option: Option) => void
  onBucCreated: () => void
  onBucCancelled: () => void
}

export interface BUCStartSelector {
  bucOptions?: BUCOptions | undefined
  bucParam: string | null | undefined
  bucs: Bucs | undefined
  bucsInfo?: BucsInfo | undefined
  currentBuc: string | undefined
  featureToggles: FeatureToggles
  kravDato: string | null | undefined
  kravId: string | null | undefined
  loading: Loading
  locale: AllowedLocaleString
  newlyCreatedBuc: Buc | undefined
  person: PersonPDL | undefined
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakId: string | null | undefined
  sakType: SakTypeValue | null | undefined
  subjectAreaList?: SubjectAreaRawList | undefined
  tagList?: TagRawList | undefined
}

const mapState = (state: State): BUCStartSelector => ({
  bucOptions: state.buc.bucOptions,
  bucParam: state.app.params.buc,
  bucs: state.buc.bucs,
  bucsInfo: state.buc.bucsInfo,
  currentBuc: state.buc.currentBuc,
  featureToggles: state.app.featureToggles,
  kravDato: state.buc.kravDato,
  kravId: state.app.params.kravId,
  loading: state.loading,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  person: state.app.person,
  personAvdods: state.app.personAvdods,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  sakType: state.app.params.sakType as SakTypeValue | undefined,
  subjectAreaList: state.buc.subjectAreaList,
  tagList: state.buc.tagList
})

const BUCStart: React.FC<BUCStartProps> = ({
  aktoerId,
  initialIsCreatingBuc = false,
  initialCreatingBucInfo = false,
  onBucChanged,
  onBucCreated,
  onBucCancelled
}: BUCStartProps): JSX.Element | null => {
  const {
    bucOptions, bucParam, bucs, bucsInfo, currentBuc, featureToggles,
    kravDato, kravId, loading, locale, newlyCreatedBuc, person, personAvdods,
    pesysContext, sakId, sakType, subjectAreaList, tagList
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapState)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_avdod, setAvdod] = useState<PersonAvdod | undefined>(undefined)
  const [_avdodFnr, setAvdodFnr] = useState<string | undefined>('')
  const [_buc, setBuc] = useState<string | null | undefined>(bucParam)
  const [_kravDato, setKravDato] = useState<string>(kravDato || '')
  const [_isCreatingBuc, setIsCreatingBuc] = useState<boolean>(initialIsCreatingBuc)
  const [_isCreatingBucInfo, setIsCreatingBucInfo] = useState<boolean>(initialCreatingBucInfo)
  const [_showWarningBuc, setShowWarningBuc] = useState<boolean>(false)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_tags, setTags] = useState<Tags>([])
  const [_validation, setValidation] = useState<Validation>({})

  // BEGIN QUESTIONS

  const avdodExists = (): boolean => (personAvdods ? personAvdods.length > 0 : false)

  // show avdod select for P_BUC_02, P_BUC_05, P_BUC_10 and when there are avdods
  const bucNeedsAvdod = (): boolean => {
    return (
      bucsThatSupportAvdod(_buc) && avdodExists() &&
      (_buc === 'P_BUC_10'
        ? pesysContext === constants.VEDTAKSKONTEKST && (
            sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
          sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP)
        : true
      )
    )
  }

  // when for some reason bucNeedsAvdod fails but we are still in P_BUC_10 (like having no avdød and in other contexts)
  // then we can punch in the avdods fnr
  const bucNeedsAvdodButWeHaveNone = (): boolean => {
    return (
      !bucNeedsAvdod() &&
      (_buc === 'P_BUC_10' && (
        sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
          sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP
      )
      )
    )
  }

  // fetch krav dato for P_BUC_10 criteria
  const bucNeedsKravDatoAndCanFetchIt = (buc: string | null | undefined): boolean => {
    return !!(buc === 'P_BUC_10' &&
        sakId && aktoerId && kravId &&
        pesysContext === constants.VEDTAKSKONTEKST &&
        (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
          sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP)
    )
  }

  // show krav dato for P_BUC_10
  const bucNeedsKravDato = (buc: string | null | undefined): boolean => {
    return !!(buc === 'P_BUC_10' && sakId && aktoerId &&
      (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP ||
        sakType === SakTypeMap.ALDER || sakType === SakTypeMap.UFOREP)
    )
  }

  // END QUESTIONS

  const hasNoValidationErrors = (validation: Validation): boolean => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const updateValidation = (_key: string, validationError: ErrorElement | undefined) => {
    if (!validationError) {
      const newValidation = _.cloneDeep(_validation)
      newValidation[_key] = undefined
      setValidation(newValidation)
    }
  }

  const validateAvdod = (avdod: PersonAvdod | undefined): ErrorElement | undefined => {
    if (!avdod) {
      return {
        skjemaelementId: 'a-buc-c-bucstart__avdod-select-id',
        feilmelding: t('message:validation-chooseAvdod')
      } as ErrorElement
    }
    return undefined
  }

  const validateAvdodFnr = (avdodFnr: string | undefined): ErrorElement | undefined => {
    if (avdodFnr && !(avdodFnr.length === 11 && avdodFnr.match(/\d{11}/))) {
      return {
        skjemaelementId: 'a-buc-c-bucstart__avdod-input-id',
        feilmelding: t('message:validation-badAvdodFnr')
      } as ErrorElement
    }
    return undefined
  }

  const validateBuc = (buc: string | null | undefined): ErrorElement | undefined => {
    if (!buc) {
      return {
        skjemaelementId: 'a-buc-c-bucstart__buc-select-id',
        feilmelding: t('message:validation-chooseBuc')
      } as ErrorElement
    }
    return undefined
  }

  const validateSubjectArea = (subjectArea: string): ErrorElement | undefined => {
    if (!subjectArea) {
      return {
        skjemaelementId: 'a-buc-c-bucstart__subjectarea-select-id',
        feilmelding: t('message:validation-chooseSubjectArea')
      } as ErrorElement
    }
    return undefined
  }

  const validateKravDato = (kravDato: string | undefined): ErrorElement | undefined => {
    if (kravDato && !kravDato.match(/\d{2}-\d{2}-\d{4}/)) {
      return {
        skjemaelementId: 'a-buc-c-sedstart__kravDato-input-id',
        feilmelding: t('message:validation-badKravDato')
      } as ErrorElement
    }
    if (kravDato && !moment(kravDato, 'DD-MM-ÅÅÅÅ').isValid()) {
      return {
        feilmelding: t('message:validation-invalidKravDato'),
        skjemaelementId: 'a-buc-c-sedstart__kravDato-input-id'
      } as ErrorElement
    }
    return undefined
  }

  const performValidation = () :boolean => {
    const validation: Validation = {}
    validation.subjectArea = validateSubjectArea(_subjectArea)
    validation.buc = validateBuc(_buc)
    if (bucNeedsAvdod()) {
      validation.avdod = validateAvdod(_avdod)
    }
    if (bucNeedsAvdodButWeHaveNone()) {
      validation.avdodFnr = validateAvdodFnr(_avdodFnr)
    }
    if (bucNeedsKravDato(_buc)) {
      validation.kravDato = validateKravDato(_kravDato)
    }
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onForwardButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    dispatch(cleanNewlyCreatedBuc())
    if (_buc === 'P_BUC_02' && pesysContext === constants.VEDTAKSKONTEKST && personAvdods && personAvdods.length === 0) {
      setShowWarningBuc(true)
      return
    }
    setShowWarningBuc(false)
    const valid: boolean = performValidation()
    if (valid) {
      buttonLogger(e, {
        subjectArea: _subjectArea,
        buc: _buc
      })
      setIsCreatingBuc(true)
      const payload: NewBucPayload = {
        buc: _buc!,
        person: person!
      }
      if (bucNeedsAvdod()) {
        payload.avdod = _avdod
      }
      if (bucNeedsAvdodButWeHaveNone() && _avdodFnr) {
        payload.avdodfnr = _avdodFnr
      }
      if (bucNeedsKravDato(_buc) && _kravDato) {
        // change 15-12-2020 to 2020-12-15
        payload.kravDato = _kravDato.split('-').reverse().join('-')
      }
      dispatch(createBuc(payload))
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    dispatch(resetBuc())
    setBuc(bucParam)
    setKravDato('')
    setAvdod(undefined)
    onBucCancelled()
  }

  const onSubjectAreaChange = (option: unknown): void => {
    if (option) {
      const thisSubjectArea: string = (option as Option).value
      setSubjectArea(thisSubjectArea)
      updateValidation('sed', validateSubjectArea(thisSubjectArea))
    }
  }

  const onBucChange = (option: unknown): void => {
    if (option) {
      const thisBuc: string = (option as Option).value
      setBuc(thisBuc)
      updateValidation('buc', validateBuc(thisBuc))
      if (bucNeedsKravDatoAndCanFetchIt(thisBuc)) {
        setKravDato('')
        dispatch(fetchKravDato({
          sakId: sakId,
          aktoerId: aktoerId,
          kravId: kravId
        }))
      }
      if (onBucChanged) {
        onBucChanged(option as Option)
      }
    }
  }

  const onTagsChange = (tagsList: unknown): void => {
    setTags(tagsList as Tags)
    standardLogger('buc.new.tags.select', { tags: (tagsList as unknown as Tags)?.map(t => t.label) || [] })
  }

  const onKravDatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKravDato = e.target.value
    updateValidation('kravDato', undefined)
    setKravDato(newKravDato)
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

  const renderOptions = (options: Array<Option | string> | undefined, sort?: (a: Option, b: Option) => number): Array<Option> => {
    return options
      ? options.map((el: Option | string) => {
          let label: string, value: string
          if (typeof el === 'string') {
            value = el
            label = el
          } else {
            value = el.value
            label = el.label
          }
          return {
            label: getOptionLabel(label),
            value: value
          }
        }).sort(sort)
      : []
  }

  const bucListOptions = renderOptions(bucOptions, valueSorter)

  const tagObjectList: Array<Option> = tagList
    ? tagList.map(tag => {
        return {
          value: tag,
          label: t('buc:' + tag)
        } as Tag
      })
    : []

  const onAvdodChange = (option: unknown): void => {
    if (option) {
      const thisAvdod: PersonAvdod | undefined = _.find(personAvdods,
        (avdod: PersonAvdod) => {
          const id: string | undefined = avdod.fnr
          return id === (option as Option).value
        }
      )
      setAvdod(thisAvdod)
      updateValidation('avdod', validateAvdod(thisAvdod))
    }
  }

  const onAvdodFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const avdodFnr = e.target.value
    setAvdodFnr(avdodFnr)
    updateValidation('avdodFnr', validateAvdodFnr(avdodFnr))
  }

  const renderAvdodOptions = (personAvdods: PersonAvdods | undefined): Array<Option> => {
    return personAvdods?.map((avdod: PersonAvdod) => {
      const fnr: string | undefined = avdod.fnr
      return {
        label: avdod.fulltNavn + ' (' + fnr + ')',
        value: fnr!
      }
    }) || []
  }

  const avdodOptions: Array<Option> = renderAvdodOptions(personAvdods)

  useEffect(() => {
    if (subjectAreaList === undefined && !loading.gettingSubjectAreaList) {
      dispatch(getSubjectAreaList())
    }
  }, [dispatch, loading.gettingSubjectAreaList, subjectAreaList])

  useEffect(() => {
    if (bucOptions === undefined && !loading.gettingBucOptions) {
      dispatch(getBucOptions(sakId, featureToggles, pesysContext, sakType))
    }
  }, [bucOptions, dispatch, loading.gettingBucOptions, pesysContext, sakId, sakType])

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [dispatch, loading.gettingTagList, tagList])

  useEffect(() => {
    if (bucsThatSupportAvdod(_buc) &&
      pesysContext === constants.VEDTAKSKONTEKST &&
      personAvdods &&
      personAvdods.length === 1 &&
      !_avdod
    ) {
      setAvdod(personAvdods[0])
    }
  }, [_buc, _avdod, pesysContext, personAvdods])

  useEffect(() => {
    if (_isCreatingBuc && newlyCreatedBuc && !_isCreatingBucInfo) {
      const buc: Buc = bucs![currentBuc!]
      const payload: SaveBucsInfoProps = {
        aktoerId: aktoerId,
        bucsInfo: bucsInfo,
        tags: _tags.map((t: Tag) => t.value),
        buc: buc
      } as SaveBucsInfoProps
      if (bucNeedsAvdod() && _avdod) {
        payload.avdod = _avdod.fnr
      }
      if (bucNeedsKravDato(newlyCreatedBuc.type)) {
        payload.kravDato = _kravDato
      }
      dispatch(saveBucsInfo(payload))
      setIsCreatingBucInfo(true)
    }
  }, [aktoerId, _avdod, bucs, bucsInfo, currentBuc, dispatch, _isCreatingBuc, _isCreatingBucInfo, newlyCreatedBuc, _tags])

  useEffect(() => {
    if (_isCreatingBucInfo && newlyCreatedBuc && !loading.savingBucsInfo) {
      setBuc(undefined)
      setTags([])
      setIsCreatingBucInfo(false)
      setIsCreatingBuc(false)
      onBucCreated()
    }
  }, [_isCreatingBucInfo, newlyCreatedBuc, onBucCreated, loading.savingBucsInfo])

  useEffect(() => {
    if (kravDato) {
      const bucKravDato = kravDato.split('-').reverse().join('-')
      setKravDato(bucKravDato)
    }
  }, [kravDato])

  return (
    <div data-test-id='a-buc-c-bucstart'>
      <Row>
        <Column>
          <VerticalSeparatorDiv size='2' />
          <>
            <label className='skjemaelement__label'>
              {t('buc:form-subjectArea')}
            </label>
            <Select
              data-test-id='a-buc-c-bucstart__subjectarea-select-id'
              defaultValue={{ label: _subjectArea, value: _subjectArea } as Option}
              error={_validation?.subjectArea?.feilmelding}
              id='a-buc-c-bucstart__subjectarea-select-id'
              isLoading={loading.gettingSubjectAreaList}
              isSearchable
              menuPortalTarget={document.getElementById('main')}
              onChange={onSubjectAreaChange}
              options={renderOptions(subjectAreaList)}
              placeholder={t(loading.gettingSubjectAreaList ? 'message:loading-subjectAreaList' : 'buc:form-chooseSubjectArea')}
            />
          </>
          <VerticalSeparatorDiv />
          <>
            <label className='skjemaelement__label'>
              {t('buc:form-buc')}
            </label>
            <Select
              data-test-id='a-buc-c-bucstart__buc-select-id'
              error={_validation?.buc?.feilmelding}
              id='a-buc-c-bucstart__buc-select-id'
              isLoading={loading.gettingBucOptions}
              isSearchable
              menuPortalTarget={document.getElementById('main')}
              onChange={onBucChange}
              options={bucListOptions}
              placeholder={t(loading.gettingBucOptions ? 'message:loading-bucOptions' : 'buc:form-chooseBuc')}
              value={_.find(bucListOptions, (b: Option) => b.value === _buc)}
            />
          </>
          {bucNeedsAvdod() && (
            <>
              <VerticalSeparatorDiv />
              <label className='skjemaelement__label'>
                {t('buc:form-avdod')}
              </label>
              <Select
                data-test-id='a-buc-c-bucstart__avdod-select-id'
                error={_validation.avdod ? t(_validation.avdod.feilmelding) : undefined}
                id='a-buc-c-bucstart__avdod-select-id'
                isSearchable
                menuPortalTarget={document.getElementById('main')}
                onChange={onAvdodChange}
                options={avdodOptions}
                placeholder={t('buc:form-chooseAvdod')}
                value={_.find(avdodOptions, (f: any) => _avdod?.fnr === f.value) || null}
              />
            </>
          )}
          {bucNeedsAvdodButWeHaveNone() && (
            <>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <TextField
                  className='flex-2'
                  data-test-id='a-buc-c-bucstart__avdod-input-id'
                  id='a-buc-c-bucstart__avdod-input-id'
                  label={t('buc:form-avdod')}
                  value={_avdodFnr}
                  onChange={onAvdodFnrChange}
                  placeholder={t('buc:form-fnrdnr')}
                  error={_validation.avdodFnr ? t(_validation.avdodFnr.feilmelding) : undefined}
                />
                <HorizontalSeparatorDiv size='0.5' />
                <HelpText>
                  {t('message:help-avdodFnr')}
                </HelpText>
              </FlexDiv>
            </>
          )}
          {bucNeedsKravDato(_buc) && (
            <>
              <VerticalSeparatorDiv />
              <FlexDiv>
                <TextField
                  data-test-id='a-buc-c-bucstart__kravDato-input-id'
                  id='a-buc-c-bucstart__kravDato-input-id'
                  label={t('buc:form-kravDato')}
                  value={_kravDato}
                  onChange={onKravDatoChange}
                  placeholder={t('buc:form-kravDatoPlaceholder')}
                  error={_validation.kravDato ? t(_validation.kravDato.feilmelding) : undefined}
                />
                {loading.gettingKravDato
                  ? (
                    <>
                      <HorizontalSeparatorDiv />
                      <WaitingPanel size='xsmall' oneLine />
                    </>
                    )
                  : undefined}
              </FlexDiv>
            </>
          )}
        </Column>
        <HorizontalSeparatorDiv size='2' />
        <Column>
          <VerticalSeparatorDiv size='2' />
          <MultipleSelect<Option>
            ariaLabel={t('buc:form-tagsForBUC')}
            aria-describedby='help-tags'
            data-test-id='a-buc-c-bucstart__tags-select-id'
            hideSelectedOptions={false}
            id='a-buc-c-bucstart__tags-select-id'
            isLoading={loading.gettingTagList}
            label={(
              <>
                <label className='skjemaelement__label'>
                  {t('buc:form-tagsForBUC')}
                </label>
                <VerticalSeparatorDiv />
                <BodyLong>
                  {t('buc:form-tagsForBUC-description')}
                </BodyLong>
              </>
              )}
            onSelect={onTagsChange}
            options={tagObjectList}
            menuPortalTarget={document.getElementById('main')}
            placeholder={t(loading.gettingTagList ? 'message:loading-tagList' : 'buc:form-tagPlaceholder')}
            values={_tags}
          />
        </Column>
      </Row>
      {_showWarningBuc && (
        <>
          <VerticalSeparatorDiv size='2' />
          <Row>
            <Column>
              <Alert
                variant='warning'
                data-test-id='a-buc-c-bucstart__warning-id'
              >
                <BodyLong>
                  {t('message:alert-noDeceased')}
                </BodyLong>
              </Alert>
            </Column>
            <HorizontalSeparatorDiv size='2' />
            <Column />
          </Row>
        </>
      )}
      <VerticalSeparatorDiv size='2' />
      <div data-test-id='a-buc-c-bucstart__buttons-id'>
        <Button
          variant='primary'
          data-amplitude='buc.new.create'
          data-test-id='a-buc-c-bucstart__forward-button-id'
          disabled={_isCreatingBuc}
          onClick={onForwardButtonClick}
        >
          {_isCreatingBuc && <Loader />}
          {loading.creatingBUC
            ? t('message:loading-creatingCaseinRINA')
            : loading.savingBucsInfo
              ? t('message:loading-savingBucInfo')
              : t('buc:form-createCaseinRINA')}
        </Button>
        <HorizontalSeparatorDiv />
        <Button
          variant='tertiary'
          data-amplitude='buc.new.cancel'
          data-test-id='a-buc-c-bucstart__cancel-button-id'
          onClick={onCancelButtonClick}
        >{t('ui:cancel')}
        </Button>
      </div>
      <VerticalSeparatorDiv />
      {!hasNoValidationErrors(_validation) && (
        <>
          <VerticalSeparatorDiv size='2' />
          <Row>
            <Column>
              <ErrorSummary
                data-test-id='a-buc-c-bucstart__feiloppsummering-id'
                heading={t('buc:form-feiloppsummering')}
              >
                {_.filter(Object.values(_validation), v => v !== undefined).map((a: ErrorElement | undefined) => (
                  <ErrorSummary.Item href={a?.skjemaelementId}>{a?.feilmelding}</ErrorSummary.Item>
                ))}

              </ErrorSummary>
            </Column>
            <HorizontalSeparatorDiv size='2' />
            <Column />
          </Row>
        </>
      )}
    </div>
  )
}

BUCStart.propTypes = {
  aktoerId: PT.string.isRequired,
  initialCreatingBucInfo: PT.bool,
  initialIsCreatingBuc: PT.bool,
  onBucCreated: PT.func.isRequired,
  onBucCancelled: PT.func.isRequired
}

export default BUCStart
