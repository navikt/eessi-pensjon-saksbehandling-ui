import {
  cleanNewlyCreatedBuc,
  createBuc,
  fetchKravDato,
  getBucList,
  getSubjectAreaList,
  getTagList,
  resetBuc,
  saveBucsInfo
} from 'actions/buc'
import {
  bucsThatSupportAvdod,
  getBucTypeLabel,
  valueSorter
} from 'applications/BUC/components/BUCUtils/BUCUtils'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Select from 'components/Select/Select'
import NavHighContrast, {
  Column,
  HighContrastFeiloppsummering,
  HighContrastFlatknapp,
  HighContrastHovedknapp, HighContrastInput,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import * as constants from 'constants/constants'
import {
  AllowedLocaleString,
  FeatureToggles,
  Loading,
  Option,
  Options,
  PesysContext,
  Validation
} from 'declarations/app.d'
import {
  Buc,
  BUCRawList,
  Bucs,
  BucsInfo, SakTypeMap,
  SakTypeValue,
  SaveBucsInfoProps,
  SubjectAreaRawList,
  Tag,
  TagRawList,
  Tags
} from 'declarations/buc.d'

import { Person, PersonAvdod, PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import AlertStripe from 'nav-frontend-alertstriper'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ValueType } from 'react-select'
import styled from 'styled-components'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'

const FlexDiv = styled.div`
  display: flex;
  align-items: flex-end;
`
export interface BUCStartProps {
  aktoerId: string
  initialCreatingBucInfo?: boolean
  initialIsCreatingBuc?: boolean
  onBucChanged?: (option: ValueType<Option, false>) => void
  onBucCreated: () => void
  onBucCancelled: () => void
}

export interface BUCStartSelector {
  bucList?: BUCRawList | undefined
  bucParam: string | undefined
  bucs: Bucs | undefined
  bucsInfo?: BucsInfo | undefined
  currentBuc: string | undefined
  featureToggles: FeatureToggles
  highContrast: boolean
  kravDato: string | null | undefined
  kravId: string | undefined
  loading: Loading
  locale: AllowedLocaleString
  newlyCreatedBuc: Buc | undefined
  person: Person | undefined
  personAvdods: PersonAvdods | undefined
  pesysContext: PesysContext | undefined
  sakId: string
  sakType: SakTypeValue | undefined
  subjectAreaList?: SubjectAreaRawList | undefined
  tagList?: TagRawList | undefined
}

const mapState = (state: State): BUCStartSelector => ({
  bucList: state.buc.bucList,
  bucParam: state.app.params.buc,
  bucs: state.buc.bucs,
  bucsInfo: state.buc.bucsInfo,
  currentBuc: state.buc.currentBuc,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
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
    bucList, bucParam, bucs, bucsInfo, currentBuc, featureToggles,
    highContrast, kravDato, kravId, loading, locale, newlyCreatedBuc, person, personAvdods,
    pesysContext, sakId, sakType, subjectAreaList, tagList
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapState)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_avdod, setAvdod] = useState<PersonAvdod | undefined>(undefined)
  const [_buc, setBuc] = useState<string | undefined>(bucParam)
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
  const bucNeedsAvdod = (): boolean => bucsThatSupportAvdod(_buc) && avdodExists() &&
    (_buc === 'P_BUC_10'
      ? pesysContext === constants.VEDTAKSKONTEKST && (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)
      : true
    )

  // show krav dato for P_BUC_10 criteria
  const bucNeedsKravDato = (buc: string | null | undefined): boolean => {
    return !!(buc === 'P_BUC_10' && avdodExists() &&
      pesysContext === constants.VEDTAKSKONTEKST &&
      (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP)
    )
  }

  // END QUESTIONS

  const hasNoValidationErrors = (validation: Validation): boolean => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const updateValidation = (_key: string, validationError: FeiloppsummeringFeil | undefined) => {
    if (!validationError) {
      const newValidation = _.cloneDeep(_validation)
      newValidation[_key] = undefined
      setValidation(newValidation)
    }
  }

  const validateAvdod = (avdod: PersonAvdod | undefined): FeiloppsummeringFeil | undefined => {
    if (!avdod) {
      return {
        skjemaelementId: 'a-buc-c-bucstart__avdod-select-id',
        feilmelding: t('buc:validation-chooseAvdod')
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateBuc = (buc: string | undefined): FeiloppsummeringFeil | undefined => {
    if (!buc) {
      return {
        skjemaelementId: 'a-buc-c-bucstart__buc-select-id',
        feilmelding: t('buc:validation-chooseBuc')
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateSubjectArea = (subjectArea: string): FeiloppsummeringFeil | undefined => {
    if (!subjectArea) {
      return {
        skjemaelementId: 'a-buc-c-bucstart__subjectarea-select-id',
        feilmelding: t('buc:validation-chooseSubjectArea')
      } as FeiloppsummeringFeil
    }
    return undefined
  }

  const validateKravDato = (kravDato: string | undefined): FeiloppsummeringFeil | undefined => {
    if (!kravDato || kravDato?.length === 0) {
      return {
        feilmelding: t('buc:validation-chooseKravDato'),
        skjemaelementId: 'a-buc-c-sedstart__kravDato-input-id'
      } as FeiloppsummeringFeil
    }
    if (!kravDato.match(/\d{2}-\d{2}-\d{4}/)) {
      return {
        skjemaelementId: 'a-buc-c-sedstart__kravDato-input-id',
        feilmelding: t('buc:validation-badKravDato')
      } as FeiloppsummeringFeil
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
      const payload: any = {
        buc: _buc,
        person: person
      }
      if (bucNeedsAvdod()) {
        payload.avdod = _avdod
      }
      if (bucNeedsKravDato(_buc)) {
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

  const onSubjectAreaChange = (option: ValueType<Option, false>): void => {
    if (option) {
      const thisSubjectArea: string = option.value
      setSubjectArea(thisSubjectArea)
      updateValidation('sed', validateSubjectArea(thisSubjectArea))
    }
  }

  const onBucChange = (option: ValueType<Option, false>): void => {
    if (option) {
      const thisBuc: string = option.value
      setBuc(thisBuc)
      updateValidation('buc', validateBuc(thisBuc))
      if (bucNeedsKravDato(thisBuc)) {
        setKravDato('')
        dispatch(fetchKravDato({
          sakId: sakId,
          aktoerId: aktoerId,
          kravId: kravId
        }))
      }
      if (onBucChanged) {
        onBucChanged(option)
      }
    }
  }

  const onTagsChange = (tagsList: ValueType<Tag, true>): void => {
    setTags(tagsList as Tags)
    standardLogger('buc.new.tags.select', { tags: (tagsList as Tags)?.map(t => t.label) || [] })
  }

  const onKravDatoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKravDato = e.target.value
    updateValidation('kravDato', undefined)
    setKravDato(newKravDato)
  }

  const renderOptions = (options: Array<Option | string> | undefined, sort?: (a: Option, b: Option) => number): Options => {
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

  const tagObjectList: Tags = tagList
    ? tagList.map(tag => {
        return {
          value: tag,
          label: t('buc:' + tag)
        } as Tag
      })
    : []

  const onAvdodChange = (option: ValueType<Option, false>): void => {
    if (option) {
      const thisAvdod: PersonAvdod | undefined = _.find(personAvdods,
        (avdod: PersonAvdod) => avdod.fnr === option.value
      )
      setAvdod(thisAvdod)
      updateValidation('avdod', validateAvdod(thisAvdod))
    }
  }

  const renderAvdodOptions = (personAvdods: PersonAvdods | undefined): Options => {
    return personAvdods?.map((avdod: PersonAvdod) => ({
      label: avdod.fulltNavn + ' (' + avdod.fnr + ')',
      value: avdod.fnr
    })) || []
  }

  const avdodOptions: Options = renderAvdodOptions(personAvdods)

  useEffect(() => {
    if (subjectAreaList === undefined && !loading.gettingSubjectAreaList) {
      dispatch(getSubjectAreaList())
    }
  }, [dispatch, loading.gettingSubjectAreaList, subjectAreaList])

  useEffect(() => {
    if (bucList === undefined && !loading.gettingBucList) {
      dispatch(getBucList(sakId, featureToggles, pesysContext, sakType))
    }
  }, [bucList, dispatch, loading.gettingBucList, pesysContext, sakId, sakType])

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
        tags: _tags.map(t => t.value),
        buc: buc
      } as SaveBucsInfoProps
      if (bucNeedsAvdod()) {
        payload.avdod = _avdod?.fnr
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
    <NavHighContrast highContrast={highContrast}>
      <div data-test-id='a-buc-c-bucstart'>
        <Row>
          <Column>
            <VerticalSeparatorDiv data-size='2' />
            <>
              <label className='skjemaelement__label'>
                {t('buc:form-subjectArea')}
              </label>
              <Select
                data-test-id='a-buc-c-bucstart__subjectarea-select-id'
                defaultValue={{ label: _subjectArea, value: _subjectArea }}
                feil={_validation.subjectArea ? t(_validation.subjectArea.feilmelding) : undefined}
                highContrast={highContrast}
                id='a-buc-c-bucstart__subjectarea-select-id'
                isLoading={loading.gettingSubjectAreaList}
                isSearchable
                menuPortalTarget={document.getElementById('main')}
                onChange={onSubjectAreaChange}
                options={renderOptions(subjectAreaList)}
                placeholder={t(loading.gettingSubjectAreaList ? 'buc:loading-subjectAreaList' : 'buc:form-chooseSubjectArea')}
              />
            </>
            <VerticalSeparatorDiv />
            <>
              <label className='skjemaelement__label'>
                {t('buc:form-buc')}
              </label>
              <Select
                data-test-id='a-buc-c-bucstart__buc-select-id'
                feil={_validation.buc ? t(_validation.buc.feilmelding) : undefined}
                highContrast={highContrast}
                id='a-buc-c-bucstart__buc-select-id'
                isLoading={loading.gettingBucList}
                isSearchable
                menuPortalTarget={document.getElementById('main')}
                onChange={onBucChange}
                options={renderOptions(bucList, valueSorter)}
                placeholder={t(loading.gettingBucList ? 'buc:loading-bucList' : 'buc:form-chooseBuc')}
                value={_.find(bucList, (b: Option) => b.value === _buc) as ValueType<Option, false>}
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
                  feil={_validation.avdod ? t(_validation.avdod.feilmelding) : undefined}
                  highContrast={highContrast}
                  id='a-buc-c-bucstart__avdod-select-id'
                  isSearchable
                  menuPortalTarget={document.getElementById('main')}
                  onChange={onAvdodChange}
                  options={avdodOptions}
                  placeholder={t('buc:form-chooseAvdod')}
                  value={_.find(avdodOptions, (f: any) => f.value === _avdod?.fnr) || null}
                />
              </>
            )}
            {bucNeedsKravDato(_buc) && (
              <>
                <VerticalSeparatorDiv />
                <FlexDiv>
                  <HighContrastInput
                    data-test-id='a-buc-c-bucstart__kravDato-input-id'
                    id='a-buc-c-bucstart__kravDato-input-id'
                    label={t('buc:form-kravDato')}
                    bredde='fullbredde'
                    value={_kravDato}
                    onChange={onKravDatoChange}
                    placeholder={t('buc:form-kravDatoPlaceholder')}
                    feil={_validation.kravDato ? t(_validation.kravDato.feilmelding) : undefined}
                  />
                  {loading.gettingKravDato
                    ? (
                      <>
                        <HorizontalSeparatorDiv />
                        <WaitingPanel size='S' oneLine />
                      </>
                      )
                    : undefined}
                </FlexDiv>
              </>
            )}
          </Column>
          <HorizontalSeparatorDiv data-size='2' />
          <Column>
            <VerticalSeparatorDiv data-size='2' />
            <MultipleSelect<Tag>
              ariaLabel={t('buc:form-tagsForBUC')}
              aria-describedby='help-tags'
              data-test-id='a-buc-c-bucstart__tags-select-id'
              hideSelectedOptions={false}
              highContrast={highContrast}
              id='a-buc-c-bucstart__tags-select-id'
              isLoading={loading.gettingTagList}
              label={(
                <>
                  <label className='skjemaelement__label'>
                    {t('buc:form-tagsForBUC')}
                  </label>
                  <VerticalSeparatorDiv />
                  <Normaltekst>
                    {t('buc:form-tagsForBUC-description')}
                  </Normaltekst>
                </>
              )}
              onSelect={onTagsChange}
              options={tagObjectList}
              menuPortalTarget={document.getElementById('main')}
              placeholder={t(loading.gettingTagList ? 'buc:loading-tagList' : 'buc:form-tagPlaceholder')}
              values={_tags}
            />
          </Column>
        </Row>
        {_showWarningBuc && (
          <>
            <VerticalSeparatorDiv data-size='2' />
            <Row>
              <Column>
                <AlertStripe
                  type='advarsel'
                  data-test-id='a-buc-c-bucstart__warning-id'
                >
                  <Normaltekst>
                    {t('buc:alert-noDeceased')}
                  </Normaltekst>
                </AlertStripe>
              </Column>
              <HorizontalSeparatorDiv data-size='2' />
              <Column />
            </Row>
          </>
        )}
        <VerticalSeparatorDiv data-size='2' />
        <div data-test-id='a-buc-c-bucstart__buttons-id'>
          <HighContrastHovedknapp
            data-amplitude='buc.new.create'
            data-test-id='a-buc-c-bucstart__forward-button-id'
            disabled={_isCreatingBuc}
            onClick={onForwardButtonClick}
            spinner={_isCreatingBuc}
          >
            {loading.creatingBUC
              ? t('buc:loading-creatingCaseinRINA')
              : loading.savingBucsInfo
                ? t('buc:loading-savingBucInfo')
                : t('buc:form-createCaseinRINA')}
          </HighContrastHovedknapp>
          <HorizontalSeparatorDiv />
          <HighContrastFlatknapp
            data-amplitude='buc.new.cancel'
            data-test-id='a-buc-c-bucstart__cancel-button-id'
            onClick={onCancelButtonClick}
          >{t('ui:cancel')}
          </HighContrastFlatknapp>
        </div>
        <VerticalSeparatorDiv />
        {!hasNoValidationErrors(_validation) && (
          <>
            <VerticalSeparatorDiv data-size='2' />
            <Row>
              <Column>
                <HighContrastFeiloppsummering
                  data-test-id='a-buc-c-bucstart__feiloppsummering-id'
                  tittel={t('buc:form-feiloppsummering')}
                  feil={Object.values(_validation).filter(v => v !== undefined) as Array<FeiloppsummeringFeil>}
                />
              </Column>
              <HorizontalSeparatorDiv data-size='2' />
              <Column />
            </Row>
          </>
        )}
      </div>
    </NavHighContrast>
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
