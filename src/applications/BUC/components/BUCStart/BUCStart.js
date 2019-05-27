import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'

import PsychoPanel from 'components/ui/Psycho/PsychoPanel'
import * as Nav from 'components/ui/Nav'
import countries from 'components/ui/CountrySelect/CountrySelectData'
import MultipleSelect from 'components/ui/MultipleSelect/MultipleSelect'
import FlagList from 'components/ui/Flag/FlagList'
import Icons from 'components/ui/Icons'

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
    currentBUC: state.buc.currentBUC,
    loading: state.loading,
    p6000data: state.p6000.data,
    sakId: state.app.params.sakId,
    rinaId: state.app.params.rinaId,
    aktoerId: state.app.params.aktoerId,
    vedtakId: state.app.params.vedtakId,
    sed: state.status.sed,
    buc: state.status.buc,
    locale: state.ui.locale
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, bucActions, appActions, uiActions), dispatch) }
}

const placeholders = {
  subjectArea: 'buc:form-chooseSubjectArea',
  buc: 'buc:form-chooseBuc',
  sed: 'buc:form-chooseSed',
  institution: 'buc:form-chooseInstitution',
  country: 'buc:form-chooseCountry'
}

const BUCStart = (props) => {
  // these are only used for when we are collecting them through a form
  const [_sakId, setSakId] = useState(undefined)
  const [_aktoerId, setAktoerId] = useState(undefined)
  const [_rinaId, setRinaId] = useState(undefined)

  const [_subjectArea, setSubjectArea] = useState('Pensjon')
  const [_buc, setBuc] = useState(undefined)
  const [_sed, setSed] = useState(undefined)
  const [_vedtakId, setVedtakId] = useState(undefined)

  const [_countries, setCountries] = useState([])
  const [_institutions, setInstitutions] = useState([])
  const [_tags, setTags] = useState([])
  const [validation, setValidation] = useState({})

  const [mounted, setMounted] = useState(false)

  const { sakId, aktoerId, rinaId, vedtakId, sed, buc } = props
  const { subjectAreaList, institutionList, bucList, sedList, countryList } = props
  const { t, actions, currentBUC, locale, loading, mode, p6000data } = props

  useEffect(() => {
    if (!loading.gettingBUC && _.isEmpty(currentBUC) && sakId && aktoerId) {
      actions.getCaseFromCaseNumber({
        sakId: sakId,
        aktoerId: aktoerId,
        rinaId: rinaId
      })
      setMounted(true)
    }

    if (!loading.gettingBUC && !_.isEmpty(currentBUC)) {
      if (subjectAreaList === undefined && !sed && !loading.subjectAreaList) {
        actions.getSubjectAreaList()
      }
      if (bucList === undefined && !sed && !loading.bucList) {
        actions.getBucList(currentBUC ? currentBUC.rinaid : undefined)
      }
      if (_.isEmpty(countryList) && !loading.countryList) {
        actions.getCountryList()
      }
    }
  }, [currentBUC, mounted, actions, loading, countryList, sakId, aktoerId, rinaId, bucList, sed, subjectAreaList])

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

  const onForwardButtonClick = () => {
    validateSubjectArea(_subjectArea)
    validateBuc(_buc || buc)
    validateSed(_sed || sed)
    validateInstitution(_institutions)
    if (hasNoValidationErrors()) {
      const data = {
        sakId: currentBUC.casenumber,
        aktoerId: currentBUC.pinid,
        rinaId: currentBUC.rinaid,
        subjectArea: _subjectArea,
        buc: _buc || buc,
        sed: _sed || sed,
        vedtakId: vedtakId || _vedtakId,
        institutions: _institutions,
        tags: _tags
      }
      if (data.sed === 'P6000') {
        data.P6000 = Object.assign({}, p6000data)
      }
      data.euxCaseId = data.rinaId
      if (!data.euxCaseId) {
        actions.createSed(data)
      } else {
        actions.addToSed(data)
      }
    }
  }

  const onCancelButtonClick = () => {
    actions.setMode('list')
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

  const validateSed = (sed) => {
    if (!sed || sed === placeholders.sed) {
      setValidationState('sedFail', t('buc:validation-chooseSed'))
    } else {
      resetValidationState('sedFail')
    }
  }

  const validateInstitution = (institutions) => {
    if (_.isEmpty(institutions)) {
      setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
    } else {
      resetValidationState('institutionFail')
    }
  }

  const validateCountry = (country) => {
    if (_.isEmpty(country)) {
      setValidationState('countryFail', t('buc:validation-chooseCountry'))
    } else {
      resetValidationState('countryFail')
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
    if (!validation.bucFail) {
      actions.getSedList(thisBuc, rinaId)
    }
  }

  const onSedChange = (e) => {
    const thisSed = e.target.value
    setSed(thisSed)
    validateSed(thisSed)
  }

  const onInstitutionChange = (institutions) => {
    setInstitutions(institutions)
    validateInstitution(institutions)
  }

  const onCountryChange = (countryList) => {
    validateCountry(countryList)
    if (!validation.countryFail) {
      let oldCountryList = _.cloneDeep(countryList)
      setCountries(countryList)
      let addedCountries = countryList.filter(country => !oldCountryList.includes(country))
      let removedCountries = oldCountryList.filter(country => !countryList.includes(country))

      addedCountries.forEach(country => {
        if (_buc) {
          actions.getInstitutionListForBucAndCountry(_buc, country.value)
        } else {
          actions.getInstitutionListForCountry(country.value)
        }
      })
      removedCountries.forEach(country => {
        actions.removeInstitutionForCountry(country.value)
      })
    }
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
    let description = t('buc:case-' + value.replace(':', '.'))
    if (description !== 'case-' + value) {
      label += ' - ' + description
    }
    return label
  }

  const renderSubjectArea = () => {
    return <Nav.Select
      className='a-buc-c-bucstart__subjectarea-list flex-fill'
      id='a-buc-c-bucstart__subjectarea-select-id'
      aria-describedby='help-subjectArea'
      bredde='fullbredde'
      feil={validation.subjectAreaFail ? { feilmelding: validation.subjectAreaFail } : null}
      label={t('buc:form-subjectArea')}
      value={_subjectArea || []}
      onChange={onSubjectAreaChange}>
      {renderOptions(subjectAreaList, 'subjectArea')}
    </Nav.Select>
  }

  const countryObjectList = countryList ? _.filter(countries[locale], it => {
    return countryList.indexOf(it.value) >= 0
  }) : []

  const renderCountry = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:country')}</label>
      <MultipleSelect
        className='a-buc-c-bucstart__country'
        id='a-buc-c-bucstart__country-select-id'
        placeholder={t(placeholders.country)}
        aria-describedby='help-country'
        locale={locale}
        value={_countries || []}
        hideSelectedOptions={false}
        onChange={onCountryChange}
        optionList={countryObjectList} />
    </div>
  }

  const institutionObjectList = institutionList ? Object.keys(institutionList).map(landkode => {
    let label = _.find(countries[locale], { value: landkode })
    return {
      label: label.label,
      options: institutionList[landkode].map(institution => {
        return {
          label: institution.navn,
          value: institution
        }
      })
    }
  }) : []

  const renderInstitution = () => {
    return <div className='mb-3 flex-fill'>
      <label className='skjemaelement__label'>{t('ui:institution')}</label>
      <MultipleSelect
        className='a-buc-c-bucstart__institution'
        id='a-buc-c-bucstart__institution-select-id'
        placeholder={t(placeholders.institution)}
        aria-describedby='help-institution'
        locale={locale}
        value={_institutions || []}
        onChange={onInstitutionChange}
        hideSelectedOptions={false}
        optionList={institutionObjectList} />
    </div>
  }

  const renderBuc = () => {
    return <Nav.Select
      className='a-buc-c-bucstart__buc flex-fill'
      id='a-buc-c-bucstart__buc-select-id'
      aria-describedby='help-buc'
      bredde='fullbredde'
      feil={validation.bucFail ? { feilmelding: validation.bucFail } : null}
      label={t('buc:form-buc')}
      value={_buc || placeholders.buc}
      onChange={onBucChange}>
      {renderOptions(bucList, 'buc')}
    </Nav.Select>
  }

  const renderSed = () => {
    return <Nav.Select
      className='a-buc-c-bucstart__sed flex-fill'
      id='a-buc-c-bucstart__sed-select-id'
      aria-describedby='help-sed'
      bredde='fullbredde'
      feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
      disabled={!bucList}
      label={t('buc:form-sed')}
      value={_sed || placeholders.sed}
      onChange={onSedChange}>
      {renderOptions(sedList, 'sed')}
    </Nav.Select>
  }

  const getSpinner = (text) => {
    return <div className='a-buc-c-bucstart__spinner ml-2'>
      <Nav.NavFrontendSpinner type='S' />
      <div className='float-right ml-2'>{t(text)}</div>
    </div>
  }

  const renderInstitutions = () => {
    let institutions = {}
    if (_institutions) {
      _institutions.forEach(institution => {
        if (!institutions.hasOwnProperty(institution.value.landkode)) {
          institutions[institution.value.landkode] = [institution.label]
        } else {
          institutions[institution.value.landkode].push(institution.label)
        }
      })
    }

    return <React.Fragment>
      <Nav.Ingress className='mb-2'>{t('buc:form-chosenInstitutions')}</Nav.Ingress>
      {!_.isEmpty(institutions) ? Object.keys(institutions).map(landkode => {
        return <div className='d-flex align-items-baseline'>
          <FlagList locale={locale} countries={[landkode]} overflowLimit={5} />
          <span>{landkode}: {institutions[landkode].join(', ')}</span>
        </div>
      }) : <Nav.Normaltekst>{t('buc:form-noInstitutionYet')}</Nav.Normaltekst>}
    </React.Fragment>
  }

  const renderTags = () => {
    return <React.Fragment>
      <div className='d-flex mb-2'>
        <Icons kind='tilsette' />
        <span className='ml-3 mb-1'>{t('buc:form-tagsForBUC')}</span>
      </div>
      <div className='mb-3 flex-fill'>
        <Nav.Normaltekst>{t('buc:form-tagsForBUC-description')}</Nav.Normaltekst>
        <MultipleSelect
          className='a-buc-c-bucstart__tags flex-fill'
          id='a-buc-c-bucstart__tags-select-id'
          placeholder={t('buc:form-tagPlaceholder')}
          creatable
          aria-describedby='help-tags'
          locale={locale}
          value={_tags || []}
          hideSelectedOptions={false}
          onChange={onTagsChange}
          optionList={[]} />
      </div>
    </React.Fragment>
  }

  const allowedToForward = () => {
    return sed ? buc && sed && hasNoValidationErrors() && !_.isEmpty(_institutions)
      : _buc && _sed && _subjectArea && hasNoValidationErrors() && !_.isEmpty(_institutions)
  }

  if (!currentBUC) {
    return <div className='a-buc-c-bucstart__form-for-sakid-and-aktoerid'>
      {mode === 'page' ? <div className='mb-5'>
        <PsychoPanel closeButton>{t('buc:help-startCase')}</PsychoPanel>
      </div> : null}
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input aria-describedby='help-sakId'
            className='-buc-c-bucstart__sakid'
            id='a-buc-c-bucstart__sakid-input-id'
            label={t('buc:form-sakId')}
            value={_sakId || ''}
            bredde='fullbredde'
            onChange={onSakIdChange}
            feil={validation.sakId ? { feilmelding: t(validation.sakId) } : null} />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input
            className='-buc-c-bucstart__aktoerid'
            id='a-buc-c-bucstart__aktoerid-input-id'
            label={t('buc:form-aktoerId')}
            value={_aktoerId || ''}
            bredde='fullbredde'
            onChange={onAktoerIdChange}
            feil={validation.aktoerId ? { feilmelding: t(validation.aktoerId) } : null} />
        </div>
      </Nav.Row>
      <Nav.Row>
        <div className='col-md-6'>
          <Nav.Input
            className='-buc-c-bucstart__rinaid'
            id='a-buc-c-bucstart__rinaid-input-id'
            label={<div>
              <span>{t('buc:form-rinaId')}</span>
              <span className='optional'>{t('ui:optional')}</span>
            </div>}
            value={_rinaId || ''}
            bredde='fullbredde'
            onChange={onRinaIdChange}
          />
        </div>
      </Nav.Row>
      <Nav.Row className='mt-6'>
        <div className='col-md-12'>
          <Nav.Hovedknapp
            id='a-buc-c-bucstart__forward-button-id'
            className='a-buc-c-bucstart__forward-button'
            disabled={loading && loading.gettingBUC}
            spinner={loading && loading.gettingBUC}
            onClick={onFetchCaseButtonClick}>
            {loading && loading.gettingBUC ? t('buc:loading-gettingBUC') : t('ui:search')}
          </Nav.Hovedknapp>
        </div>
      </Nav.Row>
    </div>
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
              <div className='col-md-12 d-flex align-items-center'>{renderSubjectArea()}
                <Nav.HjelpetekstAuto id='help-subjectArea'>{t('buc:help-subjectArea')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-12 d-flex align-items-center'>{renderBuc()}
                <Nav.HjelpetekstAuto id='help-buc'>{t('buc:help-buc')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-12 d-flex align-items-center'>{renderSed()}
                <Nav.HjelpetekstAuto id='help-sed'>{t('buc:help-sed')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            { (sed && sed === 'P6000') || (_sed && _sed === 'P6000')
              ? <Nav.Row>
                <div className='col-md-12 d-flex'>
                  <Nav.Input aria-describedby='help-vedtak'
                    label={t('buc:form-vedtakId')}
                    value={_vedtakId || vedtakId}
                    id='a-buc-BUCStart-vedtakid-input'
                    bredde='fullbredde'
                    onChange={onVedtakIdChange} />
                  <Nav.HjelpetekstAuto id='help-vedtak'>{t('buc:help-vedtakId')}</Nav.HjelpetekstAuto>
                </div>
              </Nav.Row> : null}
            <Nav.Row>
              <div className='col-md-12 d-flex align-items-center'>{renderCountry()}
                <Nav.HjelpetekstAuto id='help-country'>{t('buc:help-country')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
            <Nav.Row>
              <div className='col-md-12 d-flex align-items-center'>{renderInstitution()}
                <Nav.HjelpetekstAuto id='help-institution'>{t('buc:help-institution')}</Nav.HjelpetekstAuto>
              </div>
            </Nav.Row>
          </div>
          <div className='col-md-6'>
            <div style={{ minHeight: '10rem' }}>
              {renderInstitutions()}
            </div>
            <div className='mt-3'>
              {renderTags()}
            </div>
          </div>
        </Nav.Row>
      </React.Fragment>}

    <Nav.Row className='mb-4 mt-4'>
      <div className='col-md-12 selectBoxMessage'>{!loading ? null
        : loading.subjectAreaList ? getSpinner('buc:loading-subjectArea')
          : loading.bucList ? getSpinner('buc:loading-buc')
            : loading.sedList ? getSpinner('buc:loading-sed')
              : loading.institutionList ? getSpinner('buc:loading-institution')
                : loading.countryList ? getSpinner('buc:loading-country') : null}
      </div>
      <div className='col-md-12'>
        <Nav.Hovedknapp
          id='a-buc-BUCStart-forward-button'
          className='forwardButton'
          disabled={!allowedToForward()}
          onClick={onForwardButtonClick}>{t('buc:form-createCaseinRINA')}</Nav.Hovedknapp>
        <Nav.Flatknapp
          id='a-buc-BUCStart-cancel'
          className='cancelButton'
          onClick={onCancelButtonClick}>{t('ui:cancel')}</Nav.Flatknapp>
      </div>
    </Nav.Row>
  </React.Fragment>
}

BUCStart.propTypes = {
  currentBUC: PT.object,
  p6000data: PT.object,
  mode: PT.string,
  actions: PT.object,
  loading: PT.object,
  t: PT.func,
  subjectAreaList: PT.array,
  institutionList: PT.object,
  countryList: PT.array,
  sedList: PT.array,
  bucList: PT.array,
  sed: PT.string,
  buc: PT.string,
  locale: PT.string.isRequired,
  sakId: PT.string,
  aktoerId: PT.string,
  rinaId: PT.string,
  vedtakId: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BUCStart)
