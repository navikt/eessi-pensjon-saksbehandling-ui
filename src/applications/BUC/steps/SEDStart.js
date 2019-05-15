import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'

import PsychoPanel from 'components/ui/Psycho/PsychoPanel'
import * as Nav from 'components/ui/Nav'
import Icons from 'components/ui/Icons'
import CountrySelect from 'components/ui/CountrySelect/CountrySelect'

import * as bucActions from 'actions/buc'
import * as uiActions from 'actions/ui'
import * as appActions from 'actions/app'

export const mapStateToProps = (state) => {
  return {
    subjectAreaList: state.buc.subjectAreaList,
    institutionList: state.buc.institutionList,
    bucList: state.buc.bucList,
    sedList: state.buc.sedList,
    countryList: state.buc.countryList,
    currentCase: state.buc.currentCase,
    previewData: state.buc.previewData,

    locale: state.ui.locale,
    loading: state.loading,

    sakId: state.status.sakId,
    rinaId: state.status.rinaId,
    aktoerId: state.status.aktoerId,
    vedtakId: state.status.vedtakId,
    sed: state.status.sed,
    buc: state.status.buc,
    mottak: state.status.mottak
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, bucActions, appActions, uiActions), dispatch) }
}

const defaultSelects = {
  subjectArea: 'buc:form-chooseSubjectArea',
  buc: 'buc:form-chooseBuc',
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry'
}

const SEDStart = (props) => {
  // these are only used for when we are collecting them through a form
  const [_sakId, setSakId] = useState(undefined)
  const [_aktoerId, setAktoerId] = useState(undefined)
  const [_rinaId, setRinaId] = useState(undefined)

  const [_subjectArea, setSubjectArea] = useState('Pensjon')
  const [_buc, setBuc] = useState(undefined)
  const [_sed, setSed] = useState(undefined)
  const [_vedtakId, setVedtakId] = useState(undefined)

  const [_country, setCountry] = useState(undefined)
  const [_institution, setInstitution] = useState(undefined)
  const [_institutions, setInstitutions] = useState(undefined)
  const [validation, setValidation] = useState({})

  const [mounted, setMounted] = useState(false)

  const { t, actions } = props
  const { subjectAreaList, institutionList, bucList, sedList, countryList } = props
  const { currentCase, previewData, locale, loading, mode } = props
  const { sakId, aktoerId, rinaId, vedtakId, sed, buc, mottak } = props

  // update current fields with previewData
  useEffect(() => {
    if (previewData) {
      if (previewData.subjectArea) { setSubjectArea(previewData.subjectArea) }
      if (previewData.buc) { setBuc(previewData.buc) }
      if (previewData.sed) { setSed(previewData.sed) }
      if (previewData.institutions) { setInstitutions(previewData.institutions) }
    }
  }, [previewData])

  useEffect(() => {
    if (!loading.gettingCase && _.isEmpty(currentCase) && sakId && aktoerId) {
      actions.getCaseFromCaseNumber({
        sakId: sakId,
        aktoerId: aktoerId,
        rinaId: rinaId
      })
      setMounted(true)
    }

    if (!loading.gettingCase && !_.isEmpty(currentCase)) {
      if (subjectAreaList === undefined && !sed && !loading.subjectAreaList) {
        actions.getSubjectAreaList()
      }
      if (bucList === undefined && !sed && !loading.bucList) {
        actions.getBucList(currentCase ? currentCase.rinaid : undefined)
      }
      if (_.isEmpty(countryList) && !loading.countryList) {
        actions.getCountryList()
      }
    }
  }, [currentCase, mounted])

  const onSakIdChange = (e) => {
    resetValidationState('sakId')
    setSakId(e.target.value.trim())
  }

  const onRinaIdChange = (e) => {
    setRinaId(e.target.value.trim())
  }

  const onAktoerIdChange = (e) => {
    resetValidationState('aktoerId')
    setAktoerId(e.target.value.trim())
  }

  const onVedtakIdChange = (e) => {
    setVedtakId(e.target.value.trim())
  }

  const onFetchCaseButtonClick = () => {
    if (!_sakId) {
      setValidationState('sakId', t('buc:validation-noSakId'))
    }
    if (!_aktoerId) {
      setValidationState('aktoerId', t('buc:validation-noAktoerId'))
    }
    if (hasNoValidationErrors()) {
      actions.getCaseFromCaseNumber({
        sakId: _sakId,
        aktoerId: _aktoerId,
        rinaId: _rinaId
      })
    }
  }

  const parseMottak = () => {
    if (!mottak || mottak.indexOf('/') < 0) {
      return undefined
    }
    let pieces = mottak.split('/')
    return { institution: pieces[1], country: pieces[0] }
  }

  const onForwardButtonClick = () => {
    validateSubjectArea(_subjectArea)
    validateBuc(_buc || buc)
    validateSed(_sed || sed)
    validateInstitutions(_institutions || parseMottak())
    if (hasNoValidationErrors()) {
      actions.dataPreview({
        sakId: currentCase.casenumber,
        aktoerId: currentCase.pinid,
        rinaId: currentCase.rinaid,
        subjectArea: _subjectArea,
        buc: _buc || buc,
        sed: _sed || sed,
        vedtakId: vedtakId || _vedtakId,
        institutions: _institutions
      })
    }
  }

  const validateSubjectArea = (subjectArea) => {
    if (!subjectArea || subjectArea === defaultSelects.subjectArea) {
      setValidationState('subjectAreaFail', t('buc:validation-chooseSubjectArea'))
    } else {
      resetValidationState('subjectAreaFail')
    }
  }

  const validateBuc = (buc) => {
    if (!buc || buc === defaultSelects.buc) {
      setValidationState('bucFail', t('buc:validation-chooseBuc'))
    } else {
      resetValidationState('bucFail')
    }
  }

  const validateSed = (sed) => {
    if (!sed || sed === defaultSelects.sed) {
      setValidationState('sedFail', t('buc:validation-chooseSed'))
    } else {
      resetValidationState('sedFail')
    }
  }

  const validateInstitutions = (institutions) => {
    if (!institutions || Object.keys(institutions).length === 0) {
      setValidationState('institutionsFail', t('buc:validation-chooseInstitutions'))
    } else {
      resetValidationState('institutionsFail')
    }
  }

  const validateInstitution = (institution) => {
    if (!institution || institution === defaultSelects.institution) {
      setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
    } else {
      resetValidationState('institutionFail')
    }
  }

  const validateCountry = (country) => {
    if (!country) {
      setValidationState('countryFail', t('buc:validation-chooseCountry'))
    } else {
      resetValidationState('countryFail')
    }
  }

  const onCreateInstitutionButtonClick = () => {
    let newInstitutions = _institutions || []
    newInstitutions.push({
      institution: _institution,
      country: _country
    })
    setInstitutions(newInstitutions)
    setInstitution(undefined)
    setCountry(undefined)
  }

  const onRemoveInstitutionButtonClick = (institution) => {
    const newInstitutions = _.reject(_institutions, {
      'institution': institution.institution,
      'country': institution.country
    })
    setInstitutions(newInstitutions)
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
    if (!validation.bucFail) {
      actions.getSedList(thisBuc, rinaId)
    }
  }

  const onSedChange = (e) => {
    const thisSed = e.target.value
    setSed(thisSed)
    validateSed(thisSed)
  }

  const onInstitutionChange = (e) => {
    const thisInstitution = e.target.value
    setInstitution(thisInstitution)
    validateInstitution(thisInstitution)
  }

  const onCountryChange = (e) => {
    const thisCountry = e.value
    setCountry(thisCountry)
    setInstitution(undefined)
    validateCountry(thisCountry)
    if (!validation.countryFail) {
      if (thisCountry !== defaultSelects.country) {
        if (_buc) {
          actions.getInstitutionListForBucAndCountry(_buc, thisCountry)
        } else {
          actions.getInstitutionListForCountry(thisCountry)
        }
      }
    }
  }

  const renderOptions = (options, type) => {
    if (typeof options === 'string') {
      options = [options]
    }
    if (!options || Object.keys(options).length === 0) {
      options = [{
        key: defaultSelects[type],
        value: t(defaultSelects[type])
      }]
    }

    if (!options[0].key || (options[0].key && options[0].key !== defaultSelects[type])) {
      options.unshift({
        key: defaultSelects[type],
        value: t(defaultSelects[type])
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
    let description = t('buc:case-' + value.replace(':', '.'))
    if (description !== 'case-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const renderSubjectArea = () => {
    return <Nav.Select
      id='c-startcase-subjectarea-select'
      className='subjectAreaList flex-fill'
      aria-describedby='help-subjectArea'
      bredde='fullbredde'
      feil={validation.subjectAreaFail ? { feilmelding: validation.subjectAreaFail } : null}
      label={t('buc:form-subjectArea')}
      value={_subjectArea}
      onChange={onSubjectAreaChange}>
      {renderOptions(subjectAreaList, 'subjectArea')}
    </Nav.Select>
  }

  const renderCountry = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:country')}</label>
      <CountrySelect
        id='c-startcase-country-select'
        className='countrySelect'
        aria-describedby='help-country'
        locale={locale}
        value={_country || {}}
        onSelect={onCountryChange}
        includeList={countryList} />
    </div>
  }

  const renderInstitution = () => {
    return <Nav.Select
      id='c-startcase-institution-select'
      className='institutionList flex-fill'
      aria-describedby='help-institution'
      bredde='fullbredde'
      feil={validation.institutionFail ? { feilmelding: validation.institutionFail } : null}
      label={t('buc:form-institution')}
      value={_institution || defaultSelects.institution}
      onChange={onInstitutionChange}>
      {renderOptions(institutionList, 'institution')}
    </Nav.Select>
  }

  const renderBuc = () => {
    return <Nav.Select
      id='c-startcase-buc-select'
      className='bucList flex-fill'
      aria-describedby='help-buc'
      bredde='fullbredde'
      feil={validation.bucFail ? { feilmelding: validation.bucFail } : null}
      label={t('buc:form-buc')}
      value={_buc || defaultSelects.buc}
      onChange={onBucChange}>
      {renderOptions(bucList, 'buc')}
    </Nav.Select>
  }

  const renderSed = () => {
    return <Nav.Select
      id='c-startcase-sed-select'
      className='sedList flex-fill'
      aria-describedby='help-sed'
      bredde='fullbredde'
      feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
      disabled={!bucList}
      label={t('buc:form-sed')}
      value={_sed || defaultSelects.buc}
      onChange={onSedChange}>
      {renderOptions(sedList, 'sed')}
    </Nav.Select>
  }

  const getSpinner = (text) => {
    return <div className='p-case-spinner ml-2'>
      <Nav.NavFrontendSpinner type='S' />
      <div className='float-right ml-2'>{t(text)}</div>
    </div>
  }

  const renderChosenInstitution = (institution) => {
    const renderedInstitution = (institution.country && institution.country !== defaultSelects.country ? institution.country + '/' : '') + institution.institution

    return <Nav.Row key={renderedInstitution} className='mb-3 renderedInstitutions'>
      <Nav.Column style={{ lineHeight: '2rem' }}>
        <div className='renderedInstitution'><b>{renderedInstitution}</b></div>
      </Nav.Column>
      <Nav.Column className='text-right'>
        <Nav.Knapp
          id={'c-startcase-removeinstitution-' + institution.country + '_' + institution.institution + '-button'}
          className='removeInstitutionButton'
          type='standard'
          onClick={() => onRemoveInstitutionButtonClick(institution)}>
          <div className='d-flex justify-content-center'>
            <Icons className='mr-2' size={20} kind='trashcan' color='#0067C5' />
            <span>{t('ui:remove')}</span>
          </div>
        </Nav.Knapp>
      </Nav.Column>
    </Nav.Row>
  }

  const renderInstitutions = () => {
    return !_institutions ? null : _institutions.map(i => {
      return renderChosenInstitution(i)
    })
  }

  const allowedToForward = () => {
    return sed ? buc && sed && hasNoValidationErrors() && !_.isEmpty(_institutions)
      : _buc && _sed && _subjectArea && hasNoValidationErrors() && !_.isEmpty(_institutions)
  }

  const validInstitution = (!validation.countryFail && !validation.institutionFail) && _country && _institution

  if (!currentCase) {
    return <React.Fragment>
      {mode === 'page' ? <div className='mb-5'>
        <PsychoPanel closeButton>{t('buc:help-startCase')}</PsychoPanel>
      </div> : null}
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input aria-describedby='help-sakId'
            className='getCaseInputSakId'
            label={t('buc:form-sakId')}
            value={_sakId || ''}
            bredde='XL'
            id='c-startcase-sakid-input'
            onChange={onSakIdChange}
            feil={validation.sakId ? { feilmelding: t(validation.sakId) } : null} />
          {/* <span id='help-sakId'>{t('buc:help-sakId')}</span> */}
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input
            className='getCaseInputAktoerId'
            label={t('buc:form-aktoerId')}
            value={_aktoerId || ''}
            bredde='XL'
            id='c-startcase-aktoerid-input'
            onChange={onAktoerIdChange}
            feil={validation.aktoerId ? { feilmelding: t(validation.aktoerId) } : null} />
          {/* <span id='help-aktoerId'>{t('buc:help-aktoerId')}</span> */}
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input className='getCaseInputRinaId'
            label={<div>
              <span>{t('buc:form-rinaId')}</span>
              <span className='optional'>{t('ui:optional')}</span>
            </div>}
            value={_rinaId || ''}
            bredde='XL'
            id='c-startcase-rinaid-input'
            onChange={onRinaIdChange}
          />
          {/* <span id='help-rinaId'>{t('buc:help-rinaId')}</span> */}
        </div>
      </Nav.Row>
      <Nav.Row className='mt-6'>
        <div className='col-md-12'>
          <Nav.Hovedknapp
            id='c-startcase-forward-button'
            className='forwardButton'
            disabled={loading && loading.gettingCase}
            spinner={loading && loading.gettingCase}
            onClick={onFetchCaseButtonClick}>
            {loading && loading.gettingCase ? t('buc:loading-gettingCase') : t('ui:search')}
          </Nav.Hovedknapp>
        </div>
      </Nav.Row>
    </React.Fragment>
  }

  return <React.Fragment>
    {sed ? <h2 className='mb-4 appDescription'>{t('buc:app-startCaseDescription') + ': ' + sed}</h2>
      : <React.Fragment>
        {mode === 'page' ? <React.Fragment>
          <h2 className='mb-4 appDescription'>{t('buc:app-startCaseDescription')}</h2>
          <div className='mb-5'>
            <PsychoPanel closeButton>{t('help-startCase2')}</PsychoPanel>
          </div>
        </React.Fragment> : null}
        <Nav.Row className='mb-3'>
          <div className='col-md-6'>
            <Nav.Row>
              <div className='col-md-12 d-flex'>{renderSubjectArea()}
                <Nav.HjelpetekstAuto id='help-subjectArea'>{t('buc:help-subjectArea')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-12 d-flex'>{renderBuc()}
                <Nav.HjelpetekstAuto id='help-buc'>{t('buc:help-buc')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-12 d-flex'>{renderSed()}
                <Nav.HjelpetekstAuto id='help-sed'>{t('buc:help-sed')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            { (sed && sed === 'P6000') || (_sed && _sed === 'P6000')
              ? <Nav.Row>
                <div className='col-md-12 d-flex'>
                  <Nav.Input aria-describedby='help-vedtak'
                    label={t('buc:form-vedtakId')}
                    value={_vedtakId || vedtakId}
                    id='c-startcase-vedtakid-input'
                    bredde='fullbredde'
                    onChange={onVedtakIdChange} />
                  <Nav.HjelpetekstAuto id='help-vedtak'>{t('buc:help-vedtakId')}</Nav.HjelpetekstAuto>
                </div>
              </Nav.Row> : null}
            <Nav.Row>
              <div className='col-md-12 d-flex'>{renderCountry()}
                <Nav.HjelpetekstAuto id='help-country'>{t('buc:help-country')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-12 d-flex'>{renderInstitution()}
                <Nav.HjelpetekstAuto id='help-institution'>{t('buc:help-institution')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-8'>
                <Nav.Knapp
                  id='c-startcase-createinstitution-button'
                  className='w-100 createInstitutionButton'
                  disabled={!validInstitution}
                  onClick={onCreateInstitutionButtonClick}>
                  <div className='d-flex justify-content-center'>
                    <Icons kind='tilsette' size={20} color={!validInstitution ? 'white' : undefined} className='mr-2' />
                    <span>{t('ui:add')}</span>
                  </div>
                </Nav.Knapp>
              </div>
            </Nav.Row>
          </div>
          <div className='col-md-6'>
            <div className='selectBoxMessage'>{!loading ? null
              : loading.subjectAreaList ? getSpinner('buc:loading-subjectArea')
                : loading.bucList ? getSpinner('buc:loading-buc')
                  : loading.sedList ? getSpinner('buc:loading-sed')
                    : loading.institutionList ? getSpinner('buc:loading-institution')
                      : loading.countryList ? getSpinner('buc:loading-country') : null}
            </div>
            {renderInstitutions()}
          </div>
        </Nav.Row>
      </React.Fragment>}

    <Nav.Row className='mb-4 mt-4'>
      <div className='col-md-12'>
        <Nav.Hovedknapp
          id='c-startcase-forward-button'
          className='forwardButton'
          disabled={!allowedToForward()}
          onClick={onForwardButtonClick}>{t('ui:go')}</Nav.Hovedknapp>
      </div>
    </Nav.Row>
  </React.Fragment>
}

SEDStart.propTypes = {
  currentCase: PT.object,
  actions: PT.object,
  loading: PT.object,
  t: PT.func,
  subjectAreaList: PT.array,
  institutionList: PT.array,
  countryList: PT.array,
  sedList: PT.array,
  bucList: PT.array,
  sed: PT.string,
  buc: PT.string,
  previewData: PT.object,
  locale: PT.string,
  vedtakId: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SEDStart)
