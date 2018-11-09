import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { withNamespaces } from 'react-i18next'

import * as Nav from '../../components/ui/Nav'
import P6000 from '../../components/p6000/P6000'
import RenderConfirmData from '../../components/case/RenderConfirmData'
import Case from './Case'

import * as routes from '../../constants/routes'
import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'

const mapStateToProps = (state) => {
  return {
    dataToConfirm: state.case.dataToConfirm,
    dataToGenerate: state.case.dataToGenerate,
    language: state.ui.language,
    generatingCase: state.loading.generatingCase,
    p6000data : state.p6000.data
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, caseActions, uiActions), dispatch) }
}

class ConfirmCase extends Component {
  componentDidMount () {
    let { history, actions, dataToConfirm } = this.props

    if (!dataToConfirm) {
      history.push(routes.CASE_START)
    } else {
      actions.addToBreadcrumbs([{
        url: routes.CASE,
        label: 'case:app-caseTitle'
      }, {
        url: routes.CASE_CONFIRM,
        label: 'case:app-confirmCaseTitle'
      }])
    }
  }

  componentDidUpdate () {
    const { history, dataToGenerate, dataToConfirm } = this.props

    if (!dataToConfirm) {
      history.push(routes.CASE_START)
    }

    if (dataToGenerate) {
      history.push(routes.CASE_GENERATE)
    }
  }

  onBackButtonClick () {
    const { history, actions } = this.props

    actions.cleanDataToConfirm()
    history.goBack()
  }

  onForwardButtonClick () {
    const { actions, dataToConfirm, p6000data } = this.props

    let data = Object.assign({}, dataToConfirm)

    if (dataToConfirm.sed === 'P6000') {
      data.P6000 = Object.assign({}, p6000data)
    }
    actions.generateData(data)
  }

  render () {
    const { t, history, location, dataToConfirm, generatingCase } = this.props

    let buttonText = generatingCase ? t('case:loading-generatingCase') : t('ui:confirmAndGenerate')

    if (!dataToConfirm) {
      return null
    }

    return <Case className='p-case-confirmCase'
      title={t('case:app-caseTitle') + ' - ' + t('case:app-confirmCaseTitle')}
      description={t('case:app-confirmCaseDescription')}
      stepIndicator={1}
      history={history}
      location={location}>
      <div className='fieldset animate'>
        <RenderConfirmData dataToConfirm={dataToConfirm} />
        { dataToConfirm.sed === 'P6000' ? <P6000/> : null }
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
  dataToGenerate: PT.object
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withNamespaces()(ConfirmCase)
)
