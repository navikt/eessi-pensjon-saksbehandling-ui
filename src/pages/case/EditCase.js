import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import _ from 'lodash'
import { translate } from 'react-i18next'

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
    action: state.ui.action,
    loading: state.loading,
    vedtakId: state.status.vedtakId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, caseActions, appActions, uiActions), dispatch) }
}

class EditCase extends Component {
    state = {
      institutions: [],
      validation: {},
      defaultSelects: {
        subjectArea: 'case:form-chooseSubjectArea',
        buc: 'case:form-chooseBuc',
        sed: 'case:form-chooseSed',
        institution: 'case:form-chooseInstitution',
        country: 'case:form-chooseCountry'
      }
    };

    async componentDidMount () {
      const { actions, match, currentCase, institutionList, bucList, subjectAreaList, countryList, dataToConfirm, action } = this.props
      const { rinaId } = this.state

      actions.addToBreadcrumbs({
        url: routes.CASE_GET,
        ns: 'case',
        label: 'case:app-editCaseTitle'
      })

      if (_.isEmpty(currentCase)) {
        let sakId = match.params.sakid
        let aktoerId = match.params.aktoerid
        let rinaId = match.params.rinaid

        await this.setState({
          sakId: sakId,
          aktoerId: aktoerId,
          rinaId: rinaId
        })

        actions.getCaseFromCaseNumber({
          sakId: sakId,
          aktoerId: aktoerId,
          rinaId: rinaId
        })
      } else {
        await this.setState({
          sakId: currentCase.sakId,
          aktoerId: currentCase.aktoerId,
          rinaId: currentCase.rinaId
        })
      }

      if (_.isEmpty(subjectAreaList)) {
        actions.getSubjectAreaList()
      }

      if (_.isEmpty(bucList)) {
        actions.getBucList(rinaId)
      }

      if (_.isEmpty(institutionList)) {
        actions.getInstitutionList()
      }

      if (_.isEmpty(countryList)) {
        actions.getCountryList()
      }

      if (dataToConfirm && action === 'back') {
        this.setState({
          'institutions': dataToConfirm.institutions,
          'buc': dataToConfirm.buc,
          'sed': dataToConfirm.sed,
          'subjectArea': dataToConfirm.subjectArea
        })
      }
    }

    async componentDidUpdate () {
      const { history, loading, currentCase, dataToConfirm, action } = this.props

      if (currentCase && (!this.state.sakId || !this.state.aktoerId)) {
        await this.setState({
          sakId: currentCase.casenumber,
          aktoerId: currentCase.pinid,
          rinaId: currentCase.rinaid
        })
      }

      if (!loading.gettingCase && !this.state.sakId) {
        history.push(routes.CASE_GET)
      }

      if (dataToConfirm && action === 'forward') {
        history.push(routes.CASE_CONFIRM)
      }
    }

    onBackButtonClick () {
      const { history, actions } = this.props

      actions.navigateBack()
      actions.clearData()
      history.push(routes.CASE_GET)
    }

    onForwardButtonClick () {
      const { actions, currentCase, vedtakId } = this.props

      this.performAllValidations()

      if (this.noValidationErrors()) {
        actions.navigateForward()
        actions.dataToConfirm({
          'institutions': this.state.institutions,
          'buc': this.state.buc,
          'sed': this.state.sed,
          'subjectArea': this.state.subjectArea,
          'sakId': currentCase.casenumber,
          'aktoerId': currentCase.pinid,
          'rinaId': currentCase.rinaid,
          'vedtakId': vedtakId
        })
      }
    }

    performAllValidations () {
      this.validateSubjectArea(this.state.subjectArea)
      this.validateBuc(this.state.buc)
      this.validateSed(this.state.sed)
      this.validateInstitutions(this.state.institutions)
    }

    validateSubjectArea (subjectArea) {
      const { t } = this.props

      if (!subjectArea || subjectArea === this.state.defaultSelects.subjectArea) {
        this.setValidationState('subjectAreaFail', t('case:validation-chooseSubjectArea'))
      } else {
        this.resetValidationState('subjectAreaFail')
      }
    }

    validateBuc (buc) {
      const { t } = this.props

      if (!buc || buc === this.state.defaultSelects.buc) {
        this.setValidationState('bucFail', t('case:validation-chooseBuc'))
      } else {
        this.resetValidationState('bucFail')
      }
    }

    validateSed (sed) {
      const { t } = this.props

      if (!sed || sed === this.state.defaultSelects.sed) {
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

      if (!institution || institution === this.state.defaultSelects.institution) {
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
      let institutions = this.state.institutions
      institutions.push({
        institution: this.state.institution,
        country: this.state.country
      })
      this.setState({
        institutions: institutions,
        institution: undefined,
        country: undefined
      })
    }

    onRemoveInstitutionButtonClick (institution) {
      let institutions = this.state.institutions
      let newInstitutions = []

      for (var i in institutions) {
        if (institution.institution !== institutions[i].institution ||
                institution.country !== institutions[i].country) {
          newInstitutions.push(institutions[i])
        }
      }

      this.setState({
        institutions: newInstitutions
      })
    }

    resetValidationState (key) {
      let validation = this.state.validation
      if (validation.hasOwnProperty(key)) {
        delete validation[key]
        this.setState({ validation: validation })
      }
    }

    setValidationState (key, value) {
      this.setState({
        validation: Object.assign(this.state.validation, { [key]: value })
      })
    }

    onSubjectAreaChange (e) {
      let subjectArea = e.target.value
      this.setState({ subjectArea: subjectArea })
      this.validateSubjectArea(subjectArea)
    }

    onBucChange (e) {
      const { actions } = this.props

      let buc = e.target.value
      this.setState({ buc: buc })
      this.validateBuc(buc)
      if (!this.state.validation.bucFail) {
        actions.getSedList(buc, this.state.rinaId)
      }
    }

    onSedChange (e) {
      let sed = e.target.value
      this.setState({ sed: sed })
      this.validateSed(sed)
    }

    onInstitutionChange (e) {
      let institution = e.target.value
      this.setState({ institution: institution })
      this.validateInstitution(institution)
    }

    onCountryChange (e) {
      const { actions } = this.props

      let country = e.value
      this.setState({ country: country, institution: undefined })
      this.validateCountry(country)
      if (!this.state.validation.countryFail) {
        if (country !== this.state.defaultSelects.country) {
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
          key: this.state.defaultSelects[type],
          value: t(this.state.defaultSelects[type])
        }]
      }

      if (!map[0].key || (map[0].key && map[0].key !== this.state.defaultSelects[type])) {
        map.unshift({
          key: this.state.defaultSelects[type],
          value: t(this.state.defaultSelects[type])
        })
      }
      return map.map(el => {
        if (typeof el === 'string') {
          return <option value={el} key={el}>{this.getOptionLabel(el)}</option>
        } else {
          return <option value={el.key} key={el}>{this.getOptionLabel(el.value)}</option>
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

      return <Nav.Select className='subjectAreaList' bredde='xxl' feil={this.state.validation.subjectAreaFail ? { feilmelding: this.state.validation.subjectAreaFail } : null}
        label={t('case:form-subjectArea')} value={this.state.subjectArea} onChange={this.onSubjectAreaChange.bind(this)}>
        {this.renderOptions(subjectAreaList, 'subjectArea')}
      </Nav.Select>
    }

    renderCountry (currentValue) {
      const { t, countryList, locale } = this.props

      return <div className='mb-3'>
        <label className='skjemaelement__label'>{t('ui:country')}</label>
        <CountrySelect className='countrySelect' locale={locale}
          value={currentValue}
          onSelect={this.onCountryChange.bind(this)}
          list={countryList} />
      </div>
    }

    renderInstitution (currentValue) {
      const { t, institutionList } = this.props

      return <Nav.Select className='institutionList' bredde='xxl' feil={this.state.validation.institutionFail ? { feilmelding: this.state.validation.institutionFail } : null}
        label={t('case:form-institution')} value={currentValue} onChange={this.onInstitutionChange.bind(this)}>
        {this.renderOptions(institutionList, 'institution')}
      </Nav.Select>
    }

    renderBuc () {
      const { t, bucList } = this.props

      return <Nav.Select className='bucList' bredde='xxxl' feil={this.state.validation.bucFail ? { feilmelding: this.state.validation.bucFail } : null}
        label={t('case:form-buc')} value={this.state.buc} onChange={this.onBucChange.bind(this)}>
        {this.renderOptions(bucList, 'buc')}
      </Nav.Select>
    }

    renderSed () {
      const { t, sedList, bucList } = this.props

      return <Nav.Select className='sedList' bredde='xxxl' feil={this.state.validation.sedFail ? { feilmelding: this.state.validation.sedFail } : null}
        disabled={!bucList} label={t('case:form-sed')} value={this.state.sed} onChange={this.onSedChange.bind(this)}>
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

      let renderedInstitution = (institution.country && institution.country !== this.state.defaultSelects.country ? institution.country + '/' : '') + institution.institution

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

      let renderedInstitutions = []

      for (var i in this.state.institutions) {
        let institution = this.state.institutions[i]
        renderedInstitutions.push(this.renderChosenInstitution(institution))
      }

      let validInstitution = (!this.state.validation.countryFail && !this.state.validation.institutionFail) && this.state.country && this.state.institution

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
      return Object.keys(this.state.validation).length === 0 &&
               Object.keys(this.state.institutions).length !== 0 &&
               this.state.subjectArea &&
               this.state.buc &&
               this.state.sed
    }

    render () {
      const { t, history, location, currentCase, action, loading } = this.props
      const { rinaId } = this.state

      if (!currentCase) {
        return <Case className='editCase'
          title='case:app-editCaseTitle'
          description='case:app-editCaseDescription'
          stepIndicator={0}
          history={history}
          location={location}>
          <div className='w-100 text-center'>
            <Nav.NavFrontendSpinner />
            <p>{t('case:loading-gettingCase')}</p>
          </div>
        </Case>
      }

      return <Case className='p-case-editCase'
        title='case:app-editCaseTitle'
        description='case:app-editCaseDescription'
        stepIndicator={0}
        history={history}
        location={location}>
        <div className='fieldset animate'>
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
          <Nav.Row className='align-middle text-left'>
            <div className='col-md-8'>{this.renderSed()}</div>
            <div className='col-md-4 selectBoxMessage'>
              <div className='d-inline-block'>{loading && loading.sedList ? this.getSpinner('case:loading-sed') : null}</div>
              <Nav.HjelpetekstBase id='sed'>{t('case:help-sed')}</Nav.HjelpetekstBase>
            </div>
          </Nav.Row>
          {this.renderInstitutions()}
          <div>{rinaId ? t('case:form-rinaId') + ': ' + rinaId : null}</div>
        </div>

        <Nav.Row className='mb-4 p-4'>
          <div className='col-md-6 mb-2'>
            {action === 'forward' ? <Nav.Knapp className='backButton mr-4 w-100' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp> : null}
          </div>
          <div className='col-md-6 mb-2'>
            <Nav.Hovedknapp className='forwardButton w-100' disabled={!this.noValidationErrors()} onClick={this.onForwardButtonClick.bind(this)}>{t('ui:go')}</Nav.Hovedknapp>
          </div>
        </Nav.Row>
      </Case>
    }
}
EditCase.propTypes = {
  currentCase: PT.object,
  actions: PT.object,
  history: PT.object,
  location: PT.object,
  loading: PT.object,
  t: PT.func,
  match: PT.object,
  action: PT.string,
  subjectAreaList: PT.array,
  institutionList: PT.array,
  countryList: PT.array,
  sedList: PT.array,
  bucList: PT.array,
  dataToConfirm: PT.object,
  locale: PT.string,
  vedtakId: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(EditCase)
)
