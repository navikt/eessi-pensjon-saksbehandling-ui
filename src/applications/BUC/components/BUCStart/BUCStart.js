import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import PsychoPanel from 'components/Psycho/PsychoPanel'
import { Flatknapp, HjelpetekstAuto, Hovedknapp, NavFrontendSpinner, Normaltekst, Row, Select, Systemtittel, Undertittel } from 'components/Nav'
import MultipleSelect from 'components/MultipleSelect/MultipleSelect'

const placeholders = {
  subjectArea: 'buc:form-chooseSubjectArea',
  buc: 'buc:form-chooseBuc'
}

const BUCStart = (props) => {
  const { actions, aktoerId, buc, bucParam, bucsInfo, bucList } = props
  const { locale, loading, mode, sakId, subjectAreaList, tagList, t } = props

  const [_buc, setBuc] = useState(bucParam)
  const [_subjectArea, setSubjectArea] = useState('Pensjon')
  const [_tags, setTags] = useState([])
  const [validation, setValidation] = useState({})

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
  }, [ actions, loading, bucList, subjectAreaList, tagList])

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
      actions.setMode('sednew')
      setHasBucInfoSaved(false)
    }
  }, [actions, loading, buc, hasBucInfoSaved])

  const onForwardButtonClick = () => {
    validateSubjectArea(_subjectArea)
    validateBuc(_buc)
    if (hasNoValidationErrors()) {
      actions.createBuc(_buc)
    }
  }

  const onCancelButtonClick = () => {
    actions.resetBuc()
    actions.setMode('buclist')
  }

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
    return _.isEmpty(validation)
  }

  const setValidationState = (key, value) => {
    setValidation({
      ...validation,
      [key]: value
    })
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
    if (typeof options === 'string') {
      options = [options]
    }
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
    return options.map(el => {
      let key, value
      if (typeof el === 'string') {
        key = el
        value = el
      } else {
        key = el.key || el.navn
        value = el.value || el.navn
      }
      return <option value={key} key={key}>{getOptionLabel(value)}</option>
    })
  }

  const getOptionLabel = (value) => {
    let label = value
    const description = t('buc:buc-' + value.replace(':', '.'))
    if (description !== 'buc-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const getSpinner = (text) => {
    return <div className='a-buc-c-bucstart__spinner ml-2'>
      <NavFrontendSpinner type='S' />
      <div className='float-right ml-2'>{t(text)}</div>
    </div>
  }

  const tagObjectList = tagList ? tagList.map(tag => {
    return {
      value: tag,
      label: t('buc:tag-' + tag)
    }
  }) : []

  const allowedToForward = () => {
    return _buc && _subjectArea && hasNoValidationErrors() && !loading.creatingBUC && !loading.savingBucsInfo
  }

  if (!sakId || !aktoerId) {
    return null
  }

  return <div className='a-buc-c-bucstart'>
    {mode === 'page' ? <React.Fragment>
      <Systemtittel className='mb-4'>{t('buc:app-startCaseDescription')}</Systemtittel>
      <div className='mb-5'>
        <PsychoPanel closeButton>{t('help-startCase2')}</PsychoPanel>
      </div>
    </React.Fragment> : null}
    <Row className='mb-3'>
      <div className='col-md-6 pr-3'>
        <Select
          id='a-buc-c-bucstart__subjectarea-select-id'
          className='a-buc-c-bucstart__subjectarea-select flex-fill'
          aria-describedby='help-subjectArea'
          bredde='fullbredde'
          feil={validation.subjectAreaFail ? { feilmelding: validation.subjectAreaFail } : null}
          label={<div className='label'>
            <span>{t('buc:form-subjectArea')}</span>
            <HjelpetekstAuto id='a-buc-c-bucstart__subjectArea-help'>
              {t('buc:help-subjectArea')}
            </HjelpetekstAuto>
          </div>}
          value={_subjectArea || []}
          onChange={onSubjectAreaChange}>
          {renderOptions(subjectAreaList, 'subjectArea')}
        </Select>
        <Select
          id='a-buc-c-bucstart__buc-select-id'
          className='a-buc-c-bucstart__buc-select flex-fill'
          aria-describedby='help-buc'
          bredde='fullbredde'
          feil={validation.bucFail ? { feilmelding: validation.bucFail } : null}
          label={<div className='label'>
            <span>{t('buc:form-buc')}</span>
            <HjelpetekstAuto id='a-buc-c-bucstart__buc-help'>
              {t('buc:help-buc')}
            </HjelpetekstAuto>
          </div>}
          value={_buc || placeholders.buc}
          onChange={onBucChange}>
          {renderOptions(bucList, 'buc')}
        </Select>
      </div>
      <div className='col-md-6 pl-3'>
        <div className='flex-fill'>
          <Undertittel className='mb-2'>{t('buc:form-tagsForBUC')}</Undertittel>
          <div className='mb-3'>
            <Normaltekst className='mb-2'>{t('buc:form-tagsForBUC-description')}</Normaltekst>
            <MultipleSelect
              id='a-buc-c-bucstart__tags-select-id'
              className='a-buc-c-bucstart__tags-select flex-fill'
              placeholder={t('buc:form-tagPlaceholder')}
              aria-describedby='help-tags'
              locale={locale}
              values={_tags}
              hideSelectedOptions={false}
              onChange={onTagsChange}
              optionList={tagObjectList} />
          </div>
        </div>
        <div className='selectBoxMessage mt-2 mb-2'>{!loading ? null
          : loading.gettingSubjectAreaList ? getSpinner('buc:loading-subjectArea')
            : loading.gettingBucList ? getSpinner('buc:loading-buc') : null}
        </div>
      </div>
    </Row>
    <Row className='mb-3'>
      <div className='a-buc-c-bucstart__buttons col-md-12'>
        <Hovedknapp
          id='a-buc-c-bucstart__forward-button-id'
          className='a-buc-c-bucstart__forward-button'
          disabled={!allowedToForward()}
          spinner={loading.creatingBUC}
          onClick={onForwardButtonClick}>
          {loading.creatingBUC ? t('buc:loading-creatingCaseinRINA')
            : loading.savingBucsInfo ? t('buc:loading-savingBucInfo')
              : t('buc:form-createCaseinRINA')}
        </Hovedknapp>
        <Flatknapp
          id='a-buc-c-bucstart__cancel-button-id'
          className='a-buc-c-bucstart__cancel-button ml-2'
          onClick={onCancelButtonClick}>{t('ui:cancel')}</Flatknapp>
      </div>
    </Row>
  </div>
}

BUCStart.propTypes = {
  mode: PT.string,
  actions: PT.object,
  loading: PT.object,
  t: PT.func,
  subjectAreaList: PT.array,
  bucList: PT.array,
  bucParam: PT.string,
  locale: PT.string.isRequired,
  sakId: PT.string,
  aktoerId: PT.string
}

export default BUCStart
