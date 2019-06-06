import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'store'
import { DragDropContext } from 'react-beautiful-dnd'

import * as Nav from '../Nav'
import Alert from '../Alert/Alert'
import Drawer from '../Drawer/Drawer'
import Banner from '../Banner/Banner'
import Modal from '../Modal/Modal'
import InternalTopHeader from '../Header/InternalTopHeader'
import Footer from '../Footer/Footer'
import SessionMonitor from '../../app/SessionMonitor'

import * as constants from '../../../constants/constants'
import './TopContainer.css'

const mapStateToProps = (state) => {
  return {
    userRole: state.app.userRole,
    file: state.storage.file,
    droppables: state.app.droppables,
    highContrast: state.ui.highContrast,
    remainingTime: state.app.remainingTime
  }
}

const mapDispatchToProps = () => {
  return {}
}

export class TopContainer extends Component {
  onDragEnd (e) {
    const { droppables, file } = this.props

    if (e.source && e.source.droppableId === 'c-pdf-dndExternalFiles-droppable' && e.destination) {
      let droppableRef = droppables[e.destination.droppableId]
      droppableRef.getWrappedInstance().addFile(file)
    }
  }

  render () {
    const { className, containerClassName, style, history} = this.props
    const { sideContent, userRole, header, highContrast, fluid, remainingTime } = this.props
    /* how many minutes starts the warnings */
    let minutesForWarning = 5
    /* X minutes before expired */
    let sessionExpiringWarning = remainingTime - 1000 * 60 * minutesForWarning
    if (sessionExpiringWarning <= 1) {sessionExpiringWarning = 1}
    /* check every minute */
    let checkInterval = 1000 * 60
    /* At expired time plus 1 minute */
    let sessionExpiredReload = remainingTime + 1000 * 60

    return <div style={style} className={classNames('c-ui-topContainer', userRole, className,
      { 'highContrast': highContrast })}>
      <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
        <Drawer className={userRole} sideContent={sideContent}>
          {
            (window.eessipen && window.eessipen.ZONE === 'sbs')
              ? null
              : <InternalTopHeader history={history} />
          }
          {header ? <Banner header={header} /> : null}
          <Alert type='client' />
          <Alert type='server' />
          <Nav.Container fluid={fluid || false} className={classNames('_container', containerClassName)}>
            {this.props.children}
          </Nav.Container>
          <Modal />
          {userRole === constants.SAKSBEHANDLER ? <SessionMonitor
            sessionExpiringWarning={sessionExpiringWarning}
            checkInterval={checkInterval}
            sessionExpiredReload={sessionExpiredReload}
          /> : null}
          {userRole === constants.SAKSBEHANDLER ? <Footer /> : null}
        </Drawer>
      </DragDropContext>
    </div>
  }
}

TopContainer.propTypes = {
  children: PT.node.isRequired,
  className: PT.string,
  style: PT.object,
  droppables: PT.object,
  file: PT.oneOfType([PT.object, PT.string]),
  sideContent: PT.object,
  history: PT.object.isRequired,
  header: PT.oneOfType([PT.node, PT.string])
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopContainer)
