import React, { Component } from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'

import Icons from '../Icons'
import * as Nav from '../Nav'

import * as alertActions from '../../../actions/alert'

import './Alert.css'
import { getDisplayName } from '../../../utils/displayName'

export const mapStateToProps = (state) => {
  return {
    clientErrorStatus: state.alert.clientErrorStatus,
    clientErrorMessage: state.alert.clientErrorMessage,
    serverErrorMessage: state.alert.serverErrorMessage,
    uuid: state.alert.uuid
  }
}

export const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, alertActions), dispatch) }
}

export const errorTypes = {
  OK: 'suksess',
  ERROR: 'feil',
  WARNING: 'advarsel'
}

export class Alert extends Component {
  clientClear () {
    const { actions } = this.props
    actions.clientClear()
  }

  render () {
    let { t, className, type, clientErrorStatus, clientErrorMessage, serverErrorMessage, uuid, fixed } = this.props

    if (type === 'server') {
      return serverErrorMessage ? <Nav.AlertStripe
        className={classNames('c-ui-alert', 'server', className)} type='feil'>
        {t(serverErrorMessage)}
        {uuid}
        <Icons className='closeIcon' size='1x' kind='solidclose' onClick={this.clientClear.bind(this)} />
      </Nav.AlertStripe> : null
    }

    if (!clientErrorMessage) {
      return null
    }

    let separatorIndex = clientErrorMessage.lastIndexOf('|')
    let _message
    let _fixed = fixed || true

    if (separatorIndex >= 0) {
      _message = t(clientErrorMessage.substring(0, separatorIndex)) + ': ' + clientErrorMessage.substring(separatorIndex + 1)
    } else {
      _message = t(clientErrorMessage)
    }
    return <Nav.AlertStripe
      className={classNames(className, 'c-ui-alert', { fixed: _fixed })}
      type={errorTypes[clientErrorStatus]}>
      {_message}
      {uuid}
      <Icons className='closeIcon' size='1x' kind='solidclose' onClick={this.clientClear.bind(this)} />
    </Nav.AlertStripe>
  }
}

Alert.propTypes = {
  t: PT.func.isRequired,
  actions: PT.object.isRequired,
  className: PT.string,
  type: PT.string.isRequired,
  fixed: PT.bool,
  clientErrorStatus: PT.string,
  clientErrorMessage: PT.string,
  serverErrorMessage: PT.string,
  uuid: PT.string
}

const ConnectedAlert = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation()(Alert)
)

ConnectedAlert.displayName = `Connect(${getDisplayName((
  withTranslation()(Alert)
))})`

export default ConnectedAlert
