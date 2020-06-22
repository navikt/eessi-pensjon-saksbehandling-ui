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
import { Buc, Bucs, BucsInfo, Tags } from 'declarations/buc'
import { State } from 'declarations/reducers'
import { AllowedLocaleString, Features, Loading, Option, Validation } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import { buttonLogger, standardLogger } from 'metrics/loggers'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface BUCStartProps {
  aktoerId: string;
  onTagsChanged?: (t: Tags) => void;
  setMode: (mode: string) => void;
}

export interface BUCStartSelector {
  bucs: Bucs | undefined,
  avdodBucs: Bucs | undefined,
  bucsInfo?: BucsInfo | undefined;
  bucList?: Array<string> | undefined;
  bucParam: string | undefined;
  currentBuc: string | undefined;
  features: Features | undefined;
  locale: AllowedLocaleString;
  loading: Loading;
  sakId: string;
  subjectAreaList?: Array<string> | undefined;
  tagList?: Array<string> | undefined;
}

const mapState = (state: State): BUCStartSelector => ({
  avdodBucs: state.buc.avdodBucs,
  bucs: state.buc.bucs,
  bucParam: state.app.params.buc,
  bucsInfo: state.buc.bucsInfo,
  bucList: state.buc.bucList,
  currentBuc: state.buc.currentBuc,
  features: state.app.features,
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

const BUCStart: React.FC<BUCStartProps> = ({
  aktoerId, onTagsChanged, setMode
}: BUCStartProps): JSX.Element | null => {
  const {
    avdodBucs, bucs, bucParam, bucsInfo, bucList, currentBuc, features,
    locale, loading, sakId, subjectAreaList, tagList
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
      dispatch(getBucList(sakId, features))
    }
    if (tagList === undefined && !loading.gettingTagList) {
      dispatch(getTagList())
    }
  }, [bucList, dispatch, features, loading, sakId, subjectAreaList, tagList])

  useEffect(() => {
    if (!isBucCreated && currentBuc) {
      const buc: Buc | null = bucs && bucs[currentBuc] ?
        bucs[currentBuc] :
        avdodBucs && avdodBucs[currentBuc] ?
          avdodBucs[currentBuc]
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
  }, [aktoerId, avdodBucs, bucs, bucsInfo, currentBuc, dispatch, isBucCreated, t, _tags])

  useEffect(() => {
    if (!hasBucInfoSaved && loading.savingBucsInfo) {
      setHasBucInfoSaved(true)
    }
    if (hasBucInfoSaved && !loading.savingBucsInfo && currentBuc) {
      setMode('sednew')
      setHasBucInfoSaved(false)
    }
  }, [loading, currentBuc, hasBucInfoSaved, setMode])

  const validateSubjectArea: Function = (subjectArea: string): boolean => {
    if (!subjectArea || subjectArea === placeholders.subjectArea) {
      setValidationState('subjectAreaFail', t('buc:validation-chooseSubjectArea'))
      return false
    } else {
      resetValidationState('subjectAreaFail')
      return true
    }
  }

  const validateBuc: Function = (buc: string): boolean => {
    if (!buc || buc === placeholders.buc) {
      setValidationState('bucFail', t('buc:validation-chooseBuc'))
      return false
    } else {
      resetValidationState('bucFail')
      return true
    }
  }

  const resetValidationState: Function = (_key: string): void => {
    setValidation(_.omitBy(validation, (value, key) => {
      return key === _key
    }))
  }

  const hasNoValidationErrors: Function = (): boolean => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const setValidationState: Function = (key: string, value: string) => {
    const newValidation = _.cloneDeep(validation)
    newValidation[key] = value
    setValidation(newValidation)
  }

  const onForwardButtonClick = (e: React.MouseEvent): void => {
    buttonLogger(e)
    if (validateSubjectArea(_subjectArea) && _buc && validateBuc(_buc)) {
      dispatch(createBuc(_buc))
    }
  }

  const onCancelButtonClick = (e: React.MouseEvent): void => {
    buttonLogger(e)
    dispatch(resetBuc())
    setMode('buclist')
  }

  const onSubjectAreaChange: Function = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const thisSubjectArea: string = e.target.value
    setSubjectArea(thisSubjectArea)
    validateSubjectArea(thisSubjectArea)
  }

  const onBucChange: Function = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const thisBuc: string = e.target.value
    setBuc(thisBuc)
    validateBuc(thisBuc)
  }

  const onTagsChange: Function = (tagsList: Tags): void => {
    setTags(tagsList)
    standardLogger('buc.new.tags.select', { tags: tagsList.map(t => t.label) })
    if (_.isFunction(onTagsChanged)) {
      onTagsChanged(tagsList)
    }
  }

  const renderOptions: Function = (options: Array<Option | string>, type: string): JSX.Element[] => {
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

  const getOptionLabel: Function = (value: string): string => {
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

  const getSpinner: Function = (text:string): JSX.Element => {
    return <Ui.WaitingPanel className='a-buc-c-bucstart__spinner ml-2' size='S' message={t(text)} oneLine />
  }

  const tagObjectList: Tags = tagList ? tagList.map(tag => {
    return {
      value: tag,
      label: t('buc:' + tag)
    }
  }) : []

  const allowedToForward: Function = (): boolean => {
    return _buc && _subjectArea && hasNoValidationErrors() && !loading.creatingBUC && !loading.savingBucsInfo
  }

  return (
    <div className='a-buc-c-bucstart'>
      <Ui.Nav.Row className='mb-3'>
        <div className='col-md-6 pr-3'>
          <Ui.Nav.Select
            id='a-buc-c-bucstart__subjectarea-select-id'
            className={classNames('a-buc-c-bucstart__subjectarea-select flex-fill', {
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
          </Ui.Nav.Select>
          <Ui.Nav.Select
            id='a-buc-c-bucstart__buc-select-id'
            className={classNames('a-buc-c-bucstart__buc-select flex-fill', {
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
            {renderOptions(bucList, 'buc')}
          </Ui.Nav.Select>
        </div>
        <div className='col-md-6 pl-3'>
          <div className='flex-fill'>
            <Ui.Nav.Undertittel className='mb-2'>{t('buc:form-tagsForBUC')}</Ui.Nav.Undertittel>
            <div className='mb-3'>
              <Ui.Nav.Normaltekst className='mb-2'>{t('buc:form-tagsForBUC-description')}</Ui.Nav.Normaltekst>
              <Ui.MultipleSelect
                ariaLabel={t('buc:form-tagsForBUC')}
                label={t('buc:form-tagsForBUC')}
                id='a-buc-c-bucstart__tags-select-id'
                className='a-buc-c-bucstart__tags-select flex-fill'
                placeholder={t('buc:form-tagPlaceholder')}
                aria-describedby='help-tags'
                values={_tags}
                hideSelectedOptions={false}
                onSelect={onTagsChange}
                options={tagObjectList}
              />
            </div>
          </div>
          <div className='selectBoxMessage mt-2 mb-2'>{!loading ? null
            : loading.gettingSubjectAreaList ? getSpinner('buc:loading-subjectArea')
              : loading.gettingBucList ? getSpinner('buc:loading-buc') : null}
          </div>
        </div>
      </Ui.Nav.Row>
      <Ui.Nav.Row className='mb-3'>
        <div className='a-buc-c-bucstart__buttons col-md-12'>
          <Ui.Nav.Hovedknapp
            data-amplitude='buc.new.create'
            id='a-buc-c-bucstart__forward-button-id'
            className='a-buc-c-bucstart__forward-button'
            disabled={!allowedToForward()}
            spinner={loading.creatingBUC}
            onClick={onForwardButtonClick}
          >
            {loading.creatingBUC ? t('buc:loading-creatingCaseinRINA')
              : loading.savingBucsInfo ? t('buc:loading-savingBucInfo')
                : t('buc:form-createCaseinRINA')}
          </Ui.Nav.Hovedknapp>
          <Ui.Nav.Flatknapp
            data-amplitude='buc.new.cancel'
            id='a-buc-c-bucstart__cancel-button-id'
            className='a-buc-c-bucstart__cancel-button ml-2'
            onClick={onCancelButtonClick}
          >{t('ui:cancel')}
          </Ui.Nav.Flatknapp>
        </div>
      </Ui.Nav.Row>
    </div>
  )
}

BUCStart.propTypes = {
  aktoerId: PT.string.isRequired,
  onTagsChanged: PT.func
}

export default BUCStart
