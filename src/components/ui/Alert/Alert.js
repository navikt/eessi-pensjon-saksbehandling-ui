import React from 'react'
import PT from 'prop-types'
import { withTranslation } from 'react-i18next'
import classNames from 'classnames'

import { connect, bindActionCreators } from 'store'
import Icons from 'components/ui/Icons'
import { AlertStripe } from 'components/ui/Nav'
import * as alertActions from 'actions/alert'
import { getDisplayName } from 'utils/displayName'

import './Alert.css'

export const mapStateToProps = (state) => {
  return {
    clientErrorStatus: state.alert.clientErrorStatus,
    clientErrorMessage: state.alert.clientErrorMessage,
    serverErrorMessage: state.alert.serverErrorMessage,
    uuid: state.alert.uuid
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

const Alert = (props) => {
  const { actions, className, clientErrorStatus, clientErrorMessage, fixed, t, type, serverErrorMessage, uuid } = props

  const onClientClear = () => {
    actions.clientClear()
  }

  if (type === 'server') {
    return serverErrorMessage ? <AlertStripe
      className={classNames('c-ui-alert', 'server', className)} type={errorTypes.ERROR}>
      {t(serverErrorMessage)}
      {uuid}
      <Icons className='closeIcon' size='1x' kind='solidclose' onClick={onClientClear} />
    </AlertStripe> : null
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
  return <AlertStripe
    className={classNames(className, 'c-ui-alert', { fixed: fixed || true })}
    type={errorTypes[clientErrorStatus]}>
    {message}
    {uuid}
    <Icons className='closeIcon' size='1x' kind='solidclose' onClick={onClientClear} />
  </AlertStripe>
}

Alert.propTypes = {
  actions: PT.object.isRequired,
  className: PT.string,
  clientErrorStatus: PT.string,
  clientErrorMessage: PT.string,
  fixed: PT.bool,
  t: PT.func.isRequired,
  type: PT.string.isRequired,
  serverErrorMessage: PT.string,
  uuid: PT.string
}

const ConnectedAlert = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Alert))
ConnectedAlert.displayName = `Connect(${getDisplayName((withTranslation()(Alert)))})`
export default ConnectedAlert
