import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

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
      const { history, dataSent } = this.props

      if (!dataSent) {
        history.push(routes.CASE)
      }
    }

    componentDidUpdate () {
      const { history, dataSent } = this.props

      if (!dataSent) {
        history.push(routes.CASE)
      }
    }

    onCreateNewButtonClick () {
      const { history, actions, dataSent } = this.props

      let searchParams = new URLSearchParams()
      let search = {
        sakId: dataSent.sakId,
        aktoerId: dataSent.aktoerId,
        rinaId: dataSent.euxcaseid
      }
      Object.keys(search).forEach(key => searchParams.append(key, search[key]))

      history.push(routes.CASE + '?' + searchParams.toString())
      actions.clearData()
    }

    onGoToStartButtonClick () {
      const { history, actions, dataSent } = this.props

      history.push(routes.ROOT + '?rinaId=' + dataSent.euxcaseid)
      actions.clearData()
    }

    render () {
      let { t, history, location } = this.props

      return <div>
        <div className='fieldset animate'>
          <Nav.Row>
            <Nav.Column className='sendCase'>
              <div>{t('case:form-caseSent')}</div>
            </Nav.Column>
          </Nav.Row>
        </div>
        <div className='mb-4 p-4'>
          <Nav.Hovedknapp className='goToStartButton' onClick={this.onGoToStartButtonClick.bind(this)}>{t('ui:goToStart')}</Nav.Hovedknapp>
          <Nav.Knapp className='ml-3 createNewButton' onClick={this.onCreateNewButtonClick.bind(this)}>{t('ui:createNew')}</Nav.Knapp>
        </div>
      </div>
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
  withTranslation()(SendCase)
)
