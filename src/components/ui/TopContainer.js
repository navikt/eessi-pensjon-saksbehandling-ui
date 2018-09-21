import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

import * as Nav from './Nav';
import TopHeader from './Header/TopHeader';
import ServerAlert from './Alert/ServerAlert';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Modal from './Modal';

class TopContainer extends Component {

    render () {

        const { className, style, history } = this.props;

        return <div style={style}
            className={classNames('topcontainer', className)}>
            <TopHeader/>
            <ServerAlert/>
            <Modal/>
            <Breadcrumbs history={history}/>
            <Nav.Container fluid={true}>
                {this.props.children}
            </Nav.Container>
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

