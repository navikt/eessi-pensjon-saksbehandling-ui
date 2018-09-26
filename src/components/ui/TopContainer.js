import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

import * as Nav from './Nav';
import TopHeader from './Header/TopHeader';
import ServerAlert from './Alert/ServerAlert';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Drawer from './Drawer';
import Modal from './Modal';

import ExternalFiles from '../pdf/ExternalFiles/ExternalFiles';

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
            <Drawer sidebar={<ExternalFiles/>}>
                <Nav.Container fluid={true}>
                    {this.props.children}
                </Nav.Container>
            </Drawer>
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

