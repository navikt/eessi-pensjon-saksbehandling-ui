import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'

import Case from './Case'
import * as Nav from '../../components/ui/Nav'
import RenderGeneratedData from '../../components/case/RenderGeneratedData'

import * as routes from '../../constants/routes'
import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    dataToGenerate: state.case.dataToGenerate,
    dataSaved: state.case.dataSaved,
    savingCase: state.loading.savingCase,
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, caseActions, uiActions), dispatch) }
}

class GenerateCase extends Component {
  componentDidMount () {
    let { history, actions, dataToGenerate } = this.props

    if (!dataToGenerate) {
      history.push(routes.CASE_START)
    } else {
      actions.addToBreadcrumbs([{
        url: routes.CASE,
        label: 'case:app-caseTitle'
      }, {
        url: routes.CASE_GENERATE,
        label: 'case:app-generateCaseTitle'
      }])
    }
  }

  componentDidUpdate () {
    const { history, dataToGenerate, dataSaved } = this.props

    if (!dataToGenerate) {
      history.push(routes.CASE_START)
    }

    if (dataSaved) {
      history.push(routes.CASE_SAVE)
    }
  }

  onBackButtonClick () {
    const { history, actions } = this.props

    actions.cleanDataToGenerate()
    history.goBack()
  }

  onForwardButtonClick () {
    const { actions, dataToGenerate } = this.props

    let payload = {
      'institutions': dataToGenerate.institutions,
      'buc': dataToGenerate.buc,
      'sed': dataToGenerate.sed,
      'subjectArea': dataToGenerate.subjectArea,
      'sakId': dataToGenerate.sakId,
      'aktoerId': dataToGenerate.aktoerId,
      'rinaId': dataToGenerate.rinaId,
      'vedtakId': dataToGenerate.vedtakId
    }

    payload.euxCaseId = payload.rinaId

    if (!payload.euxCaseId) {
      actions.createSed(payload)
    } else {
      actions.addToSed(payload)
    }
  }

  render () {
    const { t, history, location, dataToGenerate, savingCase } = this.props

    return <Case className='p-case-generateCase'
      title={t('case:app-caseTitle') + ' - ' + t('case:app-generateCaseTitle')}
      description={t('case:app-generateCaseDescription')}
      stepIndicator={2}
      history={history}
      location={location}>
      { !dataToGenerate ? <div className='w-100 text-center'>
        <Nav.NavFrontendSpinner />
        <p>{t('case:loading-generatingCase')}</p>
      </div>
        : <React.Fragment>
          <div className='fieldset animate'>
            <Nav.Row>
              <Nav.Column>
                <RenderGeneratedData dataToGenerate={dataToGenerate || {}} />
              </Nav.Column>
            </Nav.Row>
          </div>
          <Nav.Row className='mb-4 p-4'>
            <div className='col-md-6 mb-2'>
              <Nav.Knapp className='w-100 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
            </div>
            <div className='col-md-6 mb-2'>
              <Nav.Hovedknapp className='w-100 forwardButton' disabled={savingCase} spinner={savingCase} onClick={this.onForwardButtonClick.bind(this)}>
                {savingCase ? t('case:loading-savingCase') : t('ui:confirmAndSave')}
              </Nav.Hovedknapp>
            </div>
          </Nav.Row>
        </React.Fragment> }
    </Case>
  }
}

GenerateCase.propTypes = {
  actions: PT.object.isRequired,
  history: PT.object.isRequired,
  location: PT.object.isRequired,
  savingCase: PT.bool,
  t: PT.func.isRequired,
  dataToGenerate: PT.object.isRequired,
  dataSaved: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(GenerateCase)
)
