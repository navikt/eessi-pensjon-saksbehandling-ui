import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import './Drawer.css';

import * as uiActions from '../../../actions/ui';

const mapStateToProps = (state) => {
    return {
        drawerOpen     : state.ui.drawerOpen,
        drawerWidth    : state.ui.drawerWidth,
        drawerOldWidth : state.ui.drawerOldWidth
    };
};

const mapDispatchToProps = (dispatch) => {
    return {actions: bindActionCreators(Object.assign({}, uiActions), dispatch)};
};

class Drawer extends Component {

   state = {
       draggable: false
   }

   toggleDrawer () {

       const { actions } = this.props;

       actions.toggleDrawer();
   }

   changeDrawerWidth(value) {

        const { actions } = this.props;

        actions.changeDrawerWidth(value);
   }

   onMouseClick(e) {

       const { draggable } = this.state;

       this.toggleDrawer();
       if (draggable) {
           this.setState({
               draggable: false
           })
       }
   }

   onMouseDown(e) {

       this.setState({
            draggable: true
       })
   }

   onMouseMove(e) {

        const { actions } = this.props;
        const { draggable } = this.state;

        if (draggable) {
            let newX = e.clientX >= 10 ? e.clientX : 10;
            actions.changeDrawerWidth(newX);
        }
   }

   onMouseUp(e) {

        const { draggable } = this.state;

        if (draggable) {
            this.setState({
                draggable: false
            })
        }
   }

   render () {

       const { children, sidebar, drawerOpen, drawerWidth } = this.props;
       const { draggable } = this.state;

       return <div id="drawer-container"
           className={classNames({ toggled : drawerOpen, draggable : draggable })}
           onMouseMove={this.onMouseMove.bind(this)}
           onMouseUp={this.onMouseUp.bind(this)}>
           <div id="drawer" style={{width: drawerWidth}}>
               <div id="drawer-content">
                   {sidebar}
               </div>
               <div id="drawer-button" onMouseDown={this.onMouseDown.bind(this)} onClick={this.onMouseClick.bind(this)}>
                   {drawerOpen ? '◀' : '▶'}
               </div>
           </div>
           <div id="drawer-page" style={{paddingLeft: drawerWidth}}>
               {children}
           </div>
       </div>
   }
}

Drawer.propTypes = {
    children  : PT.node.isRequired,
    sidebar   : PT.func
};

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Drawer);
