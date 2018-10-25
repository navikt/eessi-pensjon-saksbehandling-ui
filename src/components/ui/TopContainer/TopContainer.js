import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-beautiful-dnd'

import * as Nav from '../Nav'
import TopHeader from '../Header/TopHeader'
import Footer from '../Footer/Footer'
import ClientAlert from '../Alert/ClientAlert'
import ServerAlert from '../Alert/ServerAlert'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import Drawer from '../Drawer/Drawer'
import Modal from '../Modal/Modal'

import './TopContainer.css'

const mapStateToProps = (state) => {
  return {
    file: state.storage.file,
    droppables: state.app.droppables
  }
}

const mapDispatchToProps = () => {
  return {}
}

class TopContainer extends Component {
  onDragEnd (e) {
    const { droppables, file } = this.props

    if (e.source && e.source.droppableId === 'c-pdf-dndExternalFiles-droppable' && e.destination) {
      let droppableRef = droppables[e.destination.droppableId]
      droppableRef.getWrappedInstance().addFile(file)
    }
  }

  render () {
    const { className, style, history, sideContent } = this.props

    return <div style={style} className={classNames('c-ui-topContainer', className)}>
      <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
        <Drawer sideContent={sideContent}>
          <TopHeader />
          <ClientAlert />
          <ServerAlert />
          <Modal />
          <Breadcrumbs history={history} />
          <Nav.Container className='_container' fluid>
            {this.props.children}
          </Nav.Container>
          <Footer />
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
  file: PT.object,
  sideContent: PT.object.isRequired,
  history: PT.object.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopContainer)
