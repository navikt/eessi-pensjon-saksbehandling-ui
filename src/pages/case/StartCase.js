import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import _ from 'lodash'
import { withNamespaces } from 'react-i18next'

import Case from './Case'
import * as Nav from '../../components/ui/Nav'
import CountrySelect from '../../components/ui/CountrySelect/CountrySelect'

import * as routes from '../../constants/routes'
import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'

const mapStateToProps = (state) => {
  return {
    subjectAreaList: state.case.subjectAreaList,
    institutionList: state.case.institutionList,
    bucList: state.case.bucList,
    sedList: state.case.sedList,
    countryList: state.case.countryList,
    currentCase: state.case.currentCase,
    dataToConfirm: state.case.dataToConfirm,
    locale: state.ui.locale,
    loading: state.loading,
    sakId: state.status.sakId,
    rinaId: state.status.rinaId,
    aktoerId: state.status.aktoerId,
    fnr: state.status.fnr,
    vedtakId: state.status.vedtakId,
    sed: state.status.sed,
    buc: state.status.buc
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, caseActions, appActions, uiActions), dispatch) }
}

const defaultSelects = {
  subjectArea: 'case:form-chooseSubjectArea',
  buc: 'case:form-chooseBuc',
  sed: 'case:form-chooseSed',
  institution: 'case:form-chooseInstitution',
  country: 'case:form-chooseCountry'
}

class StartCase extends Component {
    state = {
      // these are only for the query form
      sakId: undefined,
      aktoerId: undefined,
      rinaId: undefined,

      _subjectArea: 'Pensjon',
      _buc: undefined,
      _sed: undefined,
      _vedtakId: undefined,

      institutions: [],
      validation: {}
    };

    async componentDidMount () {
      const { actions, currentCase, dataToConfirm, sakId, aktoerId, fnr, rinaId } = this.props

      actions.addToBreadcrumbs([{
        url: routes.CASE,
        label: 'case:app-caseTitle'
      }, {
        url: routes.CASE_START,
        label: 'case:app-startCaseTitle'
      }])

      if (_.isEmpty(currentCase) && sakId && (aktoerId || fnr)) {
        actions.getCaseFromCaseNumber({
          sakId: sakId,
          aktoerId: aktoerId || fnr,
          rinaId: rinaId
        })
      }

      // come from a goBack() navigation
      if (dataToConfirm) {
        this.setState({
          institutions: dataToConfirm.institutions,
          _buc: dataToConfirm.buc,
          _sed: dataToConfirm.sed,
          _subjectArea: dataToConfirm.subjectArea,
          _vedtakId: dataToConfirm.vedtakId
        }, () => {
          actions.cleanDataToConfirm()
        })
      }
    }

    async componentDidUpdate () {
      const { history, loading, sed, currentCase, dataToConfirm, institutionList, bucList,
        subjectAreaList, countryList, actions, sakId, aktoerId, fnr, rinaId } = this.props

      if (dataToConfirm) {
        history.push(routes.CASE_CONFIRM)
        return
      }

      if (!loading.gettingCase && currentCase) {
        if (_.isEmpty(subjectAreaList) && !sed && !loading.subjectAreaList) {
          actions.getSubjectAreaList()
        }

        if (_.isEmpty(bucList) && !sed && !loading.bucList) {
          actions.getBucList(currentCase ? currentCase.rinaid : undefined)
        }

        if (_.isEmpty(institutionList) && !loading.institutionList) {
          actions.getInstitutionList()
        }

        if (_.isEmpty(countryList) && !loading.countryList) {
          actions.getCountryList()
        }
      }

      if (!loading.gettingCase && _.isEmpty(currentCase) && sakId && (aktoerId || fnr)) {
        actions.getCaseFromCaseNumber({
          sakId: sakId,
          aktoerId: aktoerId || fnr,
          rinaId: rinaId
        })
      }
    }

    onBackButtonClick () {
      const { history } = this.props

      history.goBack()
    }

    onSakIdChange (e) {
      this.setState({
        sakId: e.target.value.trim()
      })
    }

    onRinaIdChange (e) {
      this.setState({
        rinaId: e.target.value.trim()
      })
    }

    onAktoerIdChange (e) {
      this.setState({
        aktoerId: e.target.value.trim()
      })
    }

    onVedtakIdChange (e) {
      this.setState({
        _vedtakId: e.target.value.trim()
      })
    }

    onFetchCaseButtonClick () {
      const { actions } = this.props
      const { sakId, aktoerId, rinaId } = this.state

      actions.getCaseFromCaseNumber({
        sakId: sakId,
        aktoerId: aktoerId,
        rinaId: rinaId
      })
    }

    onForwardButtonClick () {
      const { actions, currentCase, buc, sed, vedtakId } = this.props
      const { institutions, _buc, _sed, _subjectArea, _vedtakId } = this.state

      if (_subjectArea) {
        this.validateSubjectArea(_subjectArea)
      }
      if (!buc) {
        this.validateBuc(_buc)
      }
      if (!sed) {
        this.validateSed(_sed)
      }
      this.validateInstitutions(institutions)

      if (this.noValidationErrors()) {
        actions.dataToConfirm({
          sakId: currentCase.casenumber,
          aktoerId: currentCase.pinid,
          rinaId: currentCase.rinaid,
          subjectArea: _subjectArea,
          buc: buc || _buc,
          sed: sed || _sed,
          vedtakId: vedtakId || _vedtakId,
          institutions: institutions
        })
      }
    }

    validateSubjectArea (subjectArea) {
      const { t } = this.props

      if (!subjectArea || subjectArea === defaultSelects.subjectArea) {
        this.setValidationState('subjectAreaFail', t('case:validation-chooseSubjectArea'))
      } else {
        this.resetValidationState('subjectAreaFail')
      }
    }

    validateBuc (buc) {
      const { t } = this.props
      if (!buc || buc === defaultSelects.buc) {
        this.setValidationState('bucFail', t('case:validation-chooseBuc'))
      } else {
        this.resetValidationState('bucFail')
      }
    }

    validateSed (sed) {
      const { t } = this.props

      if (!sed || sed === defaultSelects.sed) {
        this.setValidationState('sedFail', t('case:validation-chooseSed'))
      } else {
        this.resetValidationState('sedFail')
      }
    }

    validateInstitutions (institutions) {
      const { t } = this.props

      if (!institutions || Object.keys(institutions).length === 0) {
        this.setValidationState('institutionsFail', t('case:validation-chooseInstitutions'))
      } else {
        this.resetValidationState('institutionsFail')
      }
    }

    validateInstitution (institution) {
      const { t } = this.props

      if (!institution || institution === defaultSelects.institution) {
        this.setValidationState('institutionFail', t('case:validation-chooseInstitution'))
      } else {
        this.resetValidationState('institutionFail')
      }
    }

    validateCountry (country) {
      const { t } = this.props

      if (!country) {
        this.setValidationState('countryFail', t('case:validation-chooseCountry'))
      } else {
        this.resetValidationState('countryFail')
      }
    }

    onCreateInstitutionButtonClick () {
      const { institutions, institution, country } = this.state
      let _institutions = _.cloneDeep(institutions)

      _institutions.push({
        institution: institution,
        country: country
      })
      this.setState({
        institutions: _institutions,
        institution: undefined,
        country: undefined
      })
    }

    onRemoveInstitutionButtonClick (institution) {
      const { institutions } = this.state
      let _institutions = _.cloneDeep(institutions)
      let newInstitutions = _.filter(_institutions, i => {
        return institution.institution !== i.institution || institution.country !== i.country
      })
      this.setState({
        institutions: newInstitutions
      })
    }

    resetValidationState (key) {
      const { validation } = this.state
      let _validation = _.cloneDeep(validation)

      if (_validation.hasOwnProperty(key)) {
        delete _validation[key]
        this.setState({ validation: _validation })
      }
    }

    setValidationState (key, value) {
      this.setState({
        validation: Object.assign(this.state.validation, { [key]: value })
      })
    }

    onSubjectAreaChange (e) {
      let _subjectArea = e.target.value
      this.setState({
        _subjectArea: _subjectArea
      })
      this.validateSubjectArea(_subjectArea)
    }

    onBucChange (e) {
      const { actions, rinaId } = this.props
      const { validation } = this.state

      let _buc = e.target.value
      this.setState({
        _buc: _buc
      })
      this.validateBuc(_buc)
      if (!validation.bucFail) {
        actions.getSedList(_buc, rinaId)
      }
    }

    onSedChange (e) {
      let _sed = e.target.value
      this.setState({ _sed: _sed })
      this.validateSed(_sed)
    }

    onInstitutionChange (e) {
      let institution = e.target.value
      this.setState({ institution: institution })
      this.validateInstitution(institution)
    }

    onCountryChange (e) {
      const { actions } = this.props
      const { validation } = this.state

      let country = e.value
      this.setState({
        country: country,
        institution: undefined
      })
      this.validateCountry(country)
      if (!validation.countryFail) {
        if (country !== defaultSelects.country) {
          actions.getInstitutionListForCountry(country)
        } else {
          actions.getInstitutionList()
        }
      }
    }

    renderOptions (map, type) {
      const { t } = this.props

      if (typeof map === 'string') {
        map = [map]
      }

      if (!map || Object.keys(map).length === 0) {
        map = [{
          key: defaultSelects[type],
          value: t(defaultSelects[type])
        }]
      }

      if (!map[0].key || (map[0].key && map[0].key !== defaultSelects[type])) {
        map.unshift({
          key: defaultSelects[type],
          value: t(defaultSelects[type])
        })
      }
      return map.map(el => {
        if (typeof el === 'string') {
          return <option value={el} key={el}>{this.getOptionLabel(el)}</option>
        } else {
          return <option value={el.key} key={el.key}>{this.getOptionLabel(el.value)}</option>
        }
      })
    }

    getOptionLabel (value) {
      const { t } = this.props

      let label = value
      let description = t('case:case-' + value)
      if (description !== 'case-' + value) {
        label += ' - ' + description
      }
      return label
    }

    renderSubjectArea () {
      const { t, subjectAreaList } = this.props
      const { validation, _subjectArea } = this.state

      return <Nav.Select className='subjectAreaList' bredde='xxl'
        feil={validation.subjectAreaFail ? { feilmelding: validation.subjectAreaFail } : null}
        label={t('case:form-subjectArea')} value={_subjectArea}
        onChange={this.onSubjectAreaChange.bind(this)}>
        {this.renderOptions(subjectAreaList, 'subjectArea')}
      </Nav.Select>
    }

    renderCountry () {
      const { t, countryList, country, locale } = this.props

      return <div className='mb-3'>
        <label className='skjemaelement__label'>{t('ui:country')}</label>
        <CountrySelect className='countrySelect' locale={locale}
          value={country || {}}
          onSelect={this.onCountryChange.bind(this)}
          list={countryList} />
      </div>
    }

    renderInstitution () {
      const { t, institutionList } = this.props
      const { validation, institution } = this.state

      return <Nav.Select className='institutionList' bredde='xxl'
        feil={validation.institutionFail ? { feilmelding: validation.institutionFail } : null}
        label={t('case:form-institution')} value={institution} onChange={this.onInstitutionChange.bind(this)}>
        {this.renderOptions(institutionList, 'institution')}
      </Nav.Select>
    }

    renderBuc () {
      const { t, bucList } = this.props
      const { _buc, validation } = this.state

      return <Nav.Select className='bucList' bredde='fullbredde'
        feil={validation.bucFail ? { feilmelding: validation.bucFail } : null}
        label={t('case:form-buc')} value={_buc} onChange={this.onBucChange.bind(this)}>
        {this.renderOptions(bucList, 'buc')}
      </Nav.Select>
    }

    renderSed () {
      const { t, sedList, bucList } = this.props
      const { _sed, validation } = this.state

      return <Nav.Select className='sedList' bredde='fullbredde'
        feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
        disabled={!bucList} label={t('case:form-sed')} value={_sed} onChange={this.onSedChange.bind(this)}>
        {this.renderOptions(sedList, 'sed')}
      </Nav.Select>
    }

    getSpinner (text) {
      const { t } = this.props

      return <div className='ml-2'>
        <Nav.NavFrontendSpinner type='S' />
        <div className='float-right ml-2'>{t(text)}</div>
      </div>
    }

    renderChosenInstitution (institution) {
      const { t } = this.props

      let renderedInstitution = (institution.country && institution.country !== defaultSelects.country ? institution.country + '/' : '') + institution.institution

      return <Nav.Row key={renderedInstitution} className='mb-3 renderedInstitutions'>
        <Nav.Column style={{ lineHeight: '2rem' }}>
          <div className='renderedInstitution'><b>{renderedInstitution}</b></div>
        </Nav.Column>
        <Nav.Column className='text-right'>
          <Nav.Knapp type='standard'
            onClick={this.onRemoveInstitutionButtonClick.bind(this, institution)}>
            <Nav.Ikon className='mr-2' size={20} kind='trashcan' />
            {t('ui:remove')}
          </Nav.Knapp>
        </Nav.Column>
      </Nav.Row>
    }

    renderInstitutions () {
      const { t, loading } = this.props
      const { institutions, institution, validation, country } = this.state

      let renderedInstitutions = []

      for (var i in institutions) {
        let institution = institutions[i]
        renderedInstitutions.push(this.renderChosenInstitution(institution))
      }

      let validInstitution = (!validation.countryFail && !validation.institutionFail) && country && institution

      renderedInstitutions.push(<Nav.Row key={'newInstitution'}>
        <div className='col-md-4'>
          <div>{this.renderCountry()}</div>
          <div className='mb-3 selectBoxMessage'>
            <div>{loading && loading.countryList ? this.getSpinner('case:loading-country') : null}</div>
            <Nav.HjelpetekstBase id='country'>{t('case:help-country')}</Nav.HjelpetekstBase>
          </div>
        </div>
        <div className='col-md-4'>
          <div>{this.renderInstitution()}</div>
          <div className='mb-3 selectBoxMessage'>
            <div>{loading && loading.institutionList ? this.getSpinner('case:loading-institution') : null}</div>
            <Nav.HjelpetekstBase id='institution'>{t('case:help-institution')}</Nav.HjelpetekstBase>
          </div>
        </div>
        <div className='col-md-4' style={{ lineHeight: '6rem' }}>
          <Nav.Knapp className='w-100 createInstitutionButton'
            disabled={!validInstitution}
            onClick={this.onCreateInstitutionButtonClick.bind(this)}>
            {validInstitution ? <Nav.Ikon size={20} className='mr-2' kind='tilsette' /> : null}
            {t('ui:add')}
          </Nav.Knapp>
        </div>
      </Nav.Row>)

      return <div className='mt-4'>{renderedInstitutions.map(i => { return i })}</div>
    }

    noValidationErrors () {
      const { sed, buc } = this.props
      const { institutions, validation, _subjectArea, _buc, _sed } = this.state

      return sed ? Object.keys(validation).length === 0 &&
        Object.keys(institutions).length !== 0 &&
        buc && sed
        : Object.keys(validation).length === 0 &&
        Object.keys(institutions).length !== 0 &&
        _subjectArea && _buc && _sed
    }

    render () {
      const { t, history, location, currentCase, loading, sed, vedtakId } = this.props
      const { sakId, aktoerId, rinaId, _sed, _vedtakId } = this.state

      return <Case className='startCase'
        title={t('case:app-caseTitle') + ' - ' + t('case:app-startCaseTitle')}
        description={t('case:app-startCaseDescription')}
        stepIndicator={currentCase !== undefined ? 0 : undefined}
        history={history}
        location={location}>
        { !currentCase
          ? loading && loading.gettingCase
            ? <div className='w-100 text-center'>
              <Nav.NavFrontendSpinner />
              <p>{t('case:loading-gettingCase')}</p>
            </div>
            : <React.Fragment>
              <div className='fieldset animate'>
                <Nav.Row>
                  <div className='col-md-6'>
                    <Nav.HjelpetekstBase tabIndex='2' id='sakId'>{t('case:help-sakId')}</Nav.HjelpetekstBase>
                    <Nav.Input tabIndex='1' className='getCaseInputSakId' label={t('case:form-sakId') + ' *'} value={sakId || ''} onChange={this.onSakIdChange.bind(this)} />
                  </div>
                  <div className='col-md-6'>
                    <Nav.HjelpetekstBase tabIndex='2' id='aktoerId'>{t('case:help-aktoerId')}</Nav.HjelpetekstBase>
                    <Nav.Input tabIndex='1' className='getCaseInputAktoerId' label={t('case:form-aktoerId') + ' *'} value={aktoerId || ''} onChange={this.onAktoerIdChange.bind(this)} />
                  </div>
                  <div className='col-md-6'>
                    <Nav.HjelpetekstBase tabIndex='2' id='rinaId'>{t('case:help-rinaId')}</Nav.HjelpetekstBase>
                    <Nav.Input tabIndex='1' className='getCaseInputRinaId' label={t('case:form-rinaId')} value={rinaId || ''} onChange={this.onRinaIdChange.bind(this)} />
                  </div>
                </Nav.Row>
              </div>
              <Nav.Row className='p-4'>
                <div className='col-md-6 mb-2' />
                <div className='col-md-6 mb-2'>
                  <Nav.Hovedknapp className='forwardButton w-100'
                    onClick={this.onFetchCaseButtonClick.bind(this)}>{t('ui:search')}</Nav.Hovedknapp>
                </div>
              </Nav.Row>
            </React.Fragment>
          : <React.Fragment>
            <div className='fieldset animate'>
              { !sed ? <React.Fragment>
                <Nav.Row className='mb-3 align-middle text-left'>
                  <div className='col-md-8'>{this.renderSubjectArea()}</div>
                  <div className='col-md-4 selectBoxMessage'>
                    <div className='d-inline-block'>{loading && loading.subjectAreaList ? this.getSpinner('case:loading-subjectArea') : null}</div>
                    <Nav.HjelpetekstBase id='subjectArea'>{t('case:help-subjectArea')}</Nav.HjelpetekstBase>
                  </div>
                </Nav.Row>
                <Nav.Row className='mb-3 align-middle text-left'>
                  <div className='col-md-8'>{this.renderBuc()}</div>
                  <div className='col-md-4 selectBoxMessage'>
                    <div className='d-inline-block'>{loading && loading.bucList ? this.getSpinner('case:loading-buc') : null}</div>
                    <Nav.HjelpetekstBase id='buc'>{t('case:help-buc')}</Nav.HjelpetekstBase>
                  </div>
                </Nav.Row>
                <Nav.Row className='mb-3 align-middle text-left'>
                  <div className='col-md-8'>{this.renderSed()}</div>
                  <div className='col-md-4 selectBoxMessage'>
                    <div className='d-inline-block'>{loading && loading.sedList ? this.getSpinner('case:loading-sed') : null}</div>
                    <Nav.HjelpetekstBase id='sed'>{t('case:help-sed')}</Nav.HjelpetekstBase>
                  </div>
                </Nav.Row>
              </React.Fragment> : <Nav.Row className='mb-3 align-middle text-left'>
                <div className='col-md-12'>
                  <h4>{t('sed')}{': '}{sed}</h4>
                </div>
              </Nav.Row>}
              { (sed && sed === 'P6000') || (_sed && _sed === 'P6000') ?
              <Nav.Row className='align-middle text-left'>
                <div className='col-md-8'>
                  <Nav.Input label={t('case:form-vedtakId')} value={_vedtakId || vedtakId} onChange={this.onVedtakIdChange.bind(this)}/>
                </div>
                <div className='col-md-4 selectBoxMessage'>
                  <div/>
                  <Nav.HjelpetekstBase id='vedtak'>{t('case:help-vedtakId')}</Nav.HjelpetekstBase>
                </div>
              </Nav.Row> : null}
              {this.renderInstitutions()}
            </div>

            <Nav.Row className='mb-4 p-4'>
              <div className='col-md-6 mb-2' />
              <div className='col-md-6 mb-2'>
                <Nav.Hovedknapp className='forwardButton w-100'
                  disabled={!this.noValidationErrors()}
                  onClick={this.onForwardButtonClick.bind(this)}>{t('ui:go')}</Nav.Hovedknapp>
              </div>
            </Nav.Row>
          </React.Fragment>
        }
      </Case>
    }
}

StartCase.propTypes = {
  currentCase: PT.object,
  actions: PT.object,
  history: PT.object,
  location: PT.object,
  loading: PT.object,
  t: PT.func,
  subjectAreaList: PT.array,
  institutionList: PT.array,
  countryList: PT.array,
  sedList: PT.array,
  bucList: PT.array,
  sed: PT.string,
  buc: PT.string,
  dataToConfirm: PT.object,
  locale: PT.string,
  vedtakId: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(StartCase)
)
