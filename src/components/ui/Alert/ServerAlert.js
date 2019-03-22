import React, { Component } from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { bindActionCreators } from 'redux'

import Icons from '../Icons'
import * as Nav from '../Nav'

import * as alertActions from '../../../actions/alert'

import './ServerAlert.css'

const mapStateToProps = (state) => {
  return {
    serverErrorMessage: state.alert.serverErrorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, alertActions), dispatch) }
}

class ServerAlert extends Component {

  clientClear () {
    const { actions } = this.props
    actions.clientClear()
  }

  render () {
    let { t, serverErrorMessage } = this.props

    return serverErrorMessage ? <Nav.AlertStripe
      className='c-ui-serverAlert' type='feil' solid>
      {t(serverErrorMessage)}
      <Icons className='closeIcon' size='1x' kind='close' onClick={this.clientClear.bind(this)} />
    </Nav.AlertStripe> : null
  }
}

ServerAlert.propTypes = {
  t: PT.func.isRequired,
  serverErrorMessage: PT.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(ServerAlert)
)
