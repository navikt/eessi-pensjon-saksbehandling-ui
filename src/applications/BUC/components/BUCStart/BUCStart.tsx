import { getBucTypeLabel } from 'applications/BUC/components/BUCUtils/BUCUtils'
import { Buc, BucsInfo, Tags } from 'applications/BUC/declarations/buc.d'
import classNames from 'classnames'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { ActionCreators, AllowedLocaleString, Loading, Option, T, Validation } from 'types.d'

export interface BUCStartProps {
  actions: ActionCreators;
  aktoerId?: string;
  buc?: Buc;
  bucParam?: string;
  bucsInfo?: BucsInfo;
  bucList?: Array<string>;
  loading: Loading;
  locale?: AllowedLocaleString;
  mode: string;
  onTagsChanged?: Function;
  sakId?: string;
  setMode: Function;
  subjectAreaList?: Array<string>;
  tagList?: Array<string>;
  t: T;
}

const placeholders: {[k: string]: string} = {
  subjectArea: 'buc:form-chooseSubjectArea',
  buc: 'buc:form-chooseBuc'
}

const BUCStart = ({
  actions, aktoerId, buc, bucParam, bucsInfo, bucList, loading, locale, mode,
  onTagsChanged, sakId, setMode, subjectAreaList, tagList, t
}: BUCStartProps) => {
  const [_buc, setBuc] = useState<string | undefined>(bucParam)
  const [_subjectArea, setSubjectArea] = useState<string>('Pensjon')
  const [_tags, setTags] = useState<Array<string>>([])
  const [validation, setValidation] = useState<Validation>({
    subjectAreaFail: undefined,
    bucFail: undefined
  })
  const [isBucCreated, setIsBucCreated] = useState<boolean>(false)
  const [hasBucInfoSaved, setHasBucInfoSaved] = useState<boolean>(false)

  useEffect(() => {
    if (subjectAreaList === undefined && !loading.gettingSubjectAreaList) {
      actions.getSubjectAreaList()
    }
    if (bucList === undefined && !loading.gettingBucList) {
      actions.getBucList()
    }
    if (tagList === undefined && !loading.gettingTagList) {
      actions.getTagList()
    }
  }, [actions, loading, bucList, subjectAreaList, tagList])

  useEffect(() => {
    if (!isBucCreated && buc) {
      actions.saveBucsInfo({
        bucsInfo: bucsInfo,
        aktoerId: aktoerId,
        tags: _tags,
        buc: buc
      })
      setIsBucCreated(true)
    }
  }, [actions, loading, bucsInfo, aktoerId, buc, _buc, _tags, isBucCreated])

  useEffect(() => {
    if (!hasBucInfoSaved && loading.savingBucsInfo) {
      setHasBucInfoSaved(true)
    }
    if (hasBucInfoSaved && !loading.savingBucsInfo && buc) {
      setMode('sednew')
      setHasBucInfoSaved(false)
    }
  }, [actions, loading, buc, hasBucInfoSaved, setMode])

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
    setValidation({
      ...validation,
      [key]: value
    })
  }

  const onForwardButtonClick: Function = (): void => {
    if (validateSubjectArea(_subjectArea) && validateBuc(_buc)) {
      actions.createBuc(_buc)
    }
  }

  const onCancelButtonClick: Function = (): void => {
    actions.resetBuc()
    setMode('buclist')
  }

  const onSubjectAreaChange: Function = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const thisSubjectArea = e.target.value
    setSubjectArea(thisSubjectArea)
    validateSubjectArea(thisSubjectArea)
  }

  const onBucChange: Function = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const thisBuc = e.target.value
    setBuc(thisBuc)
    validateBuc(thisBuc)
  }

  const onTagsChange: Function = (tagsList: Array<string>): void => {
    setTags(tagsList)
    if (_.isFunction(onTagsChanged)) {
      onTagsChanged(tagsList)
    }
  }

  const renderOptions: Function = (options: Array<Option>, type: string): JSX.Element[] | null => {
    if (!options || Object.keys(options).length === 0) {
      options = [{
        value: placeholders[type],
        label: t(placeholders[type])
      }]
    }
    if (!options[0].value || (options[0].value && options[0].value !== placeholders[type])) {
      options.unshift({
        value: placeholders[type],
        label: t(placeholders[type])
      })
    }

    return options ? options.map((el: Option) => {
      let label, value
      if (typeof el === 'string') {
        value = el
        label = el
      } else {
        value = el.value || el.navn
        label = el.label || el.navn
      }
      return <option value={value} key={value}>{getOptionLabel(label)}</option>
    }) : null
  }

  const getOptionLabel: Function = (value: any): any => {
    if (typeof value !== 'string') {
      return value
    }

    let label = value
    const description = getBucTypeLabel({
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
    return <Ui.WaitingPanel className='a-buc-c-bucstart__spinner ml-2' size='S' message={t(text)} />
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

  if (!sakId || !aktoerId) {
    return null
  }

  return (
    <div className='a-buc-c-bucstart'>
      {mode === 'page' ? (
        <>
          <Ui.Nav.Systemtittel className='a-buc-c-bucstart__page-title mb-4'>
            {t('buc:app-startCaseDescription')}
          </Ui.Nav.Systemtittel>
          <div className='mb-5'>
            <Ui.EESSIPensjonVeilederPanel closeButton>{t('help-startCase2')}</Ui.EESSIPensjonVeilederPanel>
          </div>
        </>
      ) : null}
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
            feil={validation.subjectAreaFail ? { feilmelding: validation.subjectAreaFail } : null}
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
            feil={validation.bucFail ? { feilmelding: validation.bucFail } : null}
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
  aktoerId: PT.string,
  actions: PT.object,
  buc: PT.object,
  bucsInfo: PT.object,
  bucList: PT.array,
  bucParam: PT.string,
  loading: PT.object,
  locale: PT.string,
  mode: PT.string,
  onTagsChanged: PT.func,
  sakId: PT.string,
  subjectAreaList: PT.array,
  tagList: PT.array,
  t: PT.func.isRequired
}

export default BUCStart
