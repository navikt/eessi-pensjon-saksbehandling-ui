import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import PsychoPanel from 'components/ui/Psycho/PsychoPanel'
import { Flatknapp, HjelpetekstAuto, Hovedknapp, Input, NavFrontendSpinner, Normaltekst, Row, Select, Systemtittel, Undertittel } from 'components/ui/Nav'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import * as bucActions from 'actions/buc'
import * as uiActions from 'actions/ui'
import * as appActions from 'actions/app'
import { getDisplayName } from 'utils/displayName'

export const mapStateToProps = (state) => {
  return {
    currentBUC: state.buc.currentBUC,
    bucsInfo: state.buc.bucsInfo,
    buc: state.buc.buc,
    subjectAreaList: state.buc.subjectAreaList,
    bucList: state.buc.bucList,
    tagList: state.buc.tagList,
    rinaId: state.buc.rinaId,

    loading: state.loading,
    sakId: state.app.params.sakId,
    aktoerId: state.app.params.aktoerId,
    bucParam: state.app.params.buc,
    locale: state.ui.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, bucActions, appActions, uiActions), dispatch) }
}

const placeholders = {
  subjectArea: 'buc:form-chooseSubjectArea',
  buc: 'buc:form-chooseBuc'
}

const BUCStart = (props) => {
  const { sakId, aktoerId, rinaId, buc, bucParam, bucsInfo } = props
  const { subjectAreaList, bucList, tagList } = props
  const { t, actions, currentBUC, locale, loading, mode } = props

  // these values may be collected through a form, but if they are in URL, then they will be set
  const [_sakId, setSakId] = useState(sakId)
  const [_aktoerId, setAktoerId] = useState(aktoerId)
  const [_buc, setBuc] = useState(bucParam)

  const [_subjectArea, setSubjectArea] = useState('Pensjon')
  const [_tags, setTags] = useState([])
  const [validation, setValidation] = useState({})

  const [isBucCreated, setIsBucCreated] = useState(false)
  const [hasBucInfoSaved, setHasBucInfoSaved] = useState(false)

  useEffect(() => {
    if (currentBUC && !sakId) {
      actions.setStatusParam('sakId', currentBUC.casenumber)
    }
  }, [currentBUC, sakId, actions])

  useEffect(() => {
    if (!loading.verifyingCaseNumber && _.isEmpty(currentBUC) && sakId && aktoerId) {
      actions.verifyCaseNumber({
        sakId: sakId,
        aktoerId: aktoerId
      })
    }
  }, [currentBUC, actions, loading, sakId, aktoerId])

  useEffect(() => {
    if (!loading.verifyingCaseNumber && !_.isEmpty(currentBUC)) {
      if (subjectAreaList === undefined && !loading.gettingSubjectAreaList) {
        actions.getSubjectAreaList()
      }
      if (bucList === undefined && !loading.gettingBucList) {
        actions.getBucList()
      }
      if (tagList === undefined && !loading.gettingTagList) {
        actions.getTagList()
      }
    }
  }, [currentBUC, actions, loading, bucList, subjectAreaList, tagList])

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
  }, [actions, loading, bucsInfo, aktoerId, buc, _buc, _tags, rinaId, isBucCreated])

  useEffect(() => {
    if (!hasBucInfoSaved && loading.savingBucsInfo) {
      setHasBucInfoSaved(true)
    }
    if (hasBucInfoSaved && !loading.savingBucsInfo && buc) {
      actions.setMode('sednew')
      setHasBucInfoSaved(false)
    }
  }, [actions, loading, buc, hasBucInfoSaved])

  const onSakIdChange = (e) => {
    resetValidationState('sakId')
    setSakId(e.target.value.trim())
  }

  const onAktoerIdChange = (e) => {
    resetValidationState('aktoerId')
    setAktoerId(e.target.value.trim())
  }

  const onVerifyCaseButtonClick = () => {
    if (!_sakId) {
      setValidationState('sakId', t('buc:validation-noSakId'))
    }
    if (!_aktoerId) {
      setValidationState('aktoerId', t('buc:validation-noAktoerId'))
    }
    if (hasNoValidationErrors()) {
      actions.verifyCaseNumber({
        sakId: _sakId,
        aktoerId: _aktoerId
      })
    }
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
    let description = t('buc:buc-' + value.replace(':', '.'))
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

  if (!currentBUC) {
    return <div className='a-buc-c-bucstart__form-for-sakid-and-aktoerid'>
      {mode === 'page' ? <div className='mb-5'>
        <PsychoPanel closeButton>{t('buc:help-startCase')}</PsychoPanel>
      </div> : null}
      <Row>
        <div className='col-md-6'>
          <Input aria-describedby='help-sakId'
            className='-buc-c-bucstart__sakid'
            id='a-buc-c-bucstart__sakid-input-id'
            label={t('buc:form-sakId')}
            value={_sakId || ''}
            bredde='fullbredde'
            onChange={onSakIdChange}
            feil={validation.sakId ? { feilmelding: t(validation.sakId) } : null} />
        </div>
      </Row>
      <Row>
        <div className='col-md-6'>
          <Input
            className='-buc-c-bucstart__aktoerid'
            id='a-buc-c-bucstart__aktoerid-input-id'
            label={t('buc:form-aktoerId')}
            value={_aktoerId || ''}
            bredde='fullbredde'
            onChange={onAktoerIdChange}
            feil={validation.aktoerId ? { feilmelding: t(validation.aktoerId) } : null} />
        </div>
      </Row>
      <Row className='mt-6'>
        <div className='col-md-12'>
          <Hovedknapp
            id='a-buc-c-bucstart__forward-button-id'
            className='a-buc-c-bucstart__forward-button'
            disabled={loading && loading.verifyingCaseNumber}
            spinner={loading && loading.verifyingCaseNumber}
            onClick={onVerifyCaseButtonClick}>
            {loading && loading.verifyingCaseNumber ? t('buc:loading-verifyingCaseNumber') : t('ui:search')}
          </Hovedknapp>
        </div>
      </Row>
    </div>
  }

  return <React.Fragment>
    {mode === 'page' ? <React.Fragment>
      <Systemtittel className='mb-4'>{t('buc:app-startCaseDescription')}</Systemtittel>
      <div className='mb-5'>
        <PsychoPanel closeButton>{t('help-startCase2')}</PsychoPanel>
      </div>
    </React.Fragment> : null}
    <Row className='mb-3'>
      <div className='col-md-6 pr-3'>
        <Select
          className='a-buc-c-bucstart__subjectarea-list flex-fill'
          id='a-buc-c-bucstart__subjectarea-select-id'
          aria-describedby='help-subjectArea'
          bredde='fullbredde'
          feil={validation.subjectAreaFail ? { feilmelding: validation.subjectAreaFail } : null}
          label={<div className='label'>
            <span>{t('buc:form-subjectArea')}</span>
            <HjelpetekstAuto id='help-subjectArea'>
              {t('buc:help-subjectArea')}
            </HjelpetekstAuto>
          </div>}
          value={_subjectArea || []}
          onChange={onSubjectAreaChange}>
          {renderOptions(subjectAreaList, 'subjectArea')}
        </Select>
        <Select
          className='a-buc-c-bucstart__buc flex-fill'
          id='a-buc-c-bucstart__buc-select-id'
          aria-describedby='help-buc'
          bredde='fullbredde'
          feil={validation.bucFail ? { feilmelding: validation.bucFail } : null}
          label={<div className='label'>
            <span>{t('buc:form-buc')}</span>
            <HjelpetekstAuto id='help-buc'>
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
              className='a-buc-c-bucstart__tags flex-fill'
              id='a-buc-c-bucstart__tags-select-id'
              placeholder={t('buc:form-tagPlaceholder')}
              aria-describedby='help-tags'
              locale={locale}
              value={_tags}
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
      <div className='col-md-12'>
        <Hovedknapp
          id='a-buc-BUCStart-forward-button'
          className='forwardButton'
          disabled={!allowedToForward()}
          spinner={loading.creatingBUC}
          onClick={onForwardButtonClick}>
          {loading.creatingBUC ? t('buc:loading-creatingCaseinRINA')
            : loading.savingBucsInfo ? t('buc:loading-savingBucInfo')
              : t('buc:form-createCaseinRINA')}
        </Hovedknapp>
        <Flatknapp
          id='a-buc-BUCStart-cancel'
          className='cancelButton ml-2'
          onClick={onCancelButtonClick}>{t('ui:cancel')}</Flatknapp>
      </div>
    </Row>
  </React.Fragment>
}

BUCStart.propTypes = {
  currentBUC: PT.object,
  mode: PT.string,
  actions: PT.object,
  loading: PT.object,
  t: PT.func,
  subjectAreaList: PT.array,
  bucList: PT.array,
  bucParam: PT.string,
  locale: PT.string.isRequired,
  sakId: PT.string,
  aktoerId: PT.string,
  rinaId: PT.string
}

const ConnectedBUCStart = connect(
  mapStateToProps,
  mapDispatchToProps
)(BUCStart)

ConnectedBUCStart.displayName = `Connect(${getDisplayName(BUCStart)})`

export default ConnectedBUCStart
