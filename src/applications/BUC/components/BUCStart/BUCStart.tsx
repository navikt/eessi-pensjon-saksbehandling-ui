import {
  cleanNewlyCreatedBuc,
  createBuc,
  getBucList,
  getSubjectAreaList,
  getTagList,
  resetBuc,
  saveBucsInfo
} from 'actions/buc'
import { bucsWithAvdod, getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Select from 'components/Select/Select'
import {
  Column,
  HighContrastFeiloppsummering,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
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
  BucsInfo,
  SakTypeValue,
  SaveBucsInfoProps,
  SubjectAreaRawList,
  Tag,
  TagRawList,
  Tags
} from 'declarations/buc'

import { Person, PersonAvdod, PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import AlertStripe from 'nav-frontend-alertstriper'
import { FeiloppsummeringFeil } from 'nav-frontend-skjema'
import { Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ValueType } from 'react-select'
import { ThemeProvider } from 'styled-components'

export interface BUCStartProps {
  aktoerId: string
  initialCreatingBucInfo?: boolean
  initialIsCreatingBuc?: boolean
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
  onBucCreated,
  onBucCancelled
}: BUCStartProps): JSX.Element | null => {
  const {
    bucList, bucParam, bucs, bucsInfo, currentBuc, featureToggles, highContrast,
    loading, locale, newlyCreatedBuc, person, personAvdods,
    pesysContext, sakId, sakType, subjectAreaList, tagList
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapState)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [_avdod, setAvdod] = useState<PersonAvdod | undefined>(undefined)
  const [_buc, setBuc] = useState<string | undefined>(bucParam)
  const [_isCreatingBuc, setIsCreatingBuc] = useState<boolean>(initialIsCreatingBuc)
  const [_isCreatingBucInfo, setIsCreatingBucInfo] = useState<boolean>(initialCreatingBucInfo)
  const [_showWarningBuc, setShowWarningBuc] = useState<boolean>(false)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_tags, setTags] = useState<Tags>([])
  const [_validation, setValidation] = useState<Validation>({})

  const sedNeedsAvdod = (): boolean => (bucsWithAvdod(_buc) && (personAvdods ? personAvdods.length > 0 : false))

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

  const performValidation = () :boolean => {
    const validation: Validation = {}
    validation.subjectArea = validateSubjectArea(_subjectArea)
    validation.buc = validateBuc(_buc)
    if (sedNeedsAvdod()) {
      validation.avdod = validateAvdod(_avdod)
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
      dispatch(createBuc(_buc, person, _avdod))
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    dispatch(resetBuc())
    onBucCancelled()
  }

  const onSubjectAreaChange = (option: ValueType<Option> | null | undefined): void => {
    if (option) {
      const thisSubjectArea: string = (option as Option).value
      setSubjectArea(thisSubjectArea)
      updateValidation('sed', validateSubjectArea(thisSubjectArea))
    }
  }

  const onBucChange = (option: ValueType<Option> | null | undefined): void => {
    if (option) {
      const thisBuc: string = (option as Option).value
      setBuc(thisBuc)
      updateValidation('buc', validateBuc(thisBuc))
    }
  }

  const onTagsChange = (tagsList: ValueType<Tag>): void => {
    setTags(tagsList as Tags)
    standardLogger('buc.new.tags.select', { tags: (tagsList as Tags)?.map(t => t.label) || [] })
  }

  const renderOptions = (options: Array<Option | string> | undefined): Options => {
    return options
      ? options.map((el: Option | string) => {
          let label: string, value: string
          if (typeof el === 'string') {
            value = el
            label = el
          } else {
            value = (el.value || el.navn)!
            label = (el.label || el.navn)!
          }
          return {
            label: getOptionLabel(label),
            value: value
          }
        })
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

  const onAvdodChange = (option: ValueType<Option>): void => {
    if (option) {
      const thisAvdod: PersonAvdod | undefined = _.find(personAvdods,
        (avdod: PersonAvdod) => avdod.fnr === (option as Option).value
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
    if (bucsWithAvdod(_buc) &&
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
      dispatch(saveBucsInfo({
        aktoerId: aktoerId,
        bucsInfo: bucsInfo,
        tags: _tags.map(t => t.value),
        buc: buc,
        avdod: _avdod
      } as SaveBucsInfoProps))
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

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
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
                options={renderOptions(bucList)}
                placeholder={t(loading.gettingBucList ? 'buc:loading-bucList' : 'buc:form-chooseBuc')}
              />
            </>
            {sedNeedsAvdod() && (
              <>
                <VerticalSeparatorDiv />
                <label className='skjemaelement__label'>
                  {t('buc:form-avdod')}
                </label>
                <Select
                  data-test-id='a-buc-c-bucstart__avdod-select-id'
                  feil={_validation.avdod ? t(_validation.avdod.feilmelding) : undefined}
                  highContrast={highContrast}
                  isSearchable
                  menuPortalTarget={document.getElementById('main')}
                  onChange={onAvdodChange}
                  options={avdodOptions}
                  placeholder={t('buc:form-chooseAvdod')}
                  value={_.find(avdodOptions, (f: any) => f.value === _avdod?.fnr) || null}
                />
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
    </ThemeProvider>
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
