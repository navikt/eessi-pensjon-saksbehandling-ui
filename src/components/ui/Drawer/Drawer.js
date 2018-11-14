import React, { Component } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import './Drawer.css'

import * as uiActions from '../../../actions/ui'

const mapStateToProps = (state) => {
  return {
    drawerOpen: state.ui.drawerOpen,
    drawerWidth: state.ui.drawerWidth,
    drawerOldWidth: state.ui.drawerOldWidth,
    drawerEnabled: state.ui.drawerEnabled
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, uiActions), dispatch) }
}

class Drawer extends Component {
   state = {
     draggable: false
   }

   toggleDrawerOpen () {
     const { actions } = this.props

     actions.toggleDrawerOpen()
   }

   changeDrawerWidth (value) {
     const { actions } = this.props

     actions.changeDrawerWidth(value)
   }

   onMouseClick () {
     const { draggable } = this.state

     this.toggleDrawerOpen()
     if (draggable) {
       this.setState({
         draggable: false
       })
     }
   }

   onMouseDown () {
     this.setState({
       draggable: true
     })
   }

   onMouseMove (e) {
     const { actions, drawerOpen } = this.props
     const { draggable } = this.state

     if (draggable && drawerOpen) {
       let newX = e.clientX >= 10 ? e.clientX : 10
       actions.changeDrawerWidth(newX)
     }
   }

   onMouseUp () {
     const { draggable } = this.state

     if (draggable) {
       this.setState({
         draggable: false
       })
     }
   }

   render () {
     const { children, sideContent, drawerOpen, drawerWidth, drawerEnabled } = this.props
     const { draggable } = this.state

     return <div className={classNames('c-ui-drawer', { toggled: drawerOpen, draggable: draggable })}
       onMouseMove={this.onMouseMove.bind(this)}
       onMouseUp={this.onMouseUp.bind(this)}>
       <div id='drawer' style={{ width: drawerEnabled ? drawerWidth : 0 }}>
         <div id='drawer-content'>
           {drawerOpen ? sideContent : null}
         </div>
         { drawerEnabled ? <div className={classNames({ toggled: drawerOpen })}
           id='drawer-button' onMouseDown={this.onMouseDown.bind(this)} onClick={this.onMouseClick.bind(this)}>
           {drawerOpen ? '◀' : '▶'}
         </div> : null }
       </div>
       <div id='drawer-page' style={{ paddingLeft: drawerEnabled ? drawerWidth : 0 }}>
         {children}
       </div>
     </div>
   }
}

Drawer.propTypes = {
  children: PT.node.isRequired,
  sideContent: PT.object,
  actions: PT.object.isRequired,
  drawerOpen: PT.bool,
  drawerWidth: PT.number,
  drawerEnabled: PT.bool.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)
