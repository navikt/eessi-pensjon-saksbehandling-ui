import { Alert, BodyLong, Button, Loader } from '@navikt/ds-react'
import {
  cleanNewlyCreatedBuc,
  getTagList,
  resetBuc,
  saveBucsInfo
} from 'actions/buc'
import { bucsThatSupportAvdod, getBucTypeLabel, valueSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'
import Select from 'components/Select/Select'
import ValidationBox from 'components/ValidationBox/ValidationBox'
import {
  ErrorElement,
  Option,
  Validation
} from 'declarations/app.d'
import {
  Buc,
  NewBucPayload, SakTypeKey, SakTypeValueToKeyMap,
  SaveBucsInfoProps,
  Tag,
  Tags
} from 'declarations/buc.d'
import { PersonAvdod } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import { Column, HorizontalSeparatorDiv, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {createBucGjenny, getBucOptionsGjenny} from "actions/gjenny";
import {BUCStartIndexProps, BUCStartSelector, mapBUCStartState} from "./BUCStartIndex";

const BUCStartGjenny: React.FC<BUCStartIndexProps> = ({
  aktoerId,
  initialIsCreatingBuc = false,
  initialCreatingBucInfo = false,
  onBucChanged,
  onBucCreated,
  onBucCancelled
}: BUCStartIndexProps): JSX.Element | null => {
  const {
    bucOptions, bucParam, bucs, bucsInfo, currentBuc,
    loading, locale, newlyCreatedBuc, personPdl, personAvdods,
    pesysContext, subjectAreaList, tagList, sakType, sakId
  }: BUCStartSelector = useSelector<State, BUCStartSelector>(mapBUCStartState)

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_avdod, setAvdod] = useState<PersonAvdod | undefined>(undefined)
  const [_buc, setBuc] = useState<string | null | undefined>(bucParam)
  const [_isCreatingBuc, setIsCreatingBuc] = useState<boolean>(initialIsCreatingBuc)
  const [_isCreatingBucInfo, setIsCreatingBucInfo] = useState<boolean>(initialCreatingBucInfo)
  const [_showWarningBucDeceased, setShowWarningBucDeceased] = useState<boolean>(false)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_tags, setTags] = useState<Tags>([])
  const [_validation, setValidation] = useState<Validation>({})

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

  const validateBuc = (buc: string | null | undefined): ErrorElement | undefined => {
    if (!buc) {
      return {
        skjemaelementId: 'a_buc_c_BUCStart--buc-select-id',
        feilmelding: t('message:validation-chooseBuc')
      } as ErrorElement
    }
    return undefined
  }

  const validateSubjectArea = (subjectArea: string): ErrorElement | undefined => {
    if (!subjectArea) {
      return {
        skjemaelementId: 'a_buc_c_BUCStart--subjectarea-select-id',
        feilmelding: t('message:validation-chooseSubjectArea')
      } as ErrorElement
    }
    return undefined
  }

  const performValidation = () :boolean => {
    const validation: Validation = {}
    validation.subjectArea = validateSubjectArea(_subjectArea)
    validation.buc = validateBuc(_buc)
    setValidation(validation)
    return hasNoValidationErrors(validation)
  }

  const onForwardButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setShowWarningBucDeceased(false)
    dispatch(cleanNewlyCreatedBuc())

    const valid: boolean = performValidation()
    if (valid) {
      buttonLogger(e, {
        subjectArea: _subjectArea,
        buc: _buc
      })
      setIsCreatingBuc(true)
      const payload: NewBucPayload = {
        buc: _buc!,
        person: personPdl!
      }
      payload.avdod = _avdod
      payload.sakType =  SakTypeValueToKeyMap[sakType!] as SakTypeKey
      payload.sakId = sakId
      dispatch(createBucGjenny(payload))
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    buttonLogger(e)
    dispatch(resetBuc())
    setBuc(bucParam)
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
      if (onBucChanged) {
        onBucChanged(option as Option)
      }
    }
  }

  const onTagsChange = (tagsList: unknown): void => {
    setTags(tagsList as Tags)
    standardLogger('buc.new.tags.select', { tags: (tagsList as unknown as Tags)?.map(t => t.label) || [] })
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
            value
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

  useEffect(() => {
    if(bucOptions === undefined && !loading.gettingBucOptions){
      dispatch(getBucOptionsGjenny())
    }
  }, [bucOptions, loading.gettingBucOptions])

  useEffect(() => {
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [dispatch, loading.gettingTagList, tagList])

  useEffect(() => {
    if (bucsThatSupportAvdod(_buc) &&
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
        aktoerId,
        bucsInfo,
        tags: _tags.map((t: Tag) => t.value),
        buc
      } as SaveBucsInfoProps
      payload.avdod = _avdod?.fnr
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
    if(_isCreatingBuc && !loading.creatingBuc) {
      setIsCreatingBuc(false)
    }
  }, [loading.creatingBuc])

  return (
    <div data-testid='a_buc_c_BUCStart'>
      <Row>
        <Column>
          <VerticalSeparatorDiv size='2' />
          <>
            <label className='navds-text-field--label navds-label'>
              {t('buc:form-chooseSubjectArea')}
            </label>
            <Select
              data-testid='a_buc_c_BUCStart--subjectarea-select-id'
              defaultValue={{ label: _subjectArea, value: _subjectArea } as Option}
              error={_validation?.subjectArea?.feilmelding}
              id='a_buc_c_BUCStart--subjectarea-select-id'
              isSearchable
              menuPortalTarget={document.getElementById('main')}
              onChange={onSubjectAreaChange}
              options={renderOptions(subjectAreaList)}
            />
          </>
          <VerticalSeparatorDiv />
          <>
            <label className='navds-text-field--label navds-label'>
              {t(loading.gettingBucOptions ? 'message:loading-bucOptions' : 'buc:form-chooseBuc')}
            </label>
            <Select
              data-testid='a_buc_c_BUCStart--buc-select-id'
              error={_validation?.buc?.feilmelding}
              id='a_buc_c_BUCStart--buc-select-id'
              isLoading={loading.gettingBucOptions}
              isSearchable
              menuPortalTarget={document.getElementById('main')}
              onChange={onBucChange}
              options={bucListOptions}
              value={_.find(bucListOptions, (b: Option) => b.value === _buc)}
            />
          </>
        </Column>
        <HorizontalSeparatorDiv size='2' />
        <Column>
          <VerticalSeparatorDiv size='2' />
          <MultipleSelect<Option>
            ariaLabel={t('buc:form-tagsForBUC')}
            aria-describedby='help-tags'
            data-testid='a_buc_c_BUCStart--tags-select-id'
            hideSelectedOptions={false}
            id='a_buc_c_BUCStart--tags-select-id'
            isLoading={loading.gettingTagList}
            label={(
              <>
                <label className='navds-text-field--label navds-label'>
                  {t(loading.gettingTagList ? 'message:loading-tagList' : 'buc:form-tagsForBUC')}
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
            values={_tags}
          />
        </Column>
      </Row>
      {_showWarningBucDeceased && (
        <>
          <VerticalSeparatorDiv size='2' />
          <Row>
            <Column>
              <Alert
                variant='warning'
                data-testid='a_buc_c_BUCStart--warning-id'
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
      <div data-testid='a_buc_c_BUCStart--buttons-id'>
        <Button
          variant='primary'
          data-amplitude='buc.new.create'
          data-testid='a_buc_c_BUCStart--forward-button-id'
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
          data-testid='a_buc_c_BUCStart--cancel-button-id'
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
              <ValidationBox heading={t('message:error-validationbox-bucstart')} validation={_validation} />
            </Column>
            <Column />
          </Row>
        </>
      )}
    </div>
  )
}

export default BUCStartGjenny
