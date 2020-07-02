import { clientError } from 'actions/alert'
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
import classNames from 'classnames'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Buc, Bucs, BucsInfo, Tags } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, FeatureToggles, Loading, Option, Validation } from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Select } from 'nav-frontend-skjema'
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper'
import { Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import styled, { ThemeProvider } from 'styled-components'

export interface BUCStartProps {
  aktoerId: string
  onTagsChanged?: (t: Tags) => void
  setMode: (mode: string) => void
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
  sakId: state.app.params.sakId,
  subjectAreaList: state.buc.subjectAreaList,
  tagList: state.buc.tagList
})

const placeholders: {[k: string]: string} = {
  subjectArea: 'buc:form-chooseSubjectArea',
  buc: 'buc:form-chooseBuc'
}

const MarginLeftDiv = styled.div`
  margin-left: 0.5rem;
`
const FlexDiv = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`
const LeftContentDiv = styled.div`
  flex: 1;
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    padding-right: 1rem;
  }
  .grey select {
    color: ${({ theme }: any) => theme.navMorkGra} !important;
    option {
      color: ${({ theme }: any) => theme['main-font-color']} !important;
    }
  }
`
const RightContentDiv = styled.div`
  flex: 1;
  margin-bottom: 1rem;
  @media (min-width: 768px) {
    padding-left: 1rem;
  }
  .grey select {
    color: ${({ theme }: any) => theme.navMorkGra} !important;
    option {
      color: ${({ theme }: any) => theme['main-font-color']} !important;
    }
  }
`
const LoadingDiv = styled.div`
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`
const ButtonsDiv = styled.div`
  margin-top: 1rem;
  display: flex;
`

const BUCStart: React.FC<BUCStartProps> = ({
  aktoerId, onTagsChanged, setMode
}: BUCStartProps): JSX.Element | null => {
  const {
    bucs, bucParam, bucsInfo, bucList, currentBuc, featureToggles,
    highContrast, locale, loading, sakId, subjectAreaList, tagList
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapState)
  const [_buc, setBuc] = useState<string | undefined>(bucParam)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_tags, setTags] = useState<Tags>([])
  const [validation, setValidation] = useState<Validation>({
    subjectAreaFail: undefined,
    bucFail: undefined
  })
  const [isBucCreated, setIsBucCreated] = useState<boolean>(false)
  const [hasBucInfoSaved, setHasBucInfoSaved] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (subjectAreaList === undefined && !loading.gettingSubjectAreaList) {
      dispatch(getSubjectAreaList())
    }
    if (bucList === undefined && !loading.gettingBucList) {
      dispatch(getBucList(sakId, featureToggles))
    }
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [bucList, dispatch, featureToggles, loading, sakId, subjectAreaList, tagList])

  useEffect(() => {
    if (!isBucCreated && currentBuc) {
      const buc: Buc | null = bucs && bucs[currentBuc]
        ? bucs[currentBuc]
        : null
      if (buc) {
        dispatch(saveBucsInfo({
          bucsInfo: bucsInfo,
          aktoerId: aktoerId,
          tags: _tags.map(t => t.value),
          buc: buc
        } as SaveBucsInfoProps))
        setIsBucCreated(true)
      } else {
        dispatch(clientError({
          error: t('buc:error-noBuc')
        }))
      }
    }
  }, [aktoerId, bucs, bucsInfo, currentBuc, dispatch, isBucCreated, t, _tags])

  useEffect(() => {
    if (!hasBucInfoSaved && loading.savingBucsInfo) {
      setHasBucInfoSaved(true)
    }
    if (hasBucInfoSaved && !loading.savingBucsInfo && currentBuc) {
      setMode('sednew')
      setHasBucInfoSaved(false)
    }
  }, [loading, currentBuc, hasBucInfoSaved, setMode])

  const validateSubjectArea = (subjectArea: string): boolean => {
    if (!subjectArea || subjectArea === placeholders.subjectArea) {
      setValidationState('subjectAreaFail', t('buc:validation-chooseSubjectArea'))
      return false
    } else {
      resetValidationState('subjectAreaFail')
      return true
    }
  }

  const validateBuc = (buc: string): boolean => {
    if (!buc || buc === placeholders.buc) {
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
      dispatch(createBuc(_buc))
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent): void => {
    buttonLogger(e)
    dispatch(resetBuc())
    setMode('buclist')
  }

  const onSubjectAreaChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const thisSubjectArea: string = e.target.value
    setSubjectArea(thisSubjectArea)
    validateSubjectArea(thisSubjectArea)
  }

  const onBucChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const thisBuc: string = e.target.value
    setBuc(thisBuc)
    validateBuc(thisBuc)
  }

  const onTagsChange = (tagsList: Tags): void => {
    setTags(tagsList)
    standardLogger('buc.new.tags.select', { tags: tagsList?.map(t => t.label) || [] })
    if (_.isFunction(onTagsChanged)) {
      onTagsChanged(tagsList)
    }
  }

  const renderOptions = (options: Array<Option | string> | undefined, type: string): JSX.Element[] => {
    if (!options || Object.keys(options).length === 0) {
      options = [{
        value: placeholders[type],
        label: t(placeholders[type])
      }]
    }
    if (!_.has(options[0], 'value') || (options[0] as Option).value !== placeholders[type]) {
      options.unshift({
        value: placeholders[type],
        label: t(placeholders[type])
      })
    }

    return options ? options.map((el: Option | string) => {
      let label: string, value: string
      if (typeof el === 'string') {
        value = el
        label = el
      } else {
        value = (el.value || el.navn)!
        label = (el.label || el.navn)!
      }
      return <option value={value} key={value}>{getOptionLabel(label)}</option>
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
      hasNoValidationErrors() &&
      !loading.creatingBUC &&
      !loading.savingBucsInfo
  }

  return (
    <ThemeProvider theme={highContrast ? themeHighContrast : theme}>
      <div data-testId='a-buc-c-bucstart'>
        <FlexDiv>
          <LeftContentDiv>
            <Select
              data-testId='a-buc-c-bucstart__subjectarea-select-id'
              className={classNames({
                grey: !_subjectArea || _subjectArea === placeholders.subjectArea
              })}
              aria-describedby='help-subjectArea'
              bredde='fullbredde'
              placeholder={placeholders.subjectArea}
              feil={validation.subjectAreaFail ? validation.subjectAreaFail : false}
              label={t('buc:form-subjectArea')}
              value={_subjectArea}
              onChange={onSubjectAreaChange}
            >
              {renderOptions(subjectAreaList, 'subjectArea')}
            </Select>
            <VerticalSeparatorDiv />
            <Select
              id='a-buc-c-bucstart__buc-select-id'
              className={classNames('a-buc-c-bucstart__buc-select', {
                grey: !_buc || _buc === placeholders.buc
              })}
              aria-describedby='help-buc'
              bredde='fullbredde'
              placeholder={placeholders.buc}
              feil={validation.bucFail ? validation.bucFail : false}
              label={t('buc:form-buc')}
              value={_buc || placeholders.buc}
              onChange={onBucChange}
            >
              {bucList && renderOptions(bucList, 'buc')}
            </Select>
          </LeftContentDiv>
          <RightContentDiv>
            <VerticalSeparatorDiv data-size='2' />
            <MultipleSelect
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
          </RightContentDiv>
        </FlexDiv>
        <ButtonsDiv data-testId='a-buc-c-bucstart__buttons'>
          <Hovedknapp
            data-amplitude='buc.new.create'
            data-testId='a-buc-c-bucstart__forward-button'
            disabled={!allowedToForward()}
            spinner={loading.creatingBUC}
            onClick={onForwardButtonClick}
          >
            {loading.creatingBUC ? t('buc:loading-creatingCaseinRINA')
              : loading.savingBucsInfo ? t('buc:loading-savingBucInfo')
                : t('buc:form-createCaseinRINA')}
          </Hovedknapp>
          <HorizontalSeparatorDiv />
          <Flatknapp
            data-amplitude='buc.new.cancel'
            data-testId='a-buc-c-bucstart__cancel-button-id'
            onClick={onCancelButtonClick}
          >{t('ui:cancel')}
          </Flatknapp>
        </ButtonsDiv>
        <LoadingDiv data-testId='selectBoxMessage'>
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
  onTagsChanged: PT.func
}

export default BUCStart
