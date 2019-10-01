import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'
import * as appActions from 'actions/app'
import * as uiActions from 'actions/ui'
import { Alert, Banner, Modal, Nav } from 'eessi-pensjon-ui'
import InternalTopHeader from 'components/Header/InternalTopHeader'
import Footer from 'components/Footer/Footer'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'

import './TopContainer.css'

const mapStateToProps = (state) => {
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
    modalOpen: state.ui.modalOpen,
    highContrast: state.ui.highContrast
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...uiActions, ...appActions }, dispatch) }
}

export const TopContainer = ({
  actions, className, children, clientErrorMessage, clientErrorStatus, error,
  expirationTime, fluid = true, footerOpen, gettingUserInfo, header, history,
  highContrast, isLoggingOut, modal, modalOpen, params, serverErrorMessage, t, username
}) => {
  const handleModalClose = () => {
    actions.closeModal()
  }

  const onClientClear = () => {
    actions.clientClear()
  }

  return (
    <div
      className={classNames('c-topContainer', className, { highContrast: highContrast })}
    >
      <InternalTopHeader
        actions={actions}
        t={t}
        history={history}
        username={username}
        gettingUserInfo={gettingUserInfo}
        isLoggingOut={isLoggingOut}
      />
      {header ? (
        <Banner
          t={t}
          header={header}
          toggleHighContrast={actions.toggleHighContrast}
        />) : null}
      <Alert
        type='client'
        t={t}
        clientErrorMessage={clientErrorMessage}
        clientErrorStatus={clientErrorStatus}
        error={error}
        onClientClear={onClientClear}
      />
      <Alert
        type='server'
        t={t}
        serverErrorMessage={serverErrorMessage}
        error={error}
        onClientClear={onClientClear}
      />
      <Nav.Container
        className='_container p-0'
        fluid={fluid}
      >
        {children}
      </Nav.Container>
      <Modal
        modalOpen={modalOpen}
        modal={modal}
        onModalClose={handleModalClose}
      />
      <SessionMonitor
        t={t}
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
