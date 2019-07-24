import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'store'

import * as Nav from 'components/Nav'
import Alert from 'components/Alert/Alert'
import Banner from 'components/Banner/Banner'
import Modal from 'components/Modal/Modal'
import InternalTopHeader from 'components/Header/InternalTopHeader'
import Footer from 'components/Footer/Footer'
import SessionMonitor from 'components/SessionMonitor/SessionMonitor'
import { getDisplayName } from 'utils/displayName'

import './TopContainer.css'


const mapStateToProps = (state) => {
  return {
    highContrast: state.ui.highContrast,
    remainingTime: state.app.remainingTime
  }
}

const mapDispatchToProps = () => {
  return {}
}

export class TopContainer extends Component {
  render () {
    const { className, containerClassName, style, history, t, header, highContrast, fluid, remainingTime } = this.props
    /* how many minutes starts the warnings */
    let minutesForWarning = 5
    /* X minutes before expired */
    let sessionExpiringWarning = remainingTime - 1000 * 60 * minutesForWarning
    if (sessionExpiringWarning <= 1) { sessionExpiringWarning = 1 }
    /* check every minute */
    let checkInterval = 1000 * 60
    /* At expired time plus 1 minute */
    let sessionExpiredReload = remainingTime + 1000 * 60

    return <div style={style}
      className={classNames('c-topContainer', className, { 'highContrast': highContrast })}>
      <InternalTopHeader t={t} history={history} />
      {header ? <Banner t={t} header={header} toggleHighContrast={actions.toggleHighContrast} /> : null}
      <Alert type='client' t={t} />
      <Alert type='server' t={t} />
      <Nav.Container fluid={fluid || false} className={classNames('_container', containerClassName)}>
        {this.props.children}
      </Nav.Container>
      <Modal />
      <SessionMonitor
        t={t}
        sessionExpiringWarning={sessionExpiringWarning}
        checkInterval={checkInterval}
        sessionExpiredReload={sessionExpiredReload}
      />
      <Footer />
    </div>
  }
}

TopContainer.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
  style: PT.object,
  history: PT.object.isRequired,
  header: PT.oneOfType([PT.node, PT.string])
}

const ConnectedTopContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopContainer)

ConnectedTopContainer.displayName = `Connect(${getDisplayName(TopContainer)})`
export default ConnectedTopContainer
