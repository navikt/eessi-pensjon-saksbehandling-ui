import { Feiloppsummering, FeiloppsummeringFeil } from 'nav-frontend-skjema'
import React, { useEffect, useState } from 'react'
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
import Select from 'components/Select/Select'
import {
  Column,
  HighContrastFlatknapp,
  HighContrastHovedknapp,
  HorizontalSeparatorDiv,
  Row,
  VerticalSeparatorDiv
} from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import * as constants from 'constants/constants'
import { Buc, Bucs, BucsInfo, PersonAvdod, PersonAvdods, Tags } from 'declarations/buc'
import { State } from 'declarations/reducers'
import {
  AllowedLocaleString,
  Loading,
  Option,
  Person,
  PesysContext,
  Validation
} from 'declarations/types'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import AlertStripe from 'nav-frontend-alertstriper'
import { Normaltekst } from 'nav-frontend-typografi'
import { theme, themeHighContrast } from 'nav-styled-component-theme'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
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
  highContrast: boolean
  locale: AllowedLocaleString
  loading: Loading
  newlyCreatedBuc: Buc | undefined
  person: Person | undefined
  personAvdods: PersonAvdods | undefined
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
  highContrast: state.ui.highContrast,
  loading: state.loading,
  locale: state.ui.locale,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  person: state.app.person,
  personAvdods: state.app.personAvdods,
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
const BUCStart: React.FC<BUCStartProps> = ({
  aktoerId, onBucCreated, onBucCancelled, onTagsChanged
}: BUCStartProps): JSX.Element | null => {
  const {
    bucs, bucParam, bucsInfo, bucList, currentBuc,
    highContrast, locale, loading, newlyCreatedBuc, person,
    personAvdods, pesysContext, sakId, subjectAreaList, tagList
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapState)
  const [_avdod, setAvdod] = useState<PersonAvdod | undefined>(undefined)
  const [_buc, setBuc] = useState<string | undefined>(bucParam)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_tags, setTags] = useState<Tags>([])
  const [validation, setValidation] = useState<Validation>({})
  const [showWarningBuc, setShowWarningBuc] = useState<boolean>(false)
  const [isCreatingBuc, setIsCreatingBuc] = useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const setValidationState: Function = (key: string, value: any) => {
    const newValidation = _.cloneDeep(validation)
    newValidation[key] = value
    setValidation(newValidation)
  }

  const resetValidationState = (_key: string): void => {
    setValidation(_.omitBy(validation, (value, key) => {
      return key === _key
    }))
  }

  const validateSubjectArea = (subjectArea: string): boolean => {
    if (!subjectArea) {
      setValidationState('subjectArea', {
        skjemaelementId: 'a-buc-c-bucstart__subjectarea-select-id',
        feilmelding: t('buc:validation-chooseSubjectArea')
      } as FeiloppsummeringFeil)
      return false
    } else {
      resetValidationState('subjectArea')
      return true
    }
  }

  const validateBuc = (buc: string | undefined): boolean => {
    if (!buc) {
      setValidationState('buc', {
        skjemaelementId: 'a-buc-c-bucstart__buc-select-id',
        feilmelding: t('buc:validation-chooseBuc')
      } as FeiloppsummeringFeil)
      return false
    } else {
      resetValidationState('buc')
      return true
    }
  }

  const validateAvdod = (avdod: PersonAvdod | undefined): boolean => {
    if (!avdod) {
      setValidationState('avdod', {
        skjemaelementId: 'a-buc-c-bucstart__avdod-select-id',
        feilmelding: t('buc:validation-chooseAvdod')
      } as FeiloppsummeringFeil)
      return false
    } else {
      resetValidationState('avdod')
      return true
    }
  }

  const hasNoValidationErrors = (): boolean => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const performValidation = () :boolean => {
    let valid = validateSubjectArea(_subjectArea)
    valid = valid && validateBuc(_buc)
    if (_buc === 'P_BUC_02' && personAvdods && personAvdods.length >= 1) {
      valid = valid && validateAvdod(_avdod)
    }
    return valid
  }

  const onForwardButtonClick = (e: React.MouseEvent): void => {
    if (_buc === 'P_BUC_02' && pesysContext === constants.VEDTAKSKONTEKST && personAvdods) {
      if (personAvdods.length === 0 && !showWarningBuc) {
        setShowWarningBuc(true)
        return
      }
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

  const onTagsChange = (tagsList: Tags): void => {
    setTags(tagsList)
    standardLogger('buc.new.tags.select', { tags: tagsList?.map(t => t.label) || [] })
    if (_.isFunction(onTagsChanged)) {
      onTagsChanged(tagsList)
    }
  }

  const renderOptions = (options: Array<Option | string> | undefined): Array<any> => {
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

  const onAvdodChange = (e: any) => {
    const thisAvdod: PersonAvdod | undefined = _.find(personAvdods, (p) => p.fnr === e.value)
    setAvdod(thisAvdod)
  }

  const renderAvdodOptions = (options: any) => {
    return options?.map((el: any) => ({
      label: el.fulltNavn + ' (' + el.fnr + ')',
      value: el.fnr
    })) || []
  }

  const avdodOptions = renderAvdodOptions(personAvdods)

  useEffect(() => {
    if (subjectAreaList === undefined && !loading.gettingSubjectAreaList) {
      dispatch(getSubjectAreaList())
    }
    if (bucList === undefined && !loading.gettingBucList) {
      dispatch(getBucList(sakId, pesysContext))
    }
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [bucList, dispatch, loading, pesysContext, sakId, subjectAreaList, tagList])

  useEffect(() => {
    if (_buc === 'P_BUC_02' &&
      pesysContext === constants.VEDTAKSKONTEKST &&
      personAvdods &&
      personAvdods.length === 1 &&
      !_avdod
    ) {
      setAvdod(personAvdods[0])
    }
  }, [_buc, _avdod, pesysContext, personAvdods])

  useEffect(() => {
    if (isCreatingBuc && newlyCreatedBuc) {
      if (!loading.savingBucsInfo) {
        const buc: Buc = bucs![currentBuc!]
        dispatch(saveBucsInfo({
          aktoerId: aktoerId,
          bucsInfo: bucsInfo,
          tags: _tags.map(t => t.value),
          buc: buc,
          avdod: _avdod
        } as SaveBucsInfoProps))
      } else {
        setBuc(undefined)
        setTags([])
        setIsCreatingBuc(false)
        onBucCreated()
      }
    }
  }, [aktoerId, _avdod, bucs, bucsInfo, currentBuc, dispatch, isCreatingBuc, newlyCreatedBuc, onBucCreated, loading.savingBucsInfo, _tags])

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
                id='a-buc-c-bucstart__subjectarea-select-id'
                data-testid='a-buc-c-bucstart__subjectarea-select-id'
                isSearchable
                placeholder={t('buc:form-chooseSubjectArea')}
                defaultValue={{ label: _subjectArea, value: _subjectArea }}
                onChange={onSubjectAreaChange}
                options={renderOptions(subjectAreaList)}
                feil={validation.subjectArea ? t(validation.subjectArea.feilmelding) : null}
              />
            </>
            <VerticalSeparatorDiv />
            <>
              <label className='skjemaelement__label'>
                {t('buc:form-buc')}
              </label>
              <Select
                highContrast={highContrast}
                id='a-buc-c-bucstart__buc-select-id'
                data-testid='a-buc-c-bucstart__buc-select-id'
                menuPortalTarget={document.body}
                isSearchable
                placeholder={t('buc:form-chooseBuc')}
                onChange={onBucChange}
                options={renderOptions(bucList)}
                feil={validation.buc ? t(validation.buc.feilmelding) : null}
              />
            </>
            {_buc === 'P_BUC_02' && personAvdods && personAvdods.length >= 1 && (
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
                  feil={validation.avdod ? t(validation.avdod.feilmelding) : null}
                />
              </>
            )}
          </Column>
          <HorizontalSeparatorDiv data-size='2' />
          <Column>
            <VerticalSeparatorDiv data-size='2' />
            <MultipleSelect
              menuPortalTarget={document.body}
              highContrast={highContrast}
              ariaLabel={t('buc:form-tagsForBUC')}
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
              id='a-buc-c-bucstart__tags-select-id'
              className='a-buc-c-bucstart__tags-select'
              placeholder={t('buc:form-tagPlaceholder')}
              aria-describedby='help-tags'
              values={_tags}
              hideSelectedOptions={false}
              onSelect={onTagsChange}
              options={tagObjectList}
            />
          </Column>
        </Row>
        {showWarningBuc && (
          <>
            <VerticalSeparatorDiv data-size='2' />
            <Row>
              <Column>
                <AlertStripe type='advarsel'>
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
        <div data-testid='a-buc-c-bucstart__buttons'>
          <HighContrastHovedknapp
            data-amplitude='buc.new.create'
            data-testid='a-buc-c-bucstart__forward-button'
            disabled={loading.creatingBUC}
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
