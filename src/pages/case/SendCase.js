import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import Case from './Case'
import * as Nav from '../../components/ui/Nav'

import * as routes from '../../constants/routes'
import * as caseActions from '../../actions/case'
import * as uiActions from '../../actions/ui'
import * as appActions from '../../actions/app'

const mapStateToProps = (state) => {
  return {
    dataSent: state.case.dataSent
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions, appActions, caseActions), dispatch) }
}

class SendCase extends Component {
    state = {};

    componentDidMount () {
      const { history, actions, dataSent } = this.props

      if (!dataSent) {
        history.push(routes.CASE_GET)
      } else {
        actions.addToBreadcrumbs([{
          url: routes.CASE,
          label: 'case:app-caseTitle'
        }, {
          url: routes.CASE_SEND,
          label: 'case:app-sendCaseTitle'
        }])
      }
    }

    componentDidUpdate () {
      const { history, dataSent } = this.props

      if (!dataSent) {
        history.push(routes.CASE_GET)
      }
    }

    onCreateNewButtonClick () {
      const { history, actions, dataSent } = this.props

      history.push(routes.CASE_GET + '/' + dataSent.sakId + '/' + dataSent.aktoerId + '/' + dataSent.euxcaseid)
      actions.clearData()
    }

    onGoToStartButtonClick () {
      const { history, actions, dataSent } = this.props

      history.push(routes.ROOT + '?rinaId=' + dataSent.euxcaseid)
      actions.clearData()
    }

    render () {
      let { t, history, location } = this.props

      return <Case className='p-case-sendCase'
        title='case:app-sendCaseTitle'
        description='case:app-sendCaseDescription'
        stepIndicator={4}
        history={history}
        location={location}>
        <div className='fieldset animate'>
          <Nav.Row>
            <Nav.Column className='sendCase'>
              <div>{t('case:form-caseSent')}</div>
            </Nav.Column>
          </Nav.Row>
        </div>
        <Nav.Row className='mb-4 p-4'>
          <div className='col-md-6 mb-2'>
            <Nav.Knapp className='w-100 createNewButton' onClick={this.onCreateNewButtonClick.bind(this)}>{t('ui:createNew')}</Nav.Knapp>
          </div>
          <div className='col-md-6 mb-2'>
            <Nav.Hovedknapp className='w-100 goToStartButton' onClick={this.onGoToStartButtonClick.bind(this)}>{t('ui:goToStart')}</Nav.Hovedknapp>
          </div>
        </Nav.Row>
      </Case>
    }
}

SendCase.propTypes = {
  actions: PT.object,
  history: PT.object,
  location: PT.object,
  dataSent: PT.object,
  t: PT.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  translate()(SendCase)
)
