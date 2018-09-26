import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

import * as Nav from './Nav';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class Drawer extends Component {

   state = {
        toggled  : false,
	    width    : 10,
	    oldWidth : 250
   }

    toggle () {
        this.setState({
            toggled: !this.state.toggled,
            oldWidth:  this.state.width,
            width: this.state.oldWidth
        })
    }

    changeSidebarWidth(value) {
        this.setState({
            width: value
        })
    }

    render () {

        const { children, sidebar } = this.props;

        return <div id="wrapper" className={classNames({ toggled : this.state.toggled } )}>

            <div id="sidebar-wrapper"
              style={{backgroundColor: 'whitesmoke', width: this.state.width,
                minHeight: '600px', position: 'sticky', top: 0, zIndex: 2, transition: 'width 0.2s ease-out'}}>

                 <div style={{overflow: 'hidden'}}>
                    <Slider value={this.state.width} min={0} max={500} step={1} onChange={this.changeSidebarWidth.bind(this)}/>
                    {sidebar}
                 </div>

                <div style={{width: '10px', height: '100%', backgroundColor: 'lightgray',
                    right: 0, top: 0, position: 'absolute', cursor: 'pointer', fontSize: '0.6rem',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}
                    onClick={this.toggle.bind(this)}>
                    {this.state.toggled ? '◀' : '▶'}
                </div>
           </div>
           <div id="page-content-wrapper" style={{paddingLeft: this.state.width, marginTop: '-600px', transition: 'padding 0.2s ease-out'}}>
               {children}
            </div>
        </div>
    }
}

Drawer.propTypes = {
    children  : PT.node.isRequired,
    sidebar   : PT.func
};

export default Drawer;
