import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';

import * as Nav from './Nav'
import TopHeader from './TopHeader';
import ServerAlert from './ServerAlert';

class TopContainer extends Component {

    render () {

        const { className, style } = this.props;

        return <div style={style} className={classNames(className)}>
            <TopHeader/>
            <ServerAlert/>
            <Nav.Container fluid={true}>
                {this.props.children}
            </Nav.Container>
        </div>
    }
}

TopContainer.propTypes = {
    children  : PT.node.isRequired,
    className : PT.string,
    style     : PT.object
};

export default TopContainer;
