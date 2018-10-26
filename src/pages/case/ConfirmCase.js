import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { translate } from 'react-i18next'

import * as Nav from '../../components/ui/Nav'
import RenderConfirmData from '../../components/case/RenderConfirmData'
import Case from './Case'

import * as routes from '../../constants/routes'
import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {

    dataToConfirm: state.case.dataToConfirm,
    dataToGenerate: state.case.dataToGenerate,
    action: state.ui.action,
    language: state.ui.language,
    generatingCase: state.loading.generatingCase
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, caseActions, uiActions), dispatch) }
}

class ConfirmCase extends Component {
  componentDidMount () {
    let { history, actions, dataToConfirm } = this.props

    if (!dataToConfirm) {
      history.push(routes.ROOT)
    } else {
      actions.addToBreadcrumbs({
        url: routes.CASE_CONFIRM,
        ns: 'case',
        label: 'case:app-confirmCaseTitle'
      })
    }
  }

  componentDidUpdate () {
    const { history, dataToGenerate, dataToConfirm, action } = this.props

    if (!dataToConfirm) {
      history.push(routes.ROOT)
    }

    if (dataToGenerate && action === 'forward') {
      history.push(routes.CASE_GENERATE)
    }
  }

  onBackButtonClick () {
    const { history, actions, dataToConfirm } = this.props

    actions.navigateBack()
    history.push(routes.CASE_GET + '/' + dataToConfirm.sakId + '/' + dataToConfirm.aktoerId +
            (dataToConfirm.rinaId ? '/' + dataToConfirm.rinaId : null))
  }

  onForwardButtonClick () {
    const { actions, dataToConfirm } = this.props

    actions.navigateForward()
    actions.generateData(dataToConfirm)
  }

  render () {
    const { t, history, location, dataToConfirm, generatingCase } = this.props

    let buttonText = generatingCase ? t('case:loading-generatingCase') : t('ui:confirmAndGenerate')

    if (!dataToConfirm) {
      return null
    }

    return <Case className='p-case-confirmCase'
      title='case:app-confirmCaseTitle'
      description='case:app-confirmCaseDescription'
      stepIndicator={1}
      history={history}
      location={location}>
      <div className='fieldset animate'>
        <Nav.Row>
          <Nav.Column>
            <RenderConfirmData dataToConfirm={dataToConfirm} />
          </Nav.Column>
        </Nav.Row>
      </div>
      <Nav.Row className='mb-4 p-4'>
        <div className='col-md-6 mb-2'>
          <Nav.Knapp className='w-100 backButton' type='standard' onClick={this.onBackButtonClick.bind(this)}>{t('ui:back')}</Nav.Knapp>
        </div>
        <div className='col-md-6 mb-2'>
          <Nav.Hovedknapp className='w-100 forwardButton' disabled={generatingCase} spinner={generatingCase} onClick={this.onForwardButtonClick.bind(this)}>{buttonText}</Nav.Hovedknapp>
        </div>
      </Nav.Row>
    </Case>
  }
}

ConfirmCase.propTypes = {
  actions: PT.object.isRequired,
  history: PT.object.isRequired,
  location: PT.object.isRequired,
  generatingCase: PT.bool,
  t: PT.func.isRequired,
  dataToConfirm: PT.object.isRequired,
  action: PT.string,
  dataToGenerate: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(ConfirmCase)
)
