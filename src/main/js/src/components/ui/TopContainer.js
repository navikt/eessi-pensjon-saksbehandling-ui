import React, { Component } from 'react';
import PT from 'prop-types';

import * as Nav from './Nav'
import TopHeader from './TopHeader';
import AlertHeader from './AlertHeader';

class TopContainer extends Component {

    render () {

        return <div className='h-100'>
            <TopHeader/>
            <AlertHeader/>
            <Nav.Container fluid={true}>
                {this.props.children}
            </Nav.Container>
        </div>
    }
}

TopContainer.propTypes = {
    children : PT.node.isRequired
};

export default TopContainer;
