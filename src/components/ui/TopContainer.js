import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

import * as Nav from './Nav';
import TopHeader from './Header/TopHeader';
import ServerAlert from './Alert/ServerAlert';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Modal from './Modal';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class TopContainer extends Component {

   state = {
        toggled: false,
	    width: 10,
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

        const { className, style, history } = this.props;

        return <div style={style}
            className={classNames('topcontainer', className)}>
            <TopHeader/>
            <ServerAlert/>
            <Modal/>
            <Breadcrumbs history={history}/>
            <div id="wrapper" className={classNames( { toggled : this.state.toggled } )}>

                <div id="sidebar-wrapper"
                  style={{backgroundColor: 'whitesmoke', float: "left", width: this.state.width,
                    minHeight: '600px', position: 'sticky', top: 0,left: 0, transition: 'width 0.2s ease-out'}}>

                     <div style={{overflow: 'hidden'}}>
                        <Slider value={this.state.width} min={0} max={500} step={1} onChange={this.changeSidebarWidth.bind(this)}/>

                     </div>

                    <div style={{width: '10px', background: 'red', height: '100%', right: 0, top: 0, position: 'absolute'}}>
                        <button style={{width: '10px', minHeight: '600px', padding: 0, border: 0}} onClick={this.toggle.bind(this)}>
                            {this.state.toggled ? '<' : '>'}
                        </button>
                    </div>
               </div>
               <div id="page-content-wrapper" style={{paddingLeft: this.state.width, transition: 'padding 0.2s ease-out'}}>

                    <Nav.Container fluid={true}>
                        {this.props.children}
                    </Nav.Container>
                </div>
            </div>
        </div>
    }
}

TopContainer.propTypes = {
    children  : PT.node.isRequired,
    className : PT.string,
    style     : PT.object,
    history   : PT.object.isRequired
};

export default TopContainer;

