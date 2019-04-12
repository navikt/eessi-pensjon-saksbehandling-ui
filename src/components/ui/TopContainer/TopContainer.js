import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
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
    highContrast: state.ui.highContrast
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
    const { className, style, history, sideContent, userRole, header, highContrast } = this.props

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
          <Nav.Container className={classNames('_container')}>
            {this.props.children}
          </Nav.Container>
          <Modal />
          {userRole === constants.SAKSBEHANDLER ? <SessionMonitor
            sessionExpiringWarning={1000 * 60 * 55} /* 55 minutes */
            checkInterval={1000 * 60} /* check every minute */
            sessionExpiredReload={1000 * 60 * 61} /* At 61st minute */
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
