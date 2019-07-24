import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'

import { connect, bindActionCreators } from 'store'
import Icons from 'components/Icons'
import { AlertStripe } from 'components/Nav'
import * as alertActions from 'actions/alert'
import { getDisplayName } from 'utils/displayName'

import './Alert.css'

export const mapStateToProps = (state) => {
  return {
    clientErrorStatus: state.alert.clientErrorStatus,
    clientErrorMessage: state.alert.clientErrorMessage,
    serverErrorMessage: state.alert.serverErrorMessage,
    error: state.alert.error
  }
}

export const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(alertActions, dispatch) }
}

export const errorTypes = {
  OK: 'suksess',
  ERROR: 'feil',
  WARNING: 'advarsel'
}

export const Alert = (props) => {
  const { actions, className, clientErrorStatus, clientErrorMessage, error, fixed, t, type, serverErrorMessage } = props

  const onClientClear = () => {
    actions.clientClear()
  }

  const printError = (error) => {
    let errorMessage = []
    if (error.status) {
      errorMessage.push(error.status)
    }
    if (error.message) {
      errorMessage.push(error.message)
    }
    if (error.serverMessage) {
      errorMessage.push(error.serverMessage)
    }
    if (error.uuid) {
      errorMessage.push(error.uuid)
    }
    return errorMessage.join(' ')
  }

  if (type === 'server') {
    if (!serverErrorMessage) {
      return null
    }

    let message = t(serverErrorMessage)
    if (error) {
      message += ': ' + printError(error)
    }
    return <AlertStripe
      className={classNames('c-ui-alert', 'server', className)} type={errorTypes.ERROR}>
      {message}
      <Icons className='closeIcon' size='1x' kind='solidclose' onClick={onClientClear} />
    </AlertStripe>
  }

  if (!clientErrorMessage) {
    return null
  }

  const separatorIndex = clientErrorMessage.lastIndexOf('|')
  let message

  if (separatorIndex >= 0) {
    message = t(clientErrorMessage.substring(0, separatorIndex)) + ': ' + clientErrorMessage.substring(separatorIndex + 1)
  } else {
    message = t(clientErrorMessage)
  }

  if (error) {
    message += ': ' + printError(error)
  }

  return <AlertStripe
    className={classNames(className, 'c-ui-alert', { fixed: fixed || true })}
    type={errorTypes[clientErrorStatus]}>
    {message}
    <Icons className='closeIcon' size='1x' kind='solidclose' onClick={onClientClear} />
  </AlertStripe>
}

Alert.propTypes = {
  actions: PT.object.isRequired,
  className: PT.string,
  clientErrorStatus: PT.string,
  clientErrorMessage: PT.string,
  error: PT.object,
  fixed: PT.bool,
  t: PT.func.isRequired,
  type: PT.string.isRequired,
  serverErrorMessage: PT.string
}

const ConnectedAlert = connect(mapStateToProps, mapDispatchToProps)(Alert)
ConnectedAlert.displayName = `Connect(${getDisplayName((Alert))})`
export default ConnectedAlert
