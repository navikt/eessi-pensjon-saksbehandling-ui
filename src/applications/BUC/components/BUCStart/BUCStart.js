import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { MultipleSelect, Nav, PsychoPanel, WaitingPanel } from 'eessi-pensjon-ui'

const placeholders = {
  subjectArea: 'buc:form-chooseSubjectArea',
  buc: 'buc:form-chooseBuc'
}

const BUCStart = ({
  actions, aktoerId, buc, bucParam, bucsInfo, bucList, loading, mode, sakId, setMode, subjectAreaList, tagList, t
}) => {
  const [_buc, setBuc] = useState(bucParam)
  const [_subjectArea, setSubjectArea] = useState('Pensjon')
  const [_tags, setTags] = useState([])
  const [validation, setValidation] = useState({
    subjectAreaFail: undefined,
    bucFail: undefined
  })

  const [isBucCreated, setIsBucCreated] = useState(false)
  const [hasBucInfoSaved, setHasBucInfoSaved] = useState(false)

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
  }, [actions, loading, buc, hasBucInfoSaved])

  const validateSubjectArea = (subjectArea) => {
    if (!subjectArea || subjectArea === placeholders.subjectArea) {
      setValidationState('subjectAreaFail', t('buc:validation-chooseSubjectArea'))
    } else {
      resetValidationState('subjectAreaFail')
    }
  }

  const validateBuc = (buc) => {
    if (!buc || buc === placeholders.buc) {
      setValidationState('bucFail', t('buc:validation-chooseBuc'))
    } else {
      resetValidationState('bucFail')
    }
  }

  const resetValidationState = (_key) => {
    setValidation(_.omitBy(validation, (value, key) => {
      return key === _key
    }))
  }

  const hasNoValidationErrors = () => {
    return _.find(validation, (it) => (it !== undefined)) === undefined
  }

  const setValidationState = (key, value) => {
    setValidation({
      ...validation,
      [key]: value
    })
  }

  const onForwardButtonClick = () => {
    validateSubjectArea(_subjectArea)
    validateBuc(_buc)
    if (hasNoValidationErrors()) {
      actions.createBuc(_buc)
    }
  }

  const onCancelButtonClick = () => {
    actions.resetBuc()
    setMode('buclist')
  }

  const onSubjectAreaChange = (e) => {
    const thisSubjectArea = e.target.value
    setSubjectArea(thisSubjectArea)
    validateSubjectArea(thisSubjectArea)
  }

  const onBucChange = (e) => {
    const thisBuc = e.target.value
    setBuc(thisBuc)
    validateBuc(thisBuc)
  }

  const onTagsChange = (tagsList) => {
    setTags(tagsList)
  }

  const renderOptions = (options, type) => {
    if (!options || Object.keys(options).length === 0) {
      options = [{
        key: placeholders[type],
        value: t(placeholders[type])
      }]
    }
    if (!options[0].key || (options[0].key && options[0].key !== placeholders[type])) {
      options.unshift({
        key: placeholders[type],
        value: t(placeholders[type])
      })
    }

    return options ? options.map(el => {
      let key, value
      if (typeof el === 'string') {
        key = el
        value = el
      } else {
        key = el.key || el.navn
        value = el.value || el.navn
      }
      return <option value={key} key={key}>{getOptionLabel(value)}</option>
    }) : null
  }

  const getOptionLabel = (value) => {
    if (typeof value !== 'string') {
      return value
    }
    let label = value
    const description = t('buc:buc-' + value.replace(':', '.'))
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const getSpinner = (text) => {
    return <WaitingPanel className='a-buc-c-bucstart__spinner ml-2' size='S' message={t(text)} />
  }

  const tagObjectList = tagList ? tagList.map(tag => {
    return {
      value: tag,
      label: t('buc:' + tag)
    }
  }) : []

  const allowedToForward = () => {
    return _buc && _subjectArea && hasNoValidationErrors() && !loading.creatingBUC && !loading.savingBucsInfo
  }

  if (!sakId || !aktoerId) {
    return null
  }

  return (
    <div className='a-buc-c-bucstart'>
      {mode === 'page' ? (
        <>
          <Nav.Systemtittel className='a-buc-c-bucstart__page-title mb-4'>
            {t('buc:app-startCaseDescription')}
          </Nav.Systemtittel>
          <div className='mb-5'>
            <PsychoPanel closeButton>{t('help-startCase2')}</PsychoPanel>
          </div>
        </>
      ) : null}
      <Nav.Row className='mb-3'>
        <div className='col-md-6 pr-3'>
          <Nav.Select
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
          </Nav.Select>
          <Nav.Select
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
          </Nav.Select>
        </div>
        <div className='col-md-6 pl-3'>
          <div className='flex-fill'>
            <Nav.Undertittel className='mb-2'>{t('buc:form-tagsForBUC')}</Nav.Undertittel>
            <div className='mb-3'>
              <Nav.Normaltekst className='mb-2'>{t('buc:form-tagsForBUC-description')}</Nav.Normaltekst>
              <MultipleSelect
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
      </Nav.Row>
      <Nav.Row className='mb-3'>
        <div className='a-buc-c-bucstart__buttons col-md-12'>
          <Nav.Hovedknapp
            id='a-buc-c-bucstart__forward-button-id'
            className='a-buc-c-bucstart__forward-button'
            disabled={!allowedToForward()}
            spinner={loading.creatingBUC}
            onClick={onForwardButtonClick}
          >
            {loading.creatingBUC ? t('buc:loading-creatingCaseinRINA')
              : loading.savingBucsInfo ? t('buc:loading-savingBucInfo')
                : t('buc:form-createCaseinRINA')}
          </Nav.Hovedknapp>
          <Nav.Flatknapp
            id='a-buc-c-bucstart__cancel-button-id'
            className='a-buc-c-bucstart__cancel-button ml-2'
            onClick={onCancelButtonClick}
          >{t('ui:cancel')}
          </Nav.Flatknapp>
        </div>
      </Nav.Row>
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
  mode: PT.string,
  sakId: PT.string,
  subjectAreaList: PT.array,
  tagList: PT.array,
  t: PT.func.isRequired
}

export default BUCStart
