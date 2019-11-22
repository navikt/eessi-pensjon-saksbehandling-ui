import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'
import * as alertActions from 'actions/alert'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import SnowStorm from 'react-snowstorm'
import { Alert, Banner, Modal } from 'eessi-pensjon-ui'
import './TopContainer.css'

const mapStateToProps = /* istanbul ignore next */ (state) => {
  return {
    clientErrorStatus: state.alert.clientErrorStatus,
    clientErrorMessage: state.alert.clientErrorMessage,
    serverErrorMessage: state.alert.serverErrorMessage,
    error: state.alert.error,
    expirationTime: state.app.expirationTime,
    params: state.app.params,
    username: state.app.username,
    gettingUserInfo: state.loading.gettingUserInfo,
    isLoggingOut: state.loading.isLoggingOut,
    footerOpen: state.ui.footerOpen,
    modal: state.ui.modal,
    snow: state.ui.snow,
    highContrast: state.ui.highContrast
  }
}

const mapDispatchToProps = /* istanbul ignore next */ (dispatch) => {
  return { actions: bindActionCreators({ ...alertActions, ...appActions, ...uiActions }, dispatch) }
}

export const TopContainer = ({
  actions, className, children, clientErrorMessage, clientErrorStatus, error,
  expirationTime, fluid = true, footerOpen, gettingUserInfo, header, history,
  highContrast, isLoggingOut, modal, params, serverErrorMessage, snow, t, username
}) => {
  const handleModalClose = () => {
    actions.closeModal()
  }

  const onClear = () => {
    actions.clientClear()
  }

  const handleHighContrastToggle = () => {
    actions.toggleHighContrast()
  }

  const getClientErrorMessage = () => {
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
    return message
  }

  const getServerErrorMessage = () => {
    return serverErrorMessage ? t(serverErrorMessage) : undefined
  }

  if (_.isNil(window.onerror)) {
    window.onerror = (msg, src, lineno, colno, error) => {
      actions.clientError({ message: msg })
    }
  }

  return (
    <>
      {snow ? <SnowStorm /> : null}
      <Header
        actions={actions}
        className={classNames({ highContrast: highContrast })}
        t={t}
        history={history}
        username={username}
        gettingUserInfo={gettingUserInfo}
        isLoggingOut={isLoggingOut}
        snow={snow}
      >
        {header ? (
          <Banner
            header={header}
            onHighContrastClicked={handleHighContrastToggle}
            labelHighContrast={t('ui:highContrast')}
          />) : null}
        <Alert
          type='client'
          message={getClientErrorMessage()}
          status={clientErrorStatus}
          error={error}
          onClose={onClear}
        />
        <Alert
          type='server'
          message={getServerErrorMessage()}
          error={error}
          onClose={onClear}
        />
        {modal ? (
          <Modal
            appElement={document.getElementById('main')}
            modal={modal}
            onModalClose={handleModalClose}
          />
        ) : null}
        <SessionMonitor
          t={t}
          actions={actions}
          expirationTime={expirationTime}
        />
      </Header>
      <main id='main' role='main' className={classNames('_container', 'p-0', { 'container-fluid': fluid, highContrast: highContrast })}>
        {children}
      </main>
      <Footer
        className={classNames({ highContrast: highContrast })}
        role='contentinfo'
        actions={actions}
        params={params}
        footerOpen={footerOpen}
      />
    </>
  )
}

TopContainer.propTypes = {
  actions: PT.object.isRequired,
  className: PT.string,
  children: PT.node.isRequired,
  fluid: PT.bool,
  header: PT.oneOfType([PT.node, PT.string]),
  history: PT.object.isRequired,
  highContrast: PT.bool,
  t: PT.func.isRequired
}

const ConnectedTopContainer = connect(mapStateToProps, mapDispatchToProps)(TopContainer)
ConnectedTopContainer.displayName = 'Connect(TopContainer)'
export default ConnectedTopContainer
