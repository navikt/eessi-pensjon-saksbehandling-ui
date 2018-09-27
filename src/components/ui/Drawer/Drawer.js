import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators }  from 'redux';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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

   toggleDrawer () {

       const { actions } = this.props;
       actions.toggleDrawer();
   }

   changeDrawerWidth(value) {

        const { actions } = this.props;
        actions.changeDrawerWidth(value);
   }

   render () {

       const { children, sidebar, drawerOpen, drawerWidth } = this.props;

       return <div id="drawer-container" className={classNames({ toggled : drawerOpen })}>
           <div id="drawer" style={{width: drawerWidth}}>
               <div id="drawer-content">
                   <Slider value={drawerWidth} min={0} max={500} step={1} onChange={this.changeDrawerWidth.bind(this)}/>
                   {sidebar}
               </div>
               <div id="drawer-button" onClick={this.toggleDrawer.bind(this)}>
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
