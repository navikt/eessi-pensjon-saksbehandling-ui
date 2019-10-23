import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'
import * as alertActions from 'actions/alert'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import { Alert, Banner, Modal, Nav } from 'eessi-pensjon-ui'
import './TopContainer.css'

const mapStateToProps = (state) => {
  /* istanbul ignore next */
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
    highContrast: state.ui.highContrast
  }
}

const mapDispatchToProps = (dispatch) => {
  /* istanbul ignore next */
  return { actions: bindActionCreators({ ...alertActions, ...appActions, ...uiActions }, dispatch) }
}

export const TopContainer = ({
  actions, className, children, clientErrorMessage, clientErrorStatus, error,
  expirationTime, fluid = true, footerOpen, gettingUserInfo, header, history,
  highContrast, isLoggingOut, modal, params, serverErrorMessage, t, username
}) => {
  const handleModalClose = () => {
    actions.closeModal()
  }

  const onClear = () => {
    actions.clientClear()
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

  return (
    <div
      className={classNames('c-topContainer', className, { highContrast: highContrast })}
    >
      <Header
        actions={actions}
        t={t}
        history={history}
        username={username}
        gettingUserInfo={gettingUserInfo}
        isLoggingOut={isLoggingOut}
      />
      {header ? (
        <Banner
          header={header}
          toggleHighContrast={actions.toggleHighContrast}
          labelHighContrast={t('ui:highContrast')}
        />) : null}
      <Alert
        type='client'
        message={getClientErrorMessage()}
        status={clientErrorStatus}
        error={error}
        onClear={onClear}
      />
      <Alert
        type='server'
        message={getServerErrorMessage()}
        error={error}
        onClear={onClear}
      />
      <Nav.Container
        className='_container p-0'
        fluid={fluid}
      >
        {children}
      </Nav.Container>
      <Modal
        modal={modal}
        onModalClose={handleModalClose}
      />
      <SessionMonitor
        t={t}
        actions={actions}
        expirationTime={expirationTime}
      />
      <Footer
        actions={actions}
        params={params}
        footerOpen={footerOpen}
      />
    </div>
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
