import {
  createBuc,
  getBucList,
  getSubjectAreaList,
  getTagList,
  resetBuc,
  saveBucsInfo,
  SaveBucsInfoProps
} from 'actions/buc'
import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { BUCMode } from 'applications/BUC/index'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HorizontalSeparatorDiv, Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Buc, Bucs, BucsInfo, Tags } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, Loading, Option, PesysContext, Validation } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import AlertStripe from 'nav-frontend-alertstriper'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Normaltekst } from 'nav-frontend-typografi'
import Select from 'components/Select/Select'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import styled, { ThemeProvider } from 'styled-components'

export interface BUCStartProps {
  aktoerId: string
  onBucCreated: () => void
  onBucCancelled: () => void
  onTagsChanged?: (t: Tags) => void
  setMode: (mode: BUCMode, s: string, callback?: any) => void
}

export interface BUCStartSelector {
  bucs: Bucs | undefined
  bucsInfo?: BucsInfo | undefined
  bucList?: Array<string> | undefined
  bucParam: string | undefined
  currentBuc: string | undefined
  featureToggles: FeatureToggles | undefined
  highContrast: boolean
  locale: AllowedLocaleString
  loading: Loading
  newlyCreatedBuc: Buc | undefined
  personAvdod: any
  pesysContext: PesysContext | undefined
  sakId: string
  subjectAreaList?: Array<string> | undefined
  tagList?: Array<string> | undefined
}

const mapState = (state: State): BUCStartSelector => ({
  bucs: state.buc.bucs,
  bucParam: state.app.params.buc,
  bucsInfo: state.buc.bucsInfo,
  bucList: state.buc.bucList,
  currentBuc: state.buc.currentBuc,
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  loading: state.loading,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  personAvdod: state.app.personAvdod,
  pesysContext: state.app.pesysContext,
  sakId: state.app.params.sakId,
  subjectAreaList: state.buc.subjectAreaList,
  tagList: state.buc.tagList
})

const MarginLeftDiv = styled.div`
  margin-left: 0.5rem;
`
const LoadingDiv = styled.div`
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`
const AlertStripeDiv = styled.div`
  @media (min-width: 768px) {
    width: 50%;
  }
`
const BUCStart: React.FC<BUCStartProps> = ({
  aktoerId, onBucCreated, onBucCancelled, onTagsChanged
}: BUCStartProps): JSX.Element | null => {
  const {
    bucs, bucParam, bucsInfo, bucList, currentBuc, featureToggles,
    highContrast, locale, loading, newlyCreatedBuc,
    personAvdod, pesysContext, sakId, subjectAreaList, tagList
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapState)
  const [_buc, setBuc] = useState<string | undefined>(bucParam)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_avdod, setAvdod] = useState<string | undefined>(undefined)
  const [_tags, setTags] = useState<Tags>([])
  const [showWarningBuc, setShowWarningBuc] = useState<boolean>(false)
  const [validation, setValidation] = useState<Validation>({
    subjectAreaFail: undefined,
    bucFail: undefined
  })
  const [isCreatingBuc, setIsCreatingBuc] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (_buc === 'P_BUC_02' && featureToggles && featureToggles.v2_ENABLED === true &&
      pesysContext === 'vedtakskontekst' && personAvdod && personAvdod.length === 0) {
      if (!showWarningBuc) {
        setShowWarningBuc(true)
      }
    } else {
      setShowWarningBuc(false)
    }
  }, [_buc, featureToggles, showWarningBuc, pesysContext, personAvdod])

  useEffect(() => {
    if (subjectAreaList === undefined && !loading.gettingSubjectAreaList) {
      dispatch(getSubjectAreaList())
    }
    if (bucList === undefined && !loading.gettingBucList) {
      dispatch(getBucList(sakId, featureToggles, pesysContext))
    }
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [bucList, dispatch, featureToggles, loading, pesysContext, sakId, subjectAreaList, tagList])

  useEffect(() => {
    if (isCreatingBuc && newlyCreatedBuc) {
      if (!loading.savingBucsInfo) {
        const buc: Buc = bucs![currentBuc!]
        dispatch(saveBucsInfo({
          bucsInfo: bucsInfo,
          aktoerId: aktoerId,
          tags: _tags.map(t => t.value),
          buc: buc
        } as SaveBucsInfoProps))
      } else {
        setBuc(undefined)
        setTags([])
        setIsCreatingBuc(false)
        onBucCreated()
      }
    }
  }, [aktoerId, bucs, bucsInfo, currentBuc, dispatch, isCreatingBuc, newlyCreatedBuc, loading.savingBucsInfo, onBucCreated, t, _tags])

  const validateSubjectArea = (subjectArea: string): boolean => {
    if (!subjectArea) {
      setValidationState('subjectAreaFail', t('buc:validation-chooseSubjectArea'))
      return false
    } else {
      resetValidationState('subjectAreaFail')
      return true
    }
  }

  const validateBuc = (buc: string): boolean => {
    if (!buc) {
      setValidationState('bucFail', t('buc:validation-chooseBuc'))
      return false
    } else {
      resetValidationState('bucFail')
      return true
    }
  }

  const resetValidationState = (_key: string): void => {
    setValidation(_.omitBy(validation, (value, key) => {
      return key === _key
    }))
  }

  const hasNoValidationErrors = (): boolean => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const setValidationState: Function = (key: string, value: string) => {
    const newValidation = _.cloneDeep(validation)
    newValidation[key] = value
    setValidation(newValidation)
  }

  const onForwardButtonClick = (e: React.MouseEvent): void => {
    if (validateSubjectArea(_subjectArea) && _buc && validateBuc(_buc)) {
      buttonLogger(e, {
        subjectArea: _subjectArea,
        buc: _buc
      })
      setIsCreatingBuc(true)
      dispatch(createBuc(_buc))
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent): void => {
    buttonLogger(e)
    dispatch(resetBuc())
    onBucCancelled()
  }

  const onSubjectAreaChange = (e: any) => {
    const thisSubjectArea: string = e.value
    setSubjectArea(thisSubjectArea)
    validateSubjectArea(thisSubjectArea)
  }

  const onBucChange = (e: any) => {
    const thisBuc: string = e.value
    setBuc(thisBuc)
    validateBuc(thisBuc)
  }

  const onAvdodChange = (e: any) => {
    const thisAvdod: string = e.value
    setAvdod(thisAvdod)
  }

  const onTagsChange = (tagsList: Tags): void => {
    setTags(tagsList)
    standardLogger('buc.new.tags.select', { tags: tagsList?.map(t => t.label) || [] })
    if (_.isFunction(onTagsChanged)) {
      onTagsChanged(tagsList)
    }
  }

  const renderAvdodOptions = (options: any) => {
    return options?.map((el: any) => ({
      label: el.fnr,
      value: el.fnr
    })) || []
  }

  const renderOptions = (options: Array<Option | string> | undefined) => {
    return options ? options.map((el: Option | string) => {
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
    }) : []
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

  const getSpinner = (text:string): JSX.Element => {
    return (
      <MarginLeftDiv>
        <WaitingPanel size='S' message={t(text)} oneLine />
      </MarginLeftDiv>
    )
  }

  const tagObjectList: Tags = tagList ? tagList.map(tag => {
    return {
      value: tag,
      label: t('buc:' + tag)
    }
  }) : []

  const allowedToForward = (): boolean => {
    return _buc !== undefined &&
      _subjectArea !== undefined &&
      (_avdod !== undefined && _buc === 'P_BUC_02') &&
      hasNoValidationErrors() &&
      !showWarningBuc &&
      !loading.creatingBUC &&
      !loading.savingBucsInfo
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <div data-testid='a-buc-c-bucstart'>
        <Row>
          <Column>
            <VerticalSeparatorDiv data-size='2' />
            <>
              <label className='skjemaelement__label'>
                {t('buc:form-subjectArea')}
              </label>
              <Select
                highContrast={highContrast}
                data-testid='a-buc-c-bucstart__subjectarea-select-id'
                isSearchable
                placeholder={t('buc:form-chooseSubjectArea')}
                defaultValue={{ label: _subjectArea, value: _subjectArea }}
                onChange={onSubjectAreaChange}
                options={renderOptions(subjectAreaList)}
              />
              {validation.subjectAreaFail && <Normaltekst>{t(validation.subjectAreaFail)}</Normaltekst>}
            </>
            <VerticalSeparatorDiv />
            <>
              <label className='skjemaelement__label'>
                {t('buc:form-buc')}
              </label>
              <Select
                highContrast={highContrast}
                data-testid='a-buc-c-bucstart__buc-select-id'
                isSearchable
                placeholder={t('buc:form-chooseBuc')}
                onChange={onBucChange}
                options={renderOptions(bucList)}
                styles={{
                  control: (styles: any) => ({
                    ...styles,
                    borderColor: '1px solid ' + theme.navGra60
                  })
                }}
              />
              {validation.bucFail && <Normaltekst>{t(validation.bucFail)}</Normaltekst>}
            </>
            <VerticalSeparatorDiv />
            {_buc === 'P_BUC_02' && personAvdod?.length > 0 && (
              <>
                <label className='skjemaelement__label'>
                  {t('buc:form-avdod')}
                </label>
                <Select
                  highContrast={highContrast}
                  data-testid='a-buc-c-bucstart__avdod-select-id'
                  isSearchable
                  placeholder={t('buc:form-chooseAvdod')}
                  onChange={onAvdodChange}
                  options={renderAvdodOptions(personAvdod)}
                  styles={{
                    control: (styles: any) => ({
                      ...styles,
                      borderColor: '1px solid ' + theme.navGra60
                    })
                  }}
                />
                {validation.avdodFail && <Normaltekst>{t(validation.avdodFail)}</Normaltekst>}
              </>
            )}
          </Column>
          <Column>
            <VerticalSeparatorDiv data-size='2' />
            <MultipleSelect
              highContrast={highContrast}
              ariaLabel={t('buc:form-tagsForBUC')}
              label={t('buc:form-tagsForBUC')}
              id='a-buc-c-bucstart__tags-select-id'
              className='a-buc-c-bucstart__tags-select'
              placeholder={t('buc:form-tagPlaceholder')}
              aria-describedby='help-tags'
              values={_tags}
              hideSelectedOptions={false}
              onSelect={onTagsChange}
              options={tagObjectList}
            />
            <VerticalSeparatorDiv />
            <Normaltekst>
              {t('buc:form-tagsForBUC-description')}
            </Normaltekst>
          </Column>
        </Row>
        {showWarningBuc && (
          <>
            <VerticalSeparatorDiv />
            <AlertStripeDiv>
              <AlertStripe type='advarsel'>
                <Normaltekst>
                  {t('buc:alert-noDeceased')}
                </Normaltekst>
              </AlertStripe>
            </AlertStripeDiv>
          </>
        )}
        <VerticalSeparatorDiv data-size='2' />
        <div data-testid='a-buc-c-bucstart__buttons'>
          <HighContrastHovedknapp
            data-amplitude='buc.new.create'
            data-testid='a-buc-c-bucstart__forward-button'
            disabled={!allowedToForward()}
            spinner={loading.creatingBUC}
            onClick={onForwardButtonClick}
          >
            {loading.creatingBUC ? t('buc:loading-creatingCaseinRINA')
              : loading.savingBucsInfo ? t('buc:loading-savingBucInfo')
                : t('buc:form-createCaseinRINA')}
          </HighContrastHovedknapp>
          <HorizontalSeparatorDiv />
          <HighContrastFlatknapp
            data-amplitude='buc.new.cancel'
            data-testid='a-buc-c-bucstart__cancel-button-id'
            onClick={onCancelButtonClick}
          >{t('ui:cancel')}
          </HighContrastFlatknapp>
        </div>
        <VerticalSeparatorDiv />
        <LoadingDiv data-testid='selectBoxMessage'>
          {!loading ? null
            : loading.gettingSubjectAreaList ? getSpinner('buc:loading-subjectArea')
              : loading.gettingBucList ? getSpinner('buc:loading-buc') : null}
        </LoadingDiv>
      </div>
    </ThemeProvider>
  )
}

BUCStart.propTypes = {
  aktoerId: PT.string.isRequired,
  onBucCreated: PT.func.isRequired,
  onBucCancelled: PT.func.isRequired,
  onTagsChanged: PT.func
}

export default BUCStart
