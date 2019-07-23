import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'store'

import * as Nav from '../Nav'
import Alert from '../Alert/Alert'
import Drawer from '../Drawer/Drawer'
import Banner from '../Banner/Banner'
import Modal from '../Modal/Modal'
import InternalTopHeader from '../Header/InternalTopHeader'
import Footer from '../Footer/Footer'
import SessionMonitor from '../../app/SessionMonitor'

import './TopContainer.css'

import { getDisplayName } from '../../../utils/displayName'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    file: state.storage.file,
    highContrast: state.ui.highContrast,
    remainingTime: state.app.remainingTime
  }
}

const mapDispatchToProps = () => {
  return {}
}

export class TopContainer extends Component {

  render () {
    const { className, containerClassName, style, history } = this.props
    const { sideContent, userRole, header, highContrast, fluid, remainingTime } = this.props
    /* how many minutes starts the warnings */
    let minutesForWarning = 5
    /* X minutes before expired */
    let sessionExpiringWarning = remainingTime - 1000 * 60 * minutesForWarning
    if (sessionExpiringWarning <= 1) { sessionExpiringWarning = 1 }
    /* check every minute */
    let checkInterval = 1000 * 60
    /* At expired time plus 1 minute */
    let sessionExpiredReload = remainingTime + 1000 * 60

    return <div style={style} className={classNames('c-ui-topContainer', userRole, className,
      { 'highContrast': highContrast })}>
        <Drawer className={userRole} sideContent={sideContent}>
          <InternalTopHeader history={history} />
          {header ? <Banner header={header} /> : null}
          <Alert type='client' />
          <Alert type='server' />
          <Nav.Container fluid={fluid || false} className={classNames('_container', containerClassName)}>
            {this.props.children}
          </Nav.Container>
          <Modal />
          <SessionMonitor
            sessionExpiringWarning={sessionExpiringWarning}
            checkInterval={checkInterval}
            sessionExpiredReload={sessionExpiredReload}
          />
          <Footer />
        </Drawer>
    </div>
  }
}

TopContainer.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
  style: PT.object,
  file: PT.oneOfType([PT.object, PT.string]),
  sideContent: PT.object,
  history: PT.object.isRequired,
  header: PT.oneOfType([PT.node, PT.string])
}

const ConnectedTopContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopContainer)

ConnectedTopContainer.displayName = `Connect(${getDisplayName(TopContainer)})`

export default ConnectedTopContainer
