import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect, bindActionCreators } from 'store'
import * as uiActions from 'actions/ui'
import { Alert, Banner, Modal, Nav } from 'eessi-pensjon-ui'
import InternalTopHeader from 'components/Header/InternalTopHeader'
import Footer from 'components/Footer/Footer'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import { getDisplayName } from 'utils/displayName'

import './TopContainer.css'

const mapStateToProps = (state) => {
  return {
    modal: state.ui.modal,
    modalOpen: state.ui.modalOpen,
    highContrast: state.ui.highContrast,
    clientErrorStatus: state.alert.clientErrorStatus,
    clientErrorMessage: state.alert.clientErrorMessage,
    serverErrorMessage: state.alert.serverErrorMessage,
    error: state.alert.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(uiActions, dispatch) }
}

export const TopContainer = (props) => {
  const { actions, className, children, clientErrorMessage, clientErrorStatus, error, fluid = true, header, history } = props
  const { highContrast, modal, modalOpen, serverErrorMessage, t } = props

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
      <InternalTopHeader t={t} history={history} />
      {header ? <Banner t={t} header={header} toggleHighContrast={actions.toggleHighContrast} /> : null}
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
      <Nav.Container fluid={fluid} className='_container p-0'>
        {children}
      </Nav.Container>
      <Modal modalOpen={modalOpen} modal={modal} onModalClose={handleModalClose} />
      <SessionMonitor t={t} />
      <Footer />
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
ConnectedTopContainer.displayName = `Connect(${getDisplayName(TopContainer)})`
export default ConnectedTopContainer
