import React, { Component } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'
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

export class StartCase extends Component {
    state = {
      // these are only used for when we are collecting them through a form
      _sakId: undefined,
      _aktoerId: undefined,
      _rinaId: undefined,

      _subjectArea: 'Pensjon',
      _buc: undefined,
      _sed: undefined,
      _vedtakId: undefined,

      _country: undefined,
      _institution: undefined,
      _institutions: undefined,
      validation: {}
    }

    static getDerivedStateFromProps (newProps, oldState) {
      // make sure select options are always fresh, if someone decides to go back in steps
      return {
        _subjectArea: oldState._subjectArea || (newProps.previewData ? newProps.previewData.subjectArea : undefined),
        _buc: oldState._buc || (newProps.previewData ? newProps.previewData.buc : undefined),
        _sed: oldState._sed || (newProps.previewData ? newProps.previewData.sed : undefined),
        _institutions: oldState._institutions || (newProps.previewData ? newProps.previewData.institutions : [])
      }
    }

    componentDidMount () {
      const { actions, currentCase, sakId, aktoerId, rinaId } = this.props

      if (_.isEmpty(currentCase) && sakId && aktoerId) {
        actions.getCaseFromCaseNumber({
          sakId: sakId,
          aktoerId: aktoerId,
          rinaId: rinaId
        })
      }
    }

    componentDidUpdate () {
      const { loading, sed, currentCase, bucList, subjectAreaList, countryList,
        actions, sakId, aktoerId, rinaId } = this.props

      if (!loading.gettingCase && currentCase) {
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

      if (!loading.gettingCase && _.isEmpty(currentCase) && sakId && aktoerId) {
        actions.getCaseFromCaseNumber({
          sakId: sakId,
          aktoerId: aktoerId,
          rinaId: rinaId
        })
      }
    }

    onSakIdChange (e) {
      this.resetValidationState('sakId')
      this.setState({
        _sakId: e.target.value.trim()
      })
    }

    onRinaIdChange (e) {
      this.setState({
        _rinaId: e.target.value.trim()
      })
    }

    onAktoerIdChange (e) {
      this.resetValidationState('aktoerId')
      this.setState({
        _aktoerId: e.target.value.trim()
      })
    }

    onVedtakIdChange (e) {
      this.setState({
        _vedtakId: e.target.value.trim()
      })
    }

    onFetchCaseButtonClick () {
      const { t, actions } = this.props
      const { _sakId, _aktoerId, _rinaId } = this.state

      if (!_sakId) {
        this.setValidationState('sakId', t('buc:validation-noSakId'))
      }
      if (!_aktoerId) {
        this.setValidationState('aktoerId', t('buc:validation-noAktoerId'))
      }
      if (this.hasNoValidationErrors()) {
        actions.getCaseFromCaseNumber({
          sakId: _sakId,
          aktoerId: _aktoerId,
          rinaId: _rinaId
        })
      }
    }

    parseMottak (mottak) {
      if (!mottak || mottak.indexOf('/') < 0) {
        return undefined
      }
      let pieces = mottak.split('/')
      return { institution: pieces[1], country: pieces[0] }
    }

    onForwardButtonClick () {
      const { actions, currentCase, buc, sed, mottak, vedtakId } = this.props
      const { _institutions, _buc, _sed, _subjectArea, _vedtakId } = this.state

      if (_subjectArea) {
        this.validateSubjectArea(_subjectArea)
      }
      this.validateBuc(_buc || buc)
      this.validateSed(_sed || sed)
      this.validateInstitutions(_institutions || this.parseMottak(mottak))
      if (this.hasNoValidationErrors()) {
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

    validateSubjectArea (subjectArea) {
      const { t } = this.props

      if (!subjectArea || subjectArea === defaultSelects.subjectArea) {
        this.setValidationState('subjectAreaFail', t('buc:validation-chooseSubjectArea'))
      } else {
        this.resetValidationState('subjectAreaFail')
      }
    }

    validateBuc (buc) {
      const { t } = this.props
      if (!buc || buc === defaultSelects.buc) {
        this.setValidationState('bucFail', t('buc:validation-chooseBuc'))
      } else {
        this.resetValidationState('bucFail')
      }
    }

    validateSed (sed) {
      const { t } = this.props

      if (!sed || sed === defaultSelects.sed) {
        this.setValidationState('sedFail', t('buc:validation-chooseSed'))
      } else {
        this.resetValidationState('sedFail')
      }
    }

    validateInstitutions (institutions) {
      const { t } = this.props

      if (!institutions || Object.keys(institutions).length === 0) {
        this.setValidationState('institutionsFail', t('buc:validation-chooseInstitutions'))
      } else {
        this.resetValidationState('institutionsFail')
      }
    }

    validateInstitution (institution) {
      const { t } = this.props

      if (!institution || institution === defaultSelects.institution) {
        this.setValidationState('institutionFail', t('buc:validation-chooseInstitution'))
      } else {
        this.resetValidationState('institutionFail')
      }
    }

    validateCountry (country) {
      const { t } = this.props

      if (!country) {
        this.setValidationState('countryFail', t('buc:validation-chooseCountry'))
      } else {
        this.resetValidationState('countryFail')
      }
    }

    onCreateInstitutionButtonClick () {
      const { _institutions, _institution, _country } = this.state

      let institutions = (!_institutions ? [] : _.cloneDeep(_institutions))

      institutions.push({
        institution: _institution,
        country: _country
      })
      this.setState({
        _institutions: institutions,
        _institution: undefined,
        _country: undefined
      })
    }

    onRemoveInstitutionButtonClick (institution) {
      const { _institutions } = this.state
      let institutions = _.cloneDeep(_institutions)
      let newInstitutions = _.filter(institutions, i => {
        return institution.institution !== i.institution || institution.country !== i.country
      })
      this.setState({
        _institutions: newInstitutions
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

    hasNoValidationErrors () {
      return _.isEmpty(this.state.validation)
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
      this.setState({ _institution: institution })
      this.validateInstitution(institution)
    }

    onCountryChange (e) {
      const { actions } = this.props
      const { validation, _buc } = this.state

      let country = e.value
      this.setState({
        _country: country,
        _institution: undefined
      })
      this.validateCountry(country)
      if (!validation.countryFail) {
        if (country !== defaultSelects.country) {
          if (_buc) {
            actions.getInstitutionListForBucAndCountry(_buc, country)
          } else {
            actions.getInstitutionListForCountry(country)
          }
        }
      }
    }

    renderOptions (options, type) {
      const { t } = this.props

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
        return <option value={key} key={key}>{this.getOptionLabel(value)}</option>
      })
    }

    getOptionLabel (value) {
      const { t } = this.props

      let label = value
      let description = t('buc:case-' + value.replace(':', '.'))
      if (description !== 'case-' + value) {
        label += ' - ' + description
      }
      return label
    }

    renderSubjectArea () {
      const { t, subjectAreaList } = this.props
      const { validation, _subjectArea } = this.state

      return <Nav.Select
        id='c-startcase-subjectarea-select'
        className='subjectAreaList'
        aria-describedby='help-subjectArea'
        bredde='xxl'
        feil={validation.subjectAreaFail ? { feilmelding: validation.subjectAreaFail } : null}
        label={t('buc:form-subjectArea')}
        value={_subjectArea}
        onChange={this.onSubjectAreaChange.bind(this)}>
        {this.renderOptions(subjectAreaList, 'subjectArea')}
      </Nav.Select>
    }

    renderCountry () {
      const { t, countryList, locale } = this.props
      const { _country } = this.state

      return <div className='mb-3'>
        <label className='skjemaelement__label'>{t('ui:country')}</label>
        <CountrySelect
          id='c-startcase-country-select'
          className='countrySelect'
          aria-describedby='help-country'
          locale={locale}
          value={_country || {}}
          onSelect={this.onCountryChange.bind(this)}
          includeList={countryList} />
      </div>
    }

    renderInstitution () {
      const { t, institutionList } = this.props
      const { validation, _institution } = this.state

      return <Nav.Select
        id='c-startcase-institution-select'
        className='institutionList'
        aria-describedby='help-institution'
        bredde='xxl'
        feil={validation.institutionFail ? { feilmelding: validation.institutionFail } : null}
        label={t('buc:form-institution')}
        value={_institution || defaultSelects.institution}
        onChange={this.onInstitutionChange.bind(this)}>
        {this.renderOptions(institutionList, 'institution')}
      </Nav.Select>
    }

    renderBuc () {
      const { t, bucList } = this.props
      const { _buc, validation } = this.state

      return <Nav.Select
        id='c-startcase-buc-select'
        className='bucList'
        aria-describedby='help-buc'
        bredde='fullbredde'
        feil={validation.bucFail ? { feilmelding: validation.bucFail } : null}
        label={t('buc:form-buc')}
        value={_buc || defaultSelects.buc}
        onChange={this.onBucChange.bind(this)}>
        {this.renderOptions(bucList, 'buc')}
      </Nav.Select>
    }

    renderSed () {
      const { t, sedList, bucList } = this.props
      const { _sed, validation } = this.state

      return <Nav.Select
        id='c-startcase-sed-select'
        className='sedList'
        aria-describedby='help-sed'
        bredde='fullbredde'
        feil={validation.sedFail ? { feilmelding: validation.sedFail } : null}
        disabled={!bucList}
        label={t('buc:form-sed')}
        value={_sed || defaultSelects.buc}
        onChange={this.onSedChange.bind(this)}>
        {this.renderOptions(sedList, 'sed')}
      </Nav.Select>
    }

    getSpinner (text) {
      const { t } = this.props

      return <div className='p-case-spinner ml-2'>
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
          <Nav.Knapp
            id={'c-startcase-removeinstitution-' + institution.country + '_' + institution.institution + '-button'}
            className='removeInstitutionButton'
            type='standard'
            onClick={this.onRemoveInstitutionButtonClick.bind(this, institution)}>
            <div className='d-flex justify-content-center'>
              <Icons className='mr-2' size={20} kind='trashcan' color='#0067C5' />
              <span>{t('ui:remove')}</span>
            </div>
          </Nav.Knapp>
        </Nav.Column>
      </Nav.Row>
    }

    renderInstitutions () {
      const { t, loading } = this.props
      const { _institutions, _institution, validation, _country } = this.state

      let renderedInstitutions = []

      for (var i in _institutions) {
        renderedInstitutions.push(this.renderChosenInstitution(_institutions[i]))
      }

      let validInstitution = (!validation.countryFail && !validation.institutionFail) && _country && _institution

      renderedInstitutions.push(<Nav.Row key={'newInstitution'}>
        <div className='col-md-4'>
          <div>{this.renderCountry()}
            <span id='help-country'>{t('buc:help-country')}</span>
          </div>
          <div className='mb-3 selectBoxMessage'>
            <div>{loading && loading.countryList ? this.getSpinner('buc:loading-country') : null}</div>
          </div>
        </div>
        <div className='col-md-4'>
          <div>{this.renderInstitution()}
            <span id='help-institution'>{t('buc:help-institution')}</span>
          </div>
          <div className='mb-3 selectBoxMessage'>
            <div>{loading && loading.institutionList ? this.getSpinner('buc:loading-institution') : null}</div>
          </div>
        </div>
        <div className='col-md-4' style={{ lineHeight: '6rem' }}>
          <Nav.Knapp
            id='c-startcase-createinstitution-button'
            className='w-100 createInstitutionButton'
            disabled={!validInstitution}
            onClick={this.onCreateInstitutionButtonClick.bind(this)}>
            <div className='d-flex justify-content-center'>
              <Icons kind='tilsette' size={20} color={!validInstitution ? 'white' : undefined} className='mr-2' />
              <span>{t('ui:add')}</span>
            </div>
          </Nav.Knapp>
        </div>
      </Nav.Row>)

      return <div className='mt-4'>{renderedInstitutions.map(i => { return i })}</div>
    }

    allowedToForward () {
      const { sed, buc } = this.props
      const { _institutions, _subjectArea, _buc, _sed } = this.state

      return sed ? buc && sed && this.hasNoValidationErrors() && !_.isEmpty(_institutions)
        : _buc && _sed && _subjectArea && this.hasNoValidationErrors() && !_.isEmpty(_institutions)
    }

    render () {
      const { t, currentCase, loading, sed, vedtakId } = this.props
      const { _sakId, _aktoerId, _rinaId, _sed, _vedtakId, validation } = this.state

      if (!currentCase) {
        return <React.Fragment>

            <div className='mb-5'>
              <PsychoPanel closeButton>{t('buc:help-startCase')}</PsychoPanel>
            </div>
            <Nav.Row>
              <div className='mt-4 col-md-6'>
                <Nav.Input aria-describedby='help-sakId'
                  className='getCaseInputSakId'
                  label={t('buc:form-sakId')}
                  value={_sakId || ''}
                  id='c-startcase-sakid-input'
                  onChange={this.onSakIdChange.bind(this)}
                  feil={validation.sakId ? { feilmelding: t(validation.sakId) } : null} />
                <span id='help-sakId'>{t('buc:help-sakId')}</span>
              </div>
              <div className='mt-4 col-md-6'>
                <Nav.Input
                  className='getCaseInputAktoerId'
                  label={t('buc:form-aktoerId')}
                  value={_aktoerId || ''}
                  id='c-startcase-aktoerid-input'
                  onChange={this.onAktoerIdChange.bind(this)}
                  feil={validation.aktoerId ? { feilmelding: t(validation.aktoerId) } : null} />
                <span id='help-aktoerId'>{t('buc:help-aktoerId')}</span>
              </div>
              <div className='mt-4 col-md-6'>
                <Nav.Input className='getCaseInputRinaId'
                  label={<div>
                    <span>{t('buc:form-rinaId')}</span>
                    <span className='optional'>{t('ui:optional')}</span>
                  </div>}
                  value={_rinaId || ''}
                  id='c-startcase-rinaid-input'
                  onChange={this.onRinaIdChange.bind(this)}
                />
                <span id='help-rinaId'>{t('buc:help-rinaId')}</span>
              </div>
            </Nav.Row>

          <Nav.Row className='mt-4'>
            <div className='col-md-12'>
              <Nav.Hovedknapp
                id='c-startcase-forward-button'
                className='forwardButton'
                disabled={loading && loading.gettingCase}
                spinner={loading && loading.gettingCase}
                onClick={this.onFetchCaseButtonClick.bind(this)}>
                {loading && loading.gettingCase ? t('buc:loading-gettingCase') : t('ui:search')}
              </Nav.Hovedknapp>
            </div>
          </Nav.Row>
        </React.Fragment>
      }

      return <React.Fragment>

          {sed ? <h2 className='mb-4 appDescription'>{t('buc:app-startCaseDescription') + ': ' + sed}</h2>
            : <React.Fragment>
              <h2 className='mb-4 appDescription'>{t('buc:app-startCaseDescription')}</h2>
              <div className='mb-5'>
                <PsychoPanel closeButton>{t('help-startCase2')}</PsychoPanel>
              </div>
              <Nav.Row className='mb-3 align-middle text-left'>
                <div className='col-md-8'>{this.renderSubjectArea()}
                  <span id='help-subjectArea'>{t('buc:help-subjectArea')}</span>
                </div>
                <div className='col-md-4 selectBoxMessage'>
                  <div className='d-inline-block'>{loading && loading.subjectAreaList ? this.getSpinner('buc:loading-subjectArea') : null}</div>
                </div>
              </Nav.Row>
              <Nav.Row className='mb-3 align-middle text-left'>
                <div className='col-md-8'>{this.renderBuc()}
                  <span id='help-buc'>{t('buc:help-buc')}</span>
                </div>
                <div className='col-md-4 selectBoxMessage'>
                  <div className='d-inline-block'>{loading && loading.bucList ? this.getSpinner('buc:loading-buc') : null}</div>
                </div>
              </Nav.Row>
              <Nav.Row className='mb-3 align-middle text-left'>
                <div className='col-md-8'>{this.renderSed()}
                  <span id='help-sed'>{t('buc:help-sed')}</span>
                </div>
                <div className='col-md-4 selectBoxMessage'>
                  <div className='d-inline-block'>{loading && loading.sedList ? this.getSpinner('buc:loading-sed') : null}</div>
                </div>
              </Nav.Row>
            </React.Fragment>}
          { (sed && sed === 'P6000') || (_sed && _sed === 'P6000')
            ? <Nav.Row className='align-middle text-left'>
              <div className='col-md-8'>
                <Nav.Input aria-describedby='help-vedtak'
                  label={t('buc:form-vedtakId')}
                  value={_vedtakId || vedtakId}
                  id='c-startcase-vedtakid-input'
                  onChange={this.onVedtakIdChange.bind(this)} />
                <span id='help-vedtak'>{t('buc:help-vedtakId')}</span>
              </div>
            </Nav.Row> : null}
          {this.renderInstitutions()}

        <Nav.Row className='mb-4 mt-4'>
          <div className='col-md-12'>
            <Nav.Hovedknapp
              id='c-startcase-forward-button'
              className='forwardButton'
              disabled={!this.allowedToForward()}
              onClick={this.onForwardButtonClick.bind(this)}>{t('ui:go')}</Nav.Hovedknapp>
          </div>
        </Nav.Row>
      </React.Fragment>
    }
}

StartCase.propTypes = {
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
)(
  withTranslation()(StartCase)
)
